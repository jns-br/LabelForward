from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import SGDClassifier
import pg_helper
import pickle


def create_count_vectorizer():
    df = pg_helper.read_all_text()
    X_text = df.to_numpy()
    count_vec = CountVectorizer()
    count_vec.fit(X_text.ravel())
    data = pickle.dumps(count_vec)
    pg_helper.save_countvec(data)
    return count_vec


def create_model(X, y):
    # look for serialized cont vect, else create new
    count_vec = create_count_vectorizer()
    X_vect = count_vec.transform(X)
    clf = SGDClassifier(random_state=42)
    clf.fit(X_vect, y)
    #serialize
    return clf

def update_model(X, y):
    return None
    # read model from db, call partial fit
