from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score
import pg_helper
import pickle
import keys
import constants
import numpy as np
import logging

logger = logging.getLogger('logger')

def init(conn):
    init_data = pg_helper.read_init_data(conn)
    if init_data is None:
        logger.info('Random initialization')
        X_text = pg_helper.read_all_text(conn)
        labels = pg_helper.load_labels(conn)
        batch_size = int(keys.batch_size)
        X = X_text[:batch_size]
        y_list = []
        for i in range(batch_size):
            y_list.append(np.random.choice(labels))
        y = np.array(y_list)
        create_model(X, y, conn)
    else:
        logger.info('Data-backed initialization')
        X = init_data[constants.key_text_data].to_numpy()
        y = init_data[constants.key_label].to_numpy()
        create_model(X, y, conn)


def train_label_clf(conn):
    logger.info('Start classifier training')
    data = pg_helper.read_labeled_data_full(conn)
    if data is None:
        logger.info('Not enough data for training')
        return None, None, None, None
    X_text = data[constants.key_text_data]
    y = data[constants.key_major_label]
    init_data = pg_helper.read_init_data(conn)
    if init_data is not None:
        logger.info('Init data available, adding to training data')
        X_init = init_data[constants.key_text_data]
        y_init = init_data[constants.key_label]
        X_text = X_text.append(X_init, ignore_index=False)
        y = y.append(y_init)
    X_text = X_text.to_numpy(dtype=str)
    y = y.to_numpy()
    X_train, X_test, y_train, y_test = train_test_split(X_text, y, test_size=0.1, random_state=42)
    clf, id = create_model(X_train, y_train, conn)
    cur = conn.cursor()
    update_statement = constants.sql_update_taught
    for index, row in data.iterrows():
        cur.execute(update_statement, (row[constants.key_text_id],))
    conn.commit()
    logger.info('Classifier training done')
    return X_test, y_test, clf, id


def create_count_vectorizer(conn):
    logger.info('Creating new count vectorizer')
    X_text = pg_helper.read_all_text(conn)
    init_data = pg_helper.read_init_data(conn)
    if init_data is not None:
        X_init_text = init_data[constants.key_text_data].to_numpy()
        X_text = np.concatenate((np.squeeze(X_text), X_init_text))
    count_vec = CountVectorizer()
    count_vec.fit(X_text.ravel())
    data = pickle.dumps(count_vec)
    pg_helper.save_countvec(data, conn)
    logger.info('New count vectorizer created')
    return count_vec


def get_last_vectorizer(conn):
    data = pg_helper.load_last_countvec(conn)
    if data is None:
        return None
    count_vec = pickle.loads(data)
    return count_vec


def create_model(X, y, conn):
    count_vec = get_last_vectorizer(conn)
    if count_vec is None:
        count_vec = create_count_vectorizer(conn)
    X_vect = count_vec.transform(X.ravel())
    clf = LogisticRegression(random_state=42, max_iter=100000)
    clf.fit(X_vect, y)
    data = pickle.dumps(clf)
    id = pg_helper.save_model(data, conn)
    return clf, id


def create_precision_score(X_test, y_test, clf, id, conn):
    logger.info('Creating precision score')
    count_vec = get_last_vectorizer(conn)
    X_test_vect = count_vec.transform(X_test)
    y_pred = clf.predict(X_test_vect)
    score = precision_score(y_test, y_pred, average='micro')
    pg_helper.save_score(id, score, conn)
    logger.info('Precision score created')
