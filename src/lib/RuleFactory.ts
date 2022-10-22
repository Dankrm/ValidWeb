import { ChainingType } from "./ChainingType";
import ConcreteRule from "./ConcreteRule";
import ConnectionRule from "./ConnectionRule";
import Rule from "./Rule";
import { RuleType } from "./RuleType";
import { chainingTypes, Validator } from "./Validator";

type IValidatorMessage = {
    extract: string
    firstColumn: number
    hiliteLength: number
    hiliteStart: number
    lastColumn: number
    lastLine: number
    message: string
    type: string
};

export default class RuleFactory {

    constructor () {}

    factory (json : any): Set<Rule> {
        let rules = new Set<Rule>;
        json.data.messages.forEach((outerMessage: any) => {
            const rule = this.buildRule(outerMessage);
            if (rule) {
                rules.add(rule);
            }
        });
        return rules;
    }

    buildRule (outerMessage: IValidatorMessage): Rule | undefined {
        try {
            const message = outerMessage.message;
            if (message) {
                const chainingType = Validator.getInstance().classifyMessage(String(message).toLocaleLowerCase());
                const connectionRule = new ConnectionRule(chainingType);

                const [elementToValidate, validation] = this.searchForElements(message.toLowerCase());

                if (connectionRule !== null) {
                    const rule = new ConcreteRule(connectionRule, message, Validator.getInstance().classifyRuleType(outerMessage));
                    rule.setBasedElement(elementToValidate);
                    rule.setValidationElement(validation);

                    return rule;
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    searchForElements (message: string): [string, string] {
        let elementToValidate = '';
        let validation = '';
        let found = 0;
        let foundCount = 0;
        let searchWords = ['element', 'attribute', 'expected'];
        let searchSlashes = ['“', '”'];

        searchWords.forEach( word => {      
            while ((found = message.indexOf(word, found)) !== -1 && foundCount < 2) {
                if (message.charAt(found + word.length + 1) === searchSlashes[0]) {
                    if (foundCount === 0) {
                        elementToValidate = message.substring(found + word.length + 2, message.indexOf(searchSlashes[1], found + word.length + 2)); 
                    } else {
                        validation = message.substring(found + word.length + 2, message.indexOf(searchSlashes[1], found + word.length + 2)); 
                    }
                } else if (message.charAt(found - 2) === searchSlashes[1]) {
                    if (foundCount === 0) {
                        elementToValidate = message.substring(message.lastIndexOf(searchSlashes[0], found) + 1, found - 2); 
                    } else {
                        validation = message.substring(message.lastIndexOf(searchSlashes[0], found) + 1, found - 2); 
                    }
                }
                found++;
                foundCount++;
            }
        });

        return [elementToValidate, validation];
    }
}