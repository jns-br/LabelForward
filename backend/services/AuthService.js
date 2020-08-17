class AuthService {
  compareId(req, res, next) {
    const paramId = req.params.id;
    const userId = req.user.id;
    if(paramId === userId) {
      next();
    } else {
      return res.status(403).json({msg: "user id not equal to token id"});
    }
  }
}

module.exports = new AuthService();