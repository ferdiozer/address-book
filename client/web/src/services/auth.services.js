

import axios from './APIHelper';
import { AUTH_API_URL } from './apis';


const AuthServices = {
  register(params) {
    const url = `${AUTH_API_URL}/users`
    return axios
      .post(url, params)
      .then((response) => response?.data)
      .catch((error) => {
        throw new Error(`ApiService Error: ${error}`);
      });
  },
  login(params) {
    const url = `${AUTH_API_URL}/login`
    return axios
      .post(url, params)
      .then((response) => response?.data)
      .catch((error) => {
        throw new Error(`ApiService Error: ${error}`);
      });
  },
  me() {
    const url = `${AUTH_API_URL}/users/me`
    return axios
      .get(url)
      .then((response) => response?.data)
      .catch((error) => {
        throw new Error(`ApiService Error: ${error}`);
      });
  },

};

export default AuthServices;
