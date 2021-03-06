import pickle
import pg_helper
import pandas as pd
import logging

logger = logging.getLogger('logger')

def create_labels(conn, clf_id):
    logger.info('Creating labels for unlabeled data')
    count_vec = pickle.loads(pg_helper.load_count_vec(conn))
    clf = pickle.loads(pg_helper.load_model_by_id(conn, clf_id))
    data_df = pg_helper.load_unlabeled_data(conn)
    if len(data_df.index) == 0:
        return None, None
    X = count_vec.transform(data_df['text_data'].to_numpy(dtype=str).ravel())
    labels = clf.predict(X)
    labels_df = pd.DataFrame(labels, columns=['major_label'])
    data_df['major_label'] = labels_df['major_label']
    logging.info('Labels created')
    return data_df, clf

