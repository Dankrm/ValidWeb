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

    threatData (json: any): Set<Rule> {
        const options = {
            trim: true,
            ignoreAttrs: true,
            strict: false
        };

        return parseString(json.data, options, (err: any, result: any) => {
            return (new RuleFactory()).factory(result);
        });
    }
}