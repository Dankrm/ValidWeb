"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NuRequest = void 0;
const axios = require('axios');
class NuRequest {
    constructor() {
        this.sendRequest = async (html) => {
            return await axios.post({
                url: 'http://validator.nu/',
                headers: { 'Content-type': 'multipart/form-data' },
                data: {
                    parser: 'html',
                    out: 'xml',
                    content: html
                },
            });
        };
    }
}
exports.NuRequest = NuRequest;
//# sourceMappingURL=NuRequest.js.map