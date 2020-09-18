import pickle
import pg_helper
import sklearn
import keys
import numpy as np
import pandas as pd


def get_last_model(conn):
    data = pg_helper.load_last_model(conn)
    if data is None:
        return None
    else:
        clf = pickle.loads(data)
        return clf


def update_uncertainties(conn):
    untaught_data = pg_helper.load_untaught_data(conn)
    clf = get_last_model(conn)
    count_vec = pickle.loads(pg_helper.load_count_vec(conn))
    X = count_vec.transform(untaught_data['text_data'].to_numpy(dtype=str).ravel())
    probas = clf.predict_proba(X)
    highest_probas = np.array([np.max(probas[i]) for i in range(probas.shape[0])])
    probas_df = pd.DataFrame(highest_probas, columns=['uncertainty'])
    untaught_data['uncertainty'] = probas_df['uncertainty']
    return untaught_data
