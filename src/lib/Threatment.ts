import NuRequest from "./NuRequest";
import Rule from "./Rule";
import RuleFactory from "./RuleFactory";
const parseString = require("xml2js").parseString;

export default class Threatment {
    private static instance: Threatment;
    private nuRequest: NuRequest;

    private constructor () {
        this.nuRequest = NuRequest.getInstance();
    }

    public static getInstance(): Threatment {
        if (!Threatment.instance) {
            Threatment.instance = new Threatment();
        }
        return Threatment.instance;
    }

    async callApi (html : string) {
        return await this.nuRequest.sendRequest(html)
            .then((response : any) =>{
                return response;
            });
    }

    async threatData (json: any): Promise<Set<Rule>> {
        return (new RuleFactory()).factory(json);
    }
}