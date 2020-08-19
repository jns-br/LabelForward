import axios from 'axios';

class UserService {
  async register(email, password) {
    try {
      await axios.post('/api/users/signup', {
        email: email,
        password: password
      });
    } catch (err) {
      throw err;
    }
  }

  async updateEmail(oldEmail, newEmail, password) {
    try {
      await axios.post('/api/users/email', {
        email: oldEmail,
        newEmail: newEmail,
        password: password
      })
    } catch (err) {
      throw err;
    }
  }

  async updatePassword(oldPassword, newPassword) {
    try {
      await axios.post('/api/users/password', {
        oldPassword: oldPassword,
        newPassword: newPassword
      })
    } catch (err) {
      throw err;
    }
  }
}

export default new UserService();