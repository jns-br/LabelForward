import pickle
import pg_helper
import sklearn
import keys
import numpy as np
import pandas as pd


def get_last_model():
    data = pg_helper.load_last_model()
    if data is None:
        return None
    else:
        clf = pickle.loads(data)
        return clf


def make_queries():
    print('Making new queries', flush=True)
    clf = get_last_model()
    if clf is None:
        pg_helper.get_initial_batch()
    else:
        df = pg_helper.read_all_unlabeled_text()
        count_vec = pickle.loads(pg_helper.load_count_vec())
        X = count_vec.transform(df['text_data'].to_numpy().ravel())
        probas = clf.predict_proba(X)
        highest_probas = np.array([np.max(probas[i]) for i in range(probas.shape[0])])
        probas_df = pd.DataFrame(highest_probas, columns=['uncertainty'])
        df['uncertainty'] = probas_df['uncertainty']
        df = df.sort_values(by=['uncertainty'])
        set_size = int(keys.set_size)
        pg_helper.save_queries(df.head(set_size))
