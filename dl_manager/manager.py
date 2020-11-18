import redis
import keys
import pg_helper
import model_helper
import file_helper
import os
import logging
import logging.config
import yaml

if __name__ == '__main__':
    with open('logger-config.yaml', 'r') as f:
        config = yaml.safe_load(f.read())
        logging.config.dictConfig(config)

    logger = logging.getLogger('logger')
    logger.info('Connecting to Redis')
    r = redis.Redis(host=keys.redis_host, port=keys.redis_port, decode_responses=True)
    subscriber = r.pubsub()
    subscriber.subscribe('dl_manager')
    logger.info('Redis connection initialized')
    try:
        os.mkdir('/app/data/')
    except FileExistsError as error:
        print(error)
    
    conn = pg_helper.connect()

    for new_msg in subscriber.listen():
        logger.info('Received download request')
        if type(new_msg['data']) == str:
            if new_msg['data'].startswith('clf'):
                clf_id = int(new_msg['data'].split('-')[1])
                pg_helper.update_download_status(conn, clf_id, 1)
                machine_labeled_df, clf = model_helper.create_labels(conn, clf_id)
                mld_file_name = 'machine_labeled_data_' + str(clf_id)
                file_helper.save_df_to_json(mld_file_name, str(clf_id), machine_labeled_df)
                file_helper.save_clf(clf, str(clf_id))
                human_labeled_df = pg_helper.load_human_labeled_data(conn)
                hld_file_name = 'human_labeled_data'
                file_helper.save_df_to_json(hld_file_name, str(clf_id), human_labeled_df)
                file_helper.create_zip_file(str(clf_id))
                filename = '/app/data/data-' + str(clf_id) + '.zip'
                pg_helper.persist_download(conn, str(clf_id), filename)
                pg_helper.update_download_status(conn, clf_id, 2)
