module.exports = {
  insertUser: "INSERT INTO users(email, password) VALUES ($1, $2)",
  insertText:  "UPDATE text_data SET labels = array_append(labels, $1), users = array_append(users, $2) WHERE text_id = $3",
  deleteAccessor:  "DELETE FROM accessors WHERE email = $1",
  selectAccesor: "SELECT * FROM accessors WHERE email = $1",
  selectClfData: "SELECT clf_id, precision_score, created_at, download FROM classifiers",
  selectCountData: "SELECT COUNT(*) AS cnt FROM text_data",
  selectCountLabels: "SELECT COUNT(*) AS cnt FROM text_data WHERE major_label IS NOT NULL",
  selectLabels: "SELECT label FROM labels",
  selectNextText: "SELECT text_id, text_data, uncertainty FROM text_data WHERE NOT ($1 = ANY (users)) ORDER BY uncertainty ASC LIMIT 1",
  selectNextTextIgnored: "SELECT text_id, text_data, uncertainty FROM text_data WHERE NOT ($1 = ANY (users)) AND WHERE NOT predicted_label = 'ignored' ORDER BY uncertainty ASC LIMIT 1",
  selectUserByEmail: "SELECT * FROM users WHERE email = $1",
  selectUserById: "SELECT * FROM users WHERE user_id = $1",
  selectZip: "SELECT file FROM downloads WHERE clf_id = $1",
  updateUserEmail: "UPDATE users SET email = $1 WHERE user_id = $2",
  updateUserPassword: "UPDATE users SET password = $1 WHERE user_id = $2"
};