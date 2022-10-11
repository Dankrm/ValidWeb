const axios = require('axios');

export class NuRequest {
    constructor () { }

    public sendRequest = async (html: String) => {
        
        return await axios.post({
                url: 'http://validator.nu/',
                headers: {'Content-type': 'multipart/form-data'},
                data: {
                    parser: 'html',
                    out: 'xml',
                    content: html
                },
            }
        );
    };
}