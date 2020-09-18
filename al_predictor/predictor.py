import redis
import keys
import model_helper
import pg_helper

if __name__ == '__main__':
    print('Started al predictor', flush=True)
    r = redis.Redis(host=keys.redis_host, port=keys.redis_port, decode_responses=True)
    subscriber = r.pubsub()
    subscriber.subscribe('predictor')
    print('Initialized redis', flush=True)
    r.set('queryFlag', 'unavailable')
    r.set('queryCounter', 0)
    conn = pg_helper.connect()

    for new_msg in subscriber.listen():
        print('Message: ', new_msg['data'], flush=True)
        if new_msg['data'] == 'update':
            data = model_helper.update_uncertainties(conn)
            r.set('queryFlag', 'unavailable')
            pg_helper.insert_uncertainties(data, conn)
            r.set('queryFlag', 'available')
