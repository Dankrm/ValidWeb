import { DOMElement, HTMLAttributes } from "react";
import { ChainingType } from "./ChainingType";


export default class ConnectionRule {
    private chainingType : ChainingType | undefined;
    private basedElement : string = '';
    private validationElement : string = '';

    constructor () {};

    getChainingType(): ChainingType | undefined {
        return this.chainingType;
    }
    setChainingType(chainingType: ChainingType) {
        this.chainingType = chainingType;
    }
    getBasedElement(): string {
        return this.basedElement;
    }
    setBasedElement(basedElement: string) {
        this.basedElement = basedElement;
    }
    getValidationElement(): string {
        return this.validationElement;
    }
    setValidationElement(validationElement: string) {
        this.validationElement = validationElement;
    }

    validate () {
        
    }
}