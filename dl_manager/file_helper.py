import pickle
from zipfile import ZipFile
import os
from os.path import basename
import logging

logger = logging.getLogger('logger')

def save_df_to_json(fn, clf_id, df):
    logger.info('Saving dataframe as json')
    try:
        os.mkdir('/app/data/'+ clf_id +'/')
    except FileExistsError as error:
        print(error)
    path = '/app/data/' + clf_id + "/" + fn + '.json'
    df.to_json(path)
    logger.info('Dataframe saved as json')


def save_clf(clf, clf_id):
    logger.info('Saving classifer as pickle')
    path = '/app/data/' + clf_id + "/clf.p"
    with open(path, 'wb') as handle:
        pickle.dump(clf, handle)
    logger.info('Classifer saved as pickle')


def create_zip_file(clf_id):
    logger.info('Creating zip file')
    dir_name = '/app/data/' + clf_id
    zip_name = '/app/data/data-' + clf_id + '.zip'
    with ZipFile(zip_name, 'w') as zip_obj:
        for folder_name, subfolders, filenames in os.walk(dir_name):
            for filename in filenames:
                filepath = os.path.join(folder_name, filename)
                zip_obj.write(filepath, basename(filepath))
    logger.info('Zip file created')
