const axios = require('axios');
const https = require('https');

const VALIDOR_API = "http://validator.nu/?out=xml";
export default class NuRequest {
    private axiosInstance;

    constructor () {
        this.axiosInstance = axios.create({
            headers: { 'Content-type': `text/html; charset=utf-8` },
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });
     }

    public sendRequest = async (html: String) => {
        return await this.axiosInstance.post(
            VALIDOR_API, 
            {'content': html}
        );
    };
}