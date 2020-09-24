import redis
import keys
import pg_helper
import model_helper

if __name__ == '__mainn__':
    print('Starting DL Manager', flush=True)
    r = redis.Redis(host=keys.redis_host, port=keys.redis_port, decode_responses=True)
    subscriber = r.pubsub()
    subscriber.subscribe('dl_manager')
    print('Initialized redis', flush=True)

    conn = pg_helper.connect()

    for new_msg in subscriber.listen():
        print('Message: ', new_msg['data'], flush=True)
        if new_msg['data'].startswith('clf'):
            clf_id = int( new_msg['data'].split('-')[1])
            machine_labeled_df = model_helper