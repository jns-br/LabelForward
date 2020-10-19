key_data = 'data'
key_predictor = 'predictor'
key_learner = 'learner'
key_text_data = 'text_data'
key_label = 'label'
key_labels = 'labels'
key_major_label = 'major_label'
key_text_id = 'text_id'
key_ignored = 'ignored'
key_min_label_count = 'min_label_count'

msg_init = 'init'
msg_update = 'update'

sql_update_taught = "UPDATE text_data SET taught = true WHERE text_id = %s"
sql_select_labels = "SELECT label FROM labels"
sql_select_all_min_label_count = "SELECT text_id, labels, major_label FROM text_data WHERE array_length(labels, 1) >= %(min_label_count)s"
sql_update_major_label = "UPDATE text_data SET major_label = %s WHERE text_id = %s"
sql_select_not_ignored = "SELECT text_id, text_data, major_label FROM text_data WHERE major_label IS NOT NULL AND major_label != %(ignored)s"
sql_select_major_label_not_null = "SELECT text_id, text_data, major_label FROM text_data WHERE major_label IS NOT NULL"
sql_all_text = "SELECT text_data FROM text_data"
sql_select_init_data = "SELECT text_data, label FROM init_data"
sql_insert_countvec = "INSERT INTO countvecs(countvec) VALUES (%s)"
sql_select_countvec = "SELECT countvec FROM countvecs ORDER BY countvec_id DESC LIMIT 1"
sql_insert_clf = "INSERT INTO classifiers(clf, download) VALUES (%s, %s) RETURNING clf_id"
sql_insert_ignore_clf = "INSERT INTO ignoreclf(clf, download) VALUES (%s, %s) RETURNING clf_id"
sql_insert_precision_score = "UPDATE classifiers SET precision_score = %s WHERE clf_id = %s"
sql_update_precision_score_ignore = "UPDATE ignoreclf SET precision_score = %s WHERE clf_id = %s"