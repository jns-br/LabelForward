import keys
import pg_helper
import model_helper
import redis


if __name__ == '__main__':

    print('Started al learner', flush=True)
    r = redis.Redis(host=keys.redis_host, port=keys.redis_port, decode_responses=True)
    subscriber = r.pubsub()
    subscriber.subscribe('learner')
    print('Intialized redis', flush=True)

    for new_msg in subscriber.listen():
        print('Message: ', new_msg['data'], flush=True)
        # read indices, select records to df
        if new_msg['data'] == 'update':
            df = pg_helper.read_labeled_data_full()
            X = df['news'].to_numpy(dtype=str)
            y = df['label'].to_numpy()
            clf, id = model_helper.create_model(X, y)
            print('Model created and saved', flush=True)
            print('Model index:', id, flush=True)
            r.publish('predictor', id)
            print('Model id published on redis')
        # publish model index