import pickle
import pg_helper


def get_last_model():
    data = pg_helper.load_last_model()
    if data is None:
        return None
    else:
        clf = pickle.loads(data)
        return clf