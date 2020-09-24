import pickle
from zipfile import ZipFile
import os
from os.path import basename


def save_df_to_csv(fn, clf_id, df):
    os.mkdir('/usr/share/data/'+ clf_id)
    path = '/usr/share/data/' + clf_id + "/" + fn + '.csv'
    df.to_csv(path_or_buf=path, mode='w+')


def save_clf(clf, clf_id):
    path = '/usr/share/data/' + clf_id + "/clf.p"
    with open(path, 'wb') as handle:
        pickle.dump(clf, handle)


def create_zip_file(clf_id):
    dir_name = '/usr/share/data/' + clf_id
    zip_name = dir_name + '/data.zip'
    with ZipFile(zip_name, 'w') as zip_obj:
        for folder_name, subfolders, filenames in os.walk(dir_name):
            for filename in filenames:
                filepath = os.path.join(folder_name, filename)
                zip_obj.write(filepath, basename(filepath))