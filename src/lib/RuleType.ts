import { PrismaClient } from '@prisma/client';

export class RuleType {
    constructor(private readonly ruleType: PrismaClient['ruleType']) {}
}

