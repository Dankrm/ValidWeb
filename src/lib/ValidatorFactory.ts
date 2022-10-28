import Rule from "./Rule";
import { ValidateAttributes } from "./ValidateAttributes";
import { ValidateChildren } from "./ValidateChildren";
import { ValidateContent } from "./ValidateContent";
import { Validator } from "./Validator";

export class ValidatorFactory {
    public static methodFactory(found: Element, rule: Rule): Validator | null {
        let retorno;
        switch (rule.connectionRule.getChainingType().getSelector()) {
            case '>': {
                retorno = new ValidateChildren(found, rule);
            }
            case '[': {
                retorno = new ValidateAttributes(found, rule);
            }
            case 'content': {
                retorno = new ValidateContent(found, rule);
            }
            default : {
                retorno = null;
            }
        }
        return retorno;
    }
}