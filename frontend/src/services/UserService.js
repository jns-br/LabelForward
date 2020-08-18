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
}

export default new UserService();