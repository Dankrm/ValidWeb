import NuRequest from "./NuRequest";
import Rule from "./Rule";
import RuleFactory from "./RuleFactory";
import { RuleType } from "./RuleType";
import { ChainingType } from "./ChainingType";
import { Op, Sequelize } from "sequelize";

export default class Threatment {
    private static instance: Threatment;
    private nuRequest: NuRequest;
    private allRules : Set<Rule> = new Set<Rule>;

    private constructor () {
        this.nuRequest = NuRequest.getInstance();
    }

    public static getInstance(): Threatment {
        if (!Threatment.instance) {
            Threatment.instance = new Threatment();
        }
        return Threatment.instance;
    }

    public getRuleSet () {
        return this.allRules;
    }

    async callApi (html : string) {
        return await this.nuRequest.sendRequest(html)
            .then((response : any) =>{
                return response;
            });
    }

    async threatData (json: any): Promise<Set<Rule>> {
        return (new RuleFactory()).factory(json);
    }

    async requestDataToThreatment (html: string) {
        this.allRules = new Set<Rule>;
        try {
            await this.callApi(html).then(async (data) => {
                const threatedData = await this.threatData(data);
                for (const rule of threatedData) {
                    this.allRules.add(rule);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    async classifyRuleType (outerMessage: any): Promise<RuleType | null> {      
        return await RuleType.findOne({
            where: {
                code: outerMessage
            }
        });
    }

    async classifyMessage (message: string): Promise<ChainingType | null> { 
        await ChainingType.sync(); 
        
        let result = await ChainingType.findOne(
            {
                where: Sequelize.fn('instr', `'${message}'`, Sequelize.col('messageCode')),
            }
        );

        return result;
    }
}