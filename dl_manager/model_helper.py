import pickle
import pg_helper

def get_clf_by_id(conn, clf_id):
  data = pg_helper.load_model_by_id(conn, clf_id)
  clf = pickle.loads(data)
  return clf

def create_probas(conn, clf_id):
  