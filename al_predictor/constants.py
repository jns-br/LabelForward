key_data = 'data'
key_predicted_label = 'predicted_label'
key_predictor = 'predictor'
key_query_counter = 'queryCounter'
key_query_flag = 'queryFlag'
key_text_data = 'text_data'
key_text_id = 'text_id'
key_uncertainty = 'uncertainty'

msg_available = 'available'
msg_unavailable = 'unavailable'
msg_update = 'update'

sql_select_data = "SELECT text_id, text_data FROM text_data"
sql_select_last_countvec = "SELECT countvec FROM countvecs ORDER BY countvec_id DESC LIMIT 1"
sql_select_last_model = "SELECT clf FROM classifiers ORDER BY clf_id DESC LIMIT 1"
sql_update_uncertainty = "UPDATE text_data SET uncertainty = %s, predicted_label = %s WHERE text_id = %s"