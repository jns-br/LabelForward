import pickle
import pg_helper
import sklearn
import keys
import numpy as np
import pandas as pd
import constants


def get_last_model(conn):
    data = pg_helper.load_last_model(conn)
    if data is None:
        return None
    else:
        clf = pickle.loads(data)
        return clf


def update_uncertainties(conn):
    data = pg_helper.load_data(conn)
    clf = get_last_model(conn)
    count_vec = pickle.loads(pg_helper.load_count_vec(conn))
    X = count_vec.transform(data[constants.key_text_data].to_numpy(dtype=str).ravel())
    probas = clf.predict_proba(X)
    highest_probas = np.array([np.max(probas[i]) for i in range(probas.shape[0])])
    probas_df = pd.DataFrame(highest_probas, columns=[constants.key_uncertainty])
    data[constants.key_uncertainty] = probas_df[constants.key_uncertainty]
    return data
