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
    if clf is None:
        pg_helper.read_batch()
    else:
        X = pg_helper.read_all_text().to_numpy()
        probas = clf.predict_proba(X)
        highest_probas = np.array([np.argmax(y) for y in probas])
        data_with_probas = np.c_[X, highest_probas]
        selection = np.empty(shape=(keys.set_size, 2))
        for i in range(keys.set_size):
            lowest_index = np.argmin(data_with_probas[:, 1:], axis=0)
            selection[lowest_index] = data_with_probas[lowest_index]
            np.delete(arr=data_with_probas, obj=lowest_index, axis=0)
        pg_helper.save_queries(selection)
