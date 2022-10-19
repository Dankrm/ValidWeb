const axios = require('axios');

const VALIDOR_API = "https://validator.nu/?out=json";
export default class NuRequest {
    private static instance: NuRequest;
    private axiosInstance;

    private constructor () {
        this.axiosInstance = axios.create({
            headers: { 'Content-type': `text/html; charset=utf-8` },
        });
    }

    public static getInstance(): NuRequest {
        if (!NuRequest.instance) {
            NuRequest.instance = new NuRequest();
        }
        return NuRequest.instance;
    }

    public sendRequest = (html: string): Promise<any> => {
        const filteredHtml = String(html).replaceAll('\"', '\'');
        return this.axiosInstance.post(
            VALIDOR_API, 
            {content: filteredHtml}
        );
    };
}