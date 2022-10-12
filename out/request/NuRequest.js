"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NuRequest = void 0;
const axios = require('axios');
class NuRequest {
    constructor() {
        this.sendRequest = async (html) => {
            return await this.axiosInstance.post("http://validator.nu/", {
                'parser': 'html',
                'out': 'xml',
                'content': html
            });
        };
        this.axiosInstance = axios.create({
            headers: {
                'Accept': '*/*',
                'Content-type': 'multipart/form-data'
            },
        });
    }
}
exports.NuRequest = NuRequest;
//# sourceMappingURL=NuRequest.js.map