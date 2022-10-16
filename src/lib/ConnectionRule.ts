import { ChainingType } from "./ChainingType";


export default class ConnectionRule {
    private chainingType : ChainingType | undefined;
    private basedElement : Element | undefined;
    private validationElement : Element | undefined;

    constructor () {};

    getChainingType(): ChainingType | undefined {
        return this.chainingType;
    }
    setChainingType(chainingType: ChainingType) {
        this.chainingType = chainingType;
    }
    getBasedElement(): Element | undefined {
        return this.basedElement;
    }
    setBasedElement(basedElement: Element) {
        this.basedElement = basedElement;
    }
    getValidationElement(): Element | undefined {
        return this.validationElement;
    }
    setValidationElement(validationElement: Element) {
        this.validationElement = validationElement;
    }

    validate () {
        
    }
}