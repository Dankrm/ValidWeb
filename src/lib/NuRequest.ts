const axios = require('axios');
const https = require('https');

const VALIDOR_API = "https://validator.nu/?out=json&parser=html";
export default class NuRequest {
    private static instance: NuRequest;

    private constructor () {}

    public static getInstance(): NuRequest {
        if (!NuRequest.instance) {
            NuRequest.instance = new NuRequest();
        }
        return NuRequest.instance;
    }

    public sendRequest = (html: string): Promise<any> => {
        const filteredHtml = String(html)
        .replaceAll('\r', '')
        .replaceAll('\n', '');
        
        const config = {
            headers: { 
              'Content-Type': "Content-type: text/html; charset=utf-8",
            },
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
          };

        return axios.post(VALIDOR_API, filteredHtml, config);
    };
}