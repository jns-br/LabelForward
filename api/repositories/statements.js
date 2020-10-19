module.exports = {
  selectClfData: "SELECT clf_id, precision_score, created_at, download FROM classifiers",
  selectCountData: "SELECT COUNT(*) AS cnt FROM text_data",
  selectCountLabels: "SELECT COUNT(*) AS cnt FROM text_data WHERE major_label IS NOT NULL",
  selectZip: "SELECT file FROM downloads WHERE clf_id = $1"
};