const axios = require('axios');

export class NuRequest {
    private axiosInstance;
    constructor () {
        this.axiosInstance = axios.create({
            headers: {
                'Accept': '*/*',
                'Content-type': 'multipart/form-data'
            },
        });
     }

    public sendRequest = async (html: String) => {
        return await this.axiosInstance.post("http://validator.nu/", {
                'parser': 'html',
                'out': 'xml',
                'content': html
            }
        );
    };
}