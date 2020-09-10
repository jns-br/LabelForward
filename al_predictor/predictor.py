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

    for new_msg in subscriber.listen():
        print('Message: ', new_msg['data'], flush=True)
        if new_msg['data'] == 'update':
            model_helper.make_queries()
            r.set('queryDone', 'true')
        if new_msg['data'] == 'init':
            pg_helper.get_initial_batch()
            r.set('queryDone', 'true')