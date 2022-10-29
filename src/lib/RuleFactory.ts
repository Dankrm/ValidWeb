import ConcreteRule from "./Rule";
import Rule from "./Rule";
import Threatment from "./Threatment";
const translate = require('translate-google');

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
        return rules;
    }

    async buildRule (outerMessage: IValidatorMessage): Promise<Rule | undefined> {
        try {
            const message = outerMessage.message;
            if (message) {
                const messageTranslated = await translate(message, {from: 'en', to: 'pt'});
                const messageClassify = await Threatment.getInstance().classifyMessage(String(message).toLocaleLowerCase());
                const ruleTypeClassify = await Threatment.getInstance().classifyRuleType(outerMessage.type);
                if (messageClassify !== null && ruleTypeClassify !== null) {
                    const [elementToValidate, validation] = this.searchForElements(message.toLowerCase());                        
                    const rule = new ConcreteRule(messageClassify, messageTranslated, ruleTypeClassify);
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