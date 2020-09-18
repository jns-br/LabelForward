import keys
import pg_helper
import model_helper
import redis


if __name__ == '__main__':

    print('Started al learner', flush=True)
    r = redis.Redis(host=keys.redis_host, port=keys.redis_port, decode_responses=True)
    subscriber = r.pubsub()
    subscriber.subscribe('learner')
    print('Initialized redis', flush=True)
    conn = pg_helper.connect()
    print('Initialized postgres connection', flush=True)

    model_helper.init(conn)
    r.publish('predictor', 'update')
    for new_msg in subscriber.listen():
        print('Message: ', new_msg['data'], flush=True)
        if new_msg['data'] == 'update':
            X_test, y_test, clf, id = model_helper.update(conn)
            if clf != None:
                r.publish('predictor', 'update')
                model_helper.create_precision_score(X_test, y_test, clf, id, conn)

