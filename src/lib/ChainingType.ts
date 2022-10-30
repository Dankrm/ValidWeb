export class ChainingType {
    declare id: Number;
    declare chain: string;
    declare selector: string;
    declare messageCode: string;
    declare invalidation: string;

    isAttribute (): boolean {
        return this.chain.includes('attribute');
    }
}
