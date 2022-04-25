import ApiService from './api.services';

import { MAIN_API_URL } from './apis';


const MainServices = {
  addUserAddress(params) {
    return ApiService.get({ resource: MAIN_API_URL + "/v1/user/address", params });
  },
  updateUserAddress(slug, params) {
    return ApiService.update({ resource: MAIN_API_URL + "/v1/user/address", slug, params });
  },
  getUserAddress(slug) {
    return ApiService.get({ resource: MAIN_API_URL + "/v1/user/address", slug });
  },
  deleteUserAddress(slug) {
    return ApiService.delete({ resource: MAIN_API_URL + "/v1/user/address", slug });
  },
};

export default MainServices;
