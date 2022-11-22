import NuRequest from "./NuRequest";
import { RuleFactory } from "./RuleFactory";
import { Prisma, RuleType, ChainingType } from '@prisma/client';
import { prisma } from '../extension';

export class Threatment {
    private static instance: Threatment;
    private nuRequest: NuRequest;

    private constructor () {
        this.nuRequest = new NuRequest();
    }

    public static getInstance(): Threatment {
        if (!Threatment.instance) {
            Threatment.instance = new Threatment();
        }
        return Threatment.instance;
    }

    private async callApi (html : string) {
        return await this.nuRequest.sendRequest(html)
            .then((response : any) =>{
                return response;
            });
    }

    public async requestDataToThreatment (html: string) {
        try {
            await this.callApi(html).then(async (data) => {
                await this.threatData(data);
            });
        } catch (error) {
            console.error(error);
        }
    }

    private async threatData (json: any): Promise<void> {
        await (new RuleFactory()).factory(json);
    }

    public async classifyRuleType (outerMessage: any): Promise<RuleType | null> {
        return await prisma.ruleType.findFirst({
            where: {
                code: outerMessage
            }
        }); 
    }

    public async classifyMessage (message: string): Promise<Array<ChainingType> | null> { 
        return await prisma.$queryRaw<Array<ChainingType>>(
            Prisma.sql`SELECT * FROM ChainingType
            WHERE INSTR(${message}, messageCode) 
            LIMIT 1;
        `);
    }
}