

export default class ConnectionRule {
    private chainingType : string;
    private basedElement : Element;
    private validationElement : Element;

    constructor (chainingType: string, basedElement: Element, validationElement: Element) {
        this.chainingType = chainingType;
        this.basedElement = basedElement;
        this.validationElement = validationElement;
    }

    validate () {
        
    }
}