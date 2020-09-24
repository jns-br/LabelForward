import pickle


def save_df_to_csv(fn, clf_id, df):
    path = '/usr/share/data/' + clf_id + "/" + fn
    df.to_csv(path_or_buf=path)


def save_clf(clf, clf_id):
    path = '/usr/share/data/' + clf_id + "/clf.p"
    with open(path, 'wb') as handle:
        pickle.dump(clf, handle)
