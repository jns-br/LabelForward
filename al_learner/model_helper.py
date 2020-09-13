from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import pg_helper
import pickle
from collections import Counter


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


def create_majority_label(df):
    for index, row in df.iterrows():
        majority_label = find_max_occurences(row['labels'])
        if majority_label is not None:
            pg_helper.update_label(row['query_id'], majority_label, row['labels'], row['users'])


def find_majority(arr, size):
    m = {}
    for i in range(size):
        if arr[i] in m:
            m[arr[i]] += 1
        else:
            m[arr[i]] = 1

    count = 0
    for key in m:
        if m[key] > size / 2:
            count = 1
            return key
    if count == 0:
        return None


def find_max_occurences(arr):
    if len(arr) > 0:
        most_common = Counter(arr).most_common(1)[0][0]
        return most_common
    else:
        return None


def create_train_test_split(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)
    return X_train, X_test, y_train, y_test