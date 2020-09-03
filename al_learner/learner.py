import redis, keys, pg_helper

if __name__ == '__main__':

    r = redis.Redis(host=keys.redis_host, port=keys.redis_port)
    subscriber = r.pubsub()
    subscriber.subscribe('learner')

    for new_msg in subscriber.listen():
        # read indices, select records to df
        if new_msg == 'update':
            df = pg_helper.read_labeled_data()
            print('DF shape', df.shape)
        # train model
        # save model
        # publish model index