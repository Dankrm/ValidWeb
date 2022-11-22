const axios = require('axios');
const https = require('https');

export default class NuRequest {
    private validatorUrl = "https://validator.nu/?out=json&parser=html";
    
    public constructor () {}

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

        return axios.post(this.validatorUrl, filteredHtml, config);
    };
}