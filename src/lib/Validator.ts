import Rule from "./Rule";
import Threatment from "./Threatment";


export class Validator {
    private static instance: Validator;
    private threatment: Threatment = Threatment.getInstance();
    private ruleSet : Set<Rule>;

    private constructor (ruleSet : Set<Rule>) {
        this.ruleSet = ruleSet;
    }

    public static getInstance(): Validator {
        if (!Validator.instance) {
            Validator.instance = new Validator(new Set<Rule>);
        }
        return Validator.instance;
    }

    public getRuleSet () {
        return this.ruleSet;
    }

    async requestDataToThreatment (html: string) {
        this.ruleSet = new Set<Rule>;
        await this.threatment.callApi(html).then((response)=>{
            const threatedData = this.threatment.threatData(response);
            threatedData.forEach(this.ruleSet.add, this.ruleSet);
        });
    }
}