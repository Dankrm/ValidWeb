import { DOMElement, HTMLAttributes } from "react";
import { ChainingType } from "./ChainingType";


export default class ConnectionRule {
    private chainingType : ChainingType;
    private basedElement : string = '';
    private validationElement : string = '';

    constructor (chainingType: ChainingType) {
        this.chainingType = chainingType;
    };

    getChainingType(): ChainingType {
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