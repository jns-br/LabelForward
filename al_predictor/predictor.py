import redis
import keys
import constants
import model_helper
import pg_helper

if __name__ == '__main__':
    print('Started al predictor', flush=True)
    r = redis.Redis(host=keys.redis_host, port=keys.redis_port, decode_responses=True)
    subscriber = r.pubsub()
    subscriber.subscribe(constants.key_predictor)
    print('Initialized redis', flush=True)
    query_flag = r.get(constants.key_query_flag)
    if query_flag is None:
        r.set(constants.key_query_flag, constants.msg_unavailable)
    r.set(constants.key_query_counter, 0)
    conn = pg_helper.connect()

    for new_msg in subscriber.listen():
        print('Message: ', new_msg[constants.key_data], flush=True)
        if new_msg[constants.key_data] == constants.msg_update:
            data = model_helper.update_uncertainties(conn)
            r.set(constants.key_query_flag, constants.msg_unavailable)
            pg_helper.insert_uncertainties(data, conn)
            r.set(constants.key_query_flag, constants.msg_available)
            print('set query flag available', flush=True)
