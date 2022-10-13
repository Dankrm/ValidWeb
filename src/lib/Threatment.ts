import NuRequest from "./NuRequest";
import { xml2js } from "xml-js";

export default class Threatment {
    private nuRequest;
    constructor () {
        this.nuRequest = new NuRequest();
    }

    async callApi (html : string) {
        return await this.nuRequest.sendRequest(html)
            .then((response : any) =>{
                return response;
            });
    }

    threatData (json : string) {
        
    }
    
}