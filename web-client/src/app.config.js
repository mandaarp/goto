const BASE_URL = process.env.REACT_APP_ENV && process.env.REACT_APP_ENV === 'production' ? document.location.origin : 'http://127.0.0.1:3010';
const API_BASE_URL = `${BASE_URL}/api/`;
const URL_API_BASE_URL = `${API_BASE_URL}/url/`;
module.exports = {
    BASE_URL,
    API_BASE_URL,
    URL_API_BASE_URL
};
