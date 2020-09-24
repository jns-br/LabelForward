import redis
import keys
import pg_helper
import model_helper
import file_helper

if __name__ == '__mainn__':
    print('Starting DL Manager', flush=True)
    r = redis.Redis(host=keys.redis_host, port=keys.redis_port, decode_responses=True)
    subscriber = r.pubsub()
    subscriber.subscribe('dl_manager')
    print('Initialized redis', flush=True)

    conn = pg_helper.connect()

    for new_msg in subscriber.listen():
        print('Message: ', new_msg['data'], flush=True)
        if new_msg['data'].startswith('clf'):
            clf_id = int(new_msg['data'].split('-')[1])
            pg_helper.update_download_status(conn, clf_id, 1)
            machine_labeled_df, clf = model_helper.create_labels(conn, clf_id)
            mld_file_name = 'machine_labeled_data_' + str(clf_id)
            file_helper.save_df_to_csv(mld_file_name, clf_id, machine_labeled_df)
            file_helper.save_clf(clf, clf_id)
            human_labeled_df = pg_helper.load_human_labeled_data(conn)
            hld_file_name = 'human_labeled_data'
            file_helper.save_df_to_csv(hld_file_name, clf_id, human_labeled_df)
            file_helper.create_zip_file(clf_id)
            pg_helper.update_download_status(conn, clf_id, 2)
