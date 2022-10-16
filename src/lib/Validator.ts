import Rule from "./Rule";
import Threatment from "./Threatment";


export class Validator {
    private static instance: Validator;
    private threatment: Threatment = Threatment.getInstance();
    private ruleList : Set<Rule> | undefined;

    private constructor () {}

    public static getInstance(): Validator {
        if (!Validator.instance) {
            Validator.instance = new Validator();
        }
        return Validator.instance;
    }

    requestDataToThreatment (html: string) {
        this.threatment.callApi(html).then((response)=>{
            const threatedData = this.threatment.threatData(response);
        });
    }
}