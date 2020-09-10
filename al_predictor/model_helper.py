import pickle
import pg_helper
import sklearn
import keys
import numpy as np


def get_last_model():
    data = pg_helper.load_last_model()
    if data is None:
        return None
    else:
        clf = pickle.loads(data)
        return clf


def make_queries():
    clf = get_last_model()
    df = pg_helper.read_all_text()
    X = df['tweet'].to_numpy()
    probas = clf.predict_proba(X)
    highest_probas = np.array([np.argmax(y) for y in probas])
    for index, row in df.iterrows():
        df.iloc[index]['uncertainty'] = highest_probas[index]
    pg_helper.save_queries(df)