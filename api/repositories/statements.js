module.exports = {
  insertText:  "UPDATE text_data SET labels = array_append(labels, $1), users = array_append(users, $2) WHERE text_id = $3",
  selectClfData: "SELECT clf_id, precision_score, created_at, download FROM classifiers",
  selectCountData: "SELECT COUNT(*) AS cnt FROM text_data",
  selectCountLabels: "SELECT COUNT(*) AS cnt FROM text_data WHERE major_label IS NOT NULL",
  selectLabels: "SELECT label FROM labels",
  selectNextText: "SELECT text_id, text_data FROM text_data WHERE NOT ($1 = ANY (users)) ORDER BY uncertainty ASC LIMIT 1",
  selectZip: "SELECT file FROM downloads WHERE clf_id = $1"
};