import { message } from 'ant-design-vue';
import axios from 'axios';
const http = axios.create({
   // Configuration
    baseURL: "http://localhost:8080",
});


// let timeId: number;
http.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    // clearTimeout(timeId);
    // timeId = window.setTimeout(() => {
        console.log(error)
        message.error(`Network failure(${error.response.status}), Please try again`);
    // }, 200)
    return Promise.reject(error);
});
export default http;

