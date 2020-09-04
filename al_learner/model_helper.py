from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
import pg_helper
import pickle


def create_count_vectorizer():
    print('Creating new count vectorizer', flush=True)
    df = pg_helper.read_all_text()
    X_text = df.to_numpy()
    count_vec = CountVectorizer()
    count_vec.fit(X_text.ravel())
    data = pickle.dumps(count_vec)
    pg_helper.save_countvec(data)
    return count_vec


def get_last_vectorizer():
    print('Getting last count vectorizer', flush=True)
    data = pg_helper.load_last_countvec()
    if data is None:
        return None
    count_vec = pickle.loads(data)
    return count_vec


def create_model(X, y):
    print('Creating new model', flush=True)
    count_vec = get_last_vectorizer()
    if count_vec is None:
        count_vec = create_count_vectorizer()
    X_vect = count_vec.transform(X)
    clf = LogisticRegression(random_state=42)
    clf.fit(X_vect, y)
    data = pickle.dumps(clf)
    id = pg_helper.save_model(data)
    return clf, id
