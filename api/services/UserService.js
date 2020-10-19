const bcrypt = require('bcrypt');

class UserService{
  async hashPassword(plainPassword) {
    return await bcrypt.hash(plainPassword, 10);
  }

  async compareHashed(inputPassword, dbPassword) {
    return await bcrypt.compare(inputPassword, dbPassword);
  }
}

module.exports = new UserService();