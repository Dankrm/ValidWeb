const axios = require('axios');

const VALIDOR_API = "http://validator.nu/?out=json";
export default class NuRequest {
    private axiosInstance;

    constructor () {
        this.axiosInstance = axios.create({
            headers: { 'Content-type': `text/html; charset=utf-8` },
        });
     }

    public sendRequest = (html: string) => {
        return this.axiosInstance.post(
            VALIDOR_API, 
            {'content': html}
        );
    };
}