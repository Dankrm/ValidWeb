import * as assert from 'assert';
import * as vscode from 'vscode';
import { Threatment } from '../../../threatment/Threatment';
import { PrismaClient } from "@prisma/client";
import { before, describe, it } from 'mocha';
const prisma = new PrismaClient();

describe('caso ainda não for realizada a conversão de regras', () => {
	vscode.window.showInformationMessage('Start all tests.');

    before(async () => {
        await prisma.rule.deleteMany();
    });

    it('os tipos devem ser 2', async () => {
        assert.equal(await prisma.ruleType.count(), 2, "Quantidade de Tipos de Erro");
	}).timeout('10000');

	it('as regras sem texto devem ser 3', async () => {
		await Threatment.getInstance().requestDataToThreatment('');
        assert.equal(await prisma.rule.count(), 3, "Quantidade de Regras");
	}).timeout('10000');
    
});