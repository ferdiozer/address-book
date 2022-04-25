import axios from 'axios';

const token = localStorage.getItem('auth-token');

const API = axios.create();
//#  TODO !!SONRA BAK !! //!
// Request parsing interceptor
API.interceptors.request.use(
    async (config) => {
        config.headers = { Authorization: `Bearer ${localStorage.getItem('auth-token')}`, 'Content-Type': 'application/json' }
        // const headers = await getHeaders();
        // config.baseURL = await getBaseUrl();
        // if (headers) {
        //   config.headers = headers;
        //   const { accountId } = headers;
        //   if (accountId) {
        //     config.url = `${API_URL}accounts/${accountId}/${config.url}`;
        //   }
        // }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response parsing interceptor
API.interceptors.response.use(
    (response) => response,
    (error) => console.log("ERROR[main]", error),
);

export default API;
