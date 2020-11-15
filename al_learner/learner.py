import keys
import constants
import pg_helper
import model_helper
import redis
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
    subscriber.subscribe(constants.key_learner)
    logger.info('Redis connection intialized')
    conn = pg_helper.connect()
    logger.info('Postgres connection initialized')

    for new_msg in subscriber.listen():
        if new_msg[constants.key_data] == constants.msg_init:
            logger.info('Received init message')
            model_helper.init(conn)
            logger.info('Sending update message to predictor')
            r.publish(constants.key_predictor, constants.msg_update)
        if new_msg[constants.key_data] == constants.msg_update:
            logger.info('Received update message')
            batch_ready = pg_helper.is_new_batch_ready(conn)
            if batch_ready:
                X_test, y_test, clf, id = model_helper.train_label_clf(conn)
                if clf is not None:
                    logger.info('Sending update message to predictor')
                    r.publish(constants.key_predictor, constants.msg_update)
                    model_helper.create_precision_score(X_test, y_test, clf, id, conn)
