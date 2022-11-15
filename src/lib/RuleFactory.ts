import ConcreteRule from "./Rule";
import Rule from "./Rule";
import { Threatment } from "./Threatment";
import { PrismaClient } from "@prisma/client";
const translate = require('@iamtraction/google-translate');
const prisma = new PrismaClient();

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

export class RuleFactory {

    constructor () {}

    async factory (json : any): Promise<void> {
        for (const outerMessage of json.data.messages) {
            await this.buildRule(outerMessage);
        }
    }

    async buildRule (outerMessage: IValidatorMessage): Promise<void> {
        try {
            const message = outerMessage.message;
            if (message) {
                const messageTranslated = (await translate(message, {from: 'en', to: 'pt'})).text;
                const chainingType = await Threatment.getInstance().classifyMessage(String(message).toLocaleLowerCase());
                const ruleTypeClassify = await Threatment.getInstance().classifyRuleType(outerMessage.type);
                if (chainingType !== null && ruleTypeClassify !== null) {
                    const [elementToValidate, validation] = this.searchForElements(message.toLowerCase());   
                    await prisma.rule.upsert({
                        create: {
                            chainingTypeId: chainingType[0].id,
                            ruleTypeId: ruleTypeClassify.id,
                            basedElement: elementToValidate,
                            description: messageTranslated,
                            validationElement: validation
                        },
                        update: {},
                        where: {
                            chainingTypeId_basedElement_validationElement: {
                                chainingTypeId: chainingType[0].id,
                                basedElement: elementToValidate,
                                validationElement: validation
                            }
                        },
                    });
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
        let searchWords = ['element', 'attribute', 'expected', 'start'];
        let searchSlashes = ['“', '”'];

        for (const searchWord of searchWords) { 
            while ((found = message.indexOf(searchWord, found)) !== -1 && foundCount < 2) {
                if (message.charAt(found + searchWord.length + 1) === searchSlashes[0]) {
                    if (foundCount === 0) {
                        elementToValidate = message.substring(found + searchWord.length + 2, message.indexOf(searchSlashes[1], found + searchWord.length + 2)); 
                    } else {
                        validation = message.substring(found + searchWord.length + 2, message.indexOf(searchSlashes[1], found + searchWord.length + 2)); 
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
        }

        return [elementToValidate, validation];
    }
}