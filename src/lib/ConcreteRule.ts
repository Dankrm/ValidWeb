import ConnectionRule from "./ConnectionRule";
import Rule from "./Rule";


export default class ConcreteRule implements Rule {
    connectionRule: ConnectionRule | undefined;
    description: string | undefined;

    constructor () {};
    
    validate(): boolean {
        return true;
    }

}