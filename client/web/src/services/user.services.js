import ApiService from './api.services';
import { BASE_API_URL } from './apis';


const ADDRESSES = 'addresses';
const GET_ADDRESSES = 'addresses';


const UserServices = {
  addUserAddress(params) {
    return ApiService.post({ resource: BASE_API_URL + ADDRESSES, params });
  },
  updateUserAddress(slug, params) {
    return ApiService.update({ resource: BASE_API_URL + ADDRESSES, slug, params });
  },
  getUserAddress(slug) {
    return ApiService.get({ resource: BASE_API_URL + GET_ADDRESSES, slug });
  },
  deleteUserAddress(slug) {
    return ApiService.delete({ resource: BASE_API_URL + GET_ADDRESSES, slug });
  },
};

export default UserServices;
