import Rule from "./Rule";
import { RuleType } from "./RuleType";


export default class RuleFactory {

    constructor () {}

    gerar (json : any) {
        const rules = new Set<Rule>;
        debugger
        if (json.MESSAGES.ERROR) {
            const errorRuleType = new RuleType('error');

            this.recursiveNavigate(json.MESSAGES.ERROR);
        }

        if (json.MESSAGES.INFO) {
            const errorRuleType = new RuleType('type');
            
        }

        if (json.MESSAGES.WARNING) {
            const errorRuleType = new RuleType('warning');
        }
    }

    recursiveNavigate (outerMessages: any) {
        outerMessages.forEach((outerMessage: any) => {
            outerMessage.message[0];
        });
    }
}