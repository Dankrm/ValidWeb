import { ChainingType } from "./ChainingType";
import ConcreteRule from "./ConcreteRule";
import ConnectionRule from "./ConnectionRule";
import Rule from "./Rule";
import { RuleType } from "./RuleType";
import { Validator } from "./Validator";

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

    async factory (json : any): Promise<Set<Rule>> {
        const rules = new Set<Rule>;
        for (const outerMessage of json.data.messages) {
            await this.buildRule(outerMessage).then(rule => {
                if (rule) {
                    rules.add(rule);
                }
            });
        }
        debugger
        return rules;
    }

    async buildRule (outerMessage: IValidatorMessage): Promise<Rule | undefined> {
        try {
            const message = outerMessage.message;
            if (message) {
                const messageClassify = Validator.getInstance().classifyMessage(String(message).toLocaleLowerCase());
                
                return await messageClassify.then(classification => {
                    if (classification !== null) {
                        const connectionRule = new ConnectionRule(classification);

                        const [elementToValidate, validation] = this.searchForElements(message.toLowerCase());

                        if (connectionRule !== null) {
                            const rule = new ConcreteRule(connectionRule, message, Validator.getInstance().classifyRuleType(outerMessage));
                            rule.setBasedElement(elementToValidate);
                            rule.setValidationElement(validation);

                            return rule;
                        }
                    }
                });
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