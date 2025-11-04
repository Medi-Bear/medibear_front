import axios from "axios";

// axios 기본 URL 지정
axios.defaults.baseURL = import.meta.env.VITE_CORS_ALLOWED_ORIGINS;
// axios.defaults.baseURL = 'http://localhost:8080';
export default axios;