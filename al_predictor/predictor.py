import redis
import keys
import constants
import model_helper
import pg_helper
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
    subscriber.subscribe(constants.key_predictor)
    logger.info('Redis connection initialized')
    query_flag = r.get(constants.key_query_flag)
    if query_flag is None:
        r.set(constants.key_query_flag, constants.msg_unavailable)
    r.set(constants.key_query_counter, 0)
    conn = pg_helper.connect()
    logger.info('Postgres connection initialized')

    for new_msg in subscriber.listen():
        if new_msg[constants.key_data] == constants.msg_update:
            logger.info('Received update message')
            data = model_helper.update_uncertainties(conn)
            r.set(constants.key_query_flag, constants.msg_unavailable)
            pg_helper.insert_uncertainties(data, conn)
            r.set(constants.key_query_flag, constants.msg_available)
            logger.info('Query flag set available')
