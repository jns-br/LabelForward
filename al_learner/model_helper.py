from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score
import pg_helper
import pickle
import keys
import numpy as np


def init(conn):
    X_text = pg_helper.read_all_text(conn)
    labels = pg_helper.load_labels(conn)
    batch_size = int(keys.batch_size)
    X = X_text[:batch_size]
    y_list = []
    for i in range(batch_size):
        y_list.append(np.random.choice(labels))
    y = np.array(y_list)
    create_model(X, y, conn)


def update(conn):
    batch_ready = pg_helper.is_new_batch_ready(conn)
    if batch_ready == True:
        data = pg_helper.read_labeled_data_full(conn)
        if data is None:
            return
        X_text = data['text_data'].to_numpy(dtype=str)
        y = data['major_label'].to_numpy()
        X_train, X_test, y_train, y_test = train_test_split(X_text, y, test_size=0.1, random_state=42)
        clf, id = create_model(X_train, y_train, conn)
        cur = conn.cursor()
        update_statement = """
            UPDATE text_data SET taught = true WHERE text_id = %s
        """
        for index, row in data.iterrows():
            cur.execute(update_statement, (row['text_id'], ))
        conn.commit()
        return X_test, y_test, clf, id
    else:
        return None, None, None, None        


def create_count_vectorizer(conn):
    print('Creating new count vectorizer', flush=True)
    X_text = pg_helper.read_all_text(conn)
    count_vec = CountVectorizer()
    count_vec.fit(X_text.ravel())
    data = pickle.dumps(count_vec)
    pg_helper.save_countvec(data, conn)
    return count_vec


def get_last_vectorizer(conn):
    print('Getting last count vectorizer', flush=True)
    data = pg_helper.load_last_countvec(conn)
    if data is None:
        return None
    count_vec = pickle.loads(data)
    return count_vec


def create_model(X, y, conn):
    print('Creating new model', flush=True)
    count_vec = get_last_vectorizer(conn)
    if count_vec is None:
        count_vec = create_count_vectorizer(conn)
    X_vect = count_vec.transform(X.ravel())
    clf = LogisticRegression(random_state=42)
    clf.fit(X_vect, y)
    data = pickle.dumps(clf)
    id = pg_helper.save_model(data, conn)
    return clf, id


def create_precision_score(X_test, y_test, clf, id, conn):
    print('Creating precision score', flush=True)
    count_vec = get_last_vectorizer(conn)
    X_test_vect = count_vec.transform(X_test)
    y_pred = clf.predict(X_test_vect)
    score = precision_score(y_test, y_pred, average='micro')
    pg_helper.save_score(id, score, conn)
