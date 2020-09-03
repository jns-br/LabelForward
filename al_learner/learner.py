import keys
import pg_helper
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
            df = pg_helper.read_labeled_data()
            print('DF shape', df.shape, flush=True)
            print('Data frame', df.head(), flush=True)
            X = df['tweets'].to_numpy()
        # train model
        # save model
        # publish model index