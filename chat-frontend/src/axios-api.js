import axios from 'axios/index';
import {apiURL} from "./constants";

const instance = axios.create({
    baseURL: apiURL
});

export default instance;