import keys
import constants
import pg_helper
import model_helper
import redis


if __name__ == '__main__':

    print('Started al learner', flush=True)
    r = redis.Redis(host=keys.redis_host, port=keys.redis_port, decode_responses=True)
    subscriber = r.pubsub()
    subscriber.subscribe(constants.key_learner)
    print('Initialized redis', flush=True)
    conn = pg_helper.connect()
    print('Initialized postgres connection', flush=True)

    for new_msg in subscriber.listen():
        print('Message: ', new_msg[constants.key_data], flush=True)
        if new_msg[constants.key_data] == constants.msg_init:
            model_helper.init(conn)
            r.publish(constants.key_predictor, constants.msg_update)
        if new_msg[constants.key_data] == constants.msg_update:
            batch_ready = pg_helper.is_new_batch_ready(conn)
            if batch_ready:
                X_test, y_test, clf, id = model_helper.train_label_clf(conn)
                if clf is not None:
                    r.publish(constants.key_predictor, constants.msg_update)
                    model_helper.create_precision_score(X_test, y_test, clf, id, conn)
