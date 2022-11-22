import * as vscode from 'vscode';
import { SidebarRuleTypesProvider } from './sidebar/SidebarRuleTypesProvider';
import { SidebarRulesProvider } from './sidebar/SidebarRulesProvider';
import { DiagnosticCodeActionProvider } from './lib/DiagnosticCodeActionProvider';
import { Diagnostic } from './lib/Diagnostic';
import { TreeViewProvider } from './directoriesTreeView/TreeViewProvider';
import { Report } from './lib/Report';
import * as sqlite3 from 'sqlite3';
import { Prisma, PrismaClient } from '@prisma/client';
import process = require('process');
import path = require('path');

const chainingTypes = [
	{
		chain: "unclosed",
		selector: "/>",
		messageCode: "unclosed element",
		invalidation: "x$"
	},
	{
		chain: "children",
		selector: ">",
		messageCode: "must not appear as a descendant of the",
		invalidation: "y>x"
	},
	{
		chain: "childrenNot",
		selector: ">",
		messageCode: "not allowed as child of element",
		invalidation: "y>x"
	},
	{
		chain: "children",
		selector: ">",
		messageCode: "is missing a required instance of child element",
		invalidation: "x$>y"
	},
	{
		chain: "language",
		selector: "[",
		messageCode: "start tag to declare the language of this document",
		invalidation: "y$[x]"
	},       
	{
		chain: "attributeEmpty",
		selector: "[",
		messageCode: "bad value “” for attribute",
		invalidation: "x$[y]"
	},
	{
		chain: "attribute",
		selector: "[",
		messageCode: "consider adding a",
		invalidation: "x$[y]"
	},
	{
		chain: "attribute",
		selector: "[",
		messageCode: "attribute, except under certain conditions",
		invalidation: "x$[y]"
	},
	{
		chain: "attribute",
		selector: "[",
		messageCode: "is missing required attribute",
		invalidation: "x$[y]"
	},
	{
		chain: "doctype",
		selector: "doctype",
		messageCode: "non-space characters found without seeing a doctype first",
		invalidation: "$x"
	},
	{
		chain: "content",
		selector: "content",
		messageCode: "end of file seen without seeing a doctype first. expected",
		invalidation: "$x"
	},
	{
		chain: "emptyContent",
		selector: "content",
		messageCode: "empty heading",
		invalidation: "x$content"
	},
	{
		chain: "emptyContent",
		selector: "content",
		messageCode: "must not be empty",
		invalidation: "x$content"
	},
	{
		chain: "undefined",
		selector: "undefined",
		messageCode: "undefined",
		invalidation: "$x"
	}
];

const ruleTypes = [
	{
		code: "error",
		type: "Erro",
		diagnostic: 0,
		visible: true
	},
	{
		code: "info",
		type: "Informação",
		diagnostic: 1,
		visible: true
	},
];


export let prisma: PrismaClient<{ datasources: { db: { url: string; }; }; }, never, false>;

async function updatePrismaDataSource(context: vscode.ExtensionContext) {	
	const dbPath = path.join("file:", context.globalStorageUri.path.slice(3), 'validweb.sqlite');
	prisma = new PrismaClient({
		datasources: {
			db: {
				url: dbPath
			}
		}
	});
}

export const load = async (context: vscode.ExtensionContext) => {
	try {	
		await vscode.workspace.fs.writeFile(vscode.Uri.parse(context.globalStorageUri.path + '/' + 'validweb.sqlite'), new Uint8Array());
		new sqlite3.Database(context.globalStorageUri.fsPath + '/' + 'validweb.sqlite', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE);
		await prisma.$executeRaw(
			Prisma.sql `
			CREATE TABLE IF NOT EXISTS "ChainingType" (
				"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
				"chain" TEXT NOT NULL,
				"selector" TEXT NOT NULL,
				"messageCode" TEXT NOT NULL,
				"invalidation" TEXT NOT NULL
			);`
		);
		await prisma.$executeRaw(
			Prisma.sql `	
			CREATE TABLE IF NOT EXISTS "RuleType" (
				"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
				"code" TEXT NOT NULL,
				"type" TEXT NOT NULL,
				"diagnostic" INTEGER NOT NULL,
				"visible" BOOLEAN NOT NULL DEFAULT true
			);`
		);
		await prisma.$executeRaw(
			Prisma.sql `	
			CREATE TABLE IF NOT EXISTS "Rule" (
				"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
				"ruleTypeId" INTEGER NOT NULL,
				"chainingTypeId" INTEGER NOT NULL,
				"description" TEXT NOT NULL,
				"basedElement" TEXT NOT NULL,
				"validationElement" TEXT NOT NULL,
				"visible" BOOLEAN NOT NULL DEFAULT true,
				CONSTRAINT "Rule_ruleTypeId_fkey" FOREIGN KEY ("ruleTypeId") REFERENCES "RuleType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
				CONSTRAINT "Rule_chainingTypeId_fkey" FOREIGN KEY ("chainingTypeId") REFERENCES "ChainingType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
			);`
		);
		await prisma.$executeRaw(
			Prisma.sql `	
			CREATE UNIQUE INDEX "Rule_chainingTypeId_basedElement_validationElement_key" ON "Rule"("chainingTypeId", "basedElement", "validationElement");
		`);
		await prisma.rule.deleteMany();
		await prisma.ruleType.deleteMany();
		for (let ruleType of ruleTypes) {
			await prisma.ruleType.create({
				data: ruleType
			});
		}
		console.log('Added ruleTypes data');
		await prisma.chainingType.deleteMany();
		for (let chainingType of chainingTypes) {
			await prisma.chainingType.create({
				data: chainingType
			});
		}
		console.log('Added chainingTypes data');
  	} catch (e) {
		console.error(e);
		process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

export async function activate(context: vscode.ExtensionContext) {
	try {
		const filesTreeView = new TreeViewProvider((vscode.workspace.workspaceFolders) 
		? vscode.workspace.workspaceFolders[0].uri.fsPath 
		: undefined);

		context.subscriptions.push(
			vscode.window.registerTreeDataProvider('validweb-sidebar-tree', 
				filesTreeView
			)
		);

		context.subscriptions.push(
			vscode.commands.registerCommand('validweb.refreshFiles', () => {
				filesTreeView.refresh();
			})
		);

		const report = new Report();
		context.subscriptions.push(
			vscode.commands.registerCommand('validweb.generateFileReport', async (localContext) => {
				await vscode.window.withProgress({
					location: vscode.ProgressLocation.Notification,
					cancellable: true
				}, async (progress) => {
					progress.report({
						message: `Carregando PDF ...`,
					});
					await report.generateForFile(localContext.resourceUri);
				});
			})
		);

		context.subscriptions.push(
			vscode.commands.registerCommand('validweb.generateFolderReport', async (localContext) => {
				await vscode.window.withProgress({
					location: vscode.ProgressLocation.Notification,
					cancellable: true
				}, async (progress) => {
					progress.report({
						message: `Carregando PDF ...`,
					});
					await report.generateForFolder(localContext);
				});
			})
		);

		try {
			await updatePrismaDataSource(context);
			if (context.globalState.get('validweb.initializated') === undefined) {
				await load(context);
				context.globalState.update('validweb.initializated', true);
			}
			await vscode.workspace.fs.stat(vscode.Uri.parse(context.globalStorageUri.path + '/' + 'validweb.sqlite'));
		} catch (err) {
			await load(context);
			context.globalState.update('validweb.initializated', true);
		}

		await Diagnostic.getInstance().subscribeToDocumentChanges(context);

		const provider = new SidebarRuleTypesProvider(context);
		context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(SidebarRuleTypesProvider.viewType, provider)
		);	
		
		const providerRules = new SidebarRulesProvider(context);
		context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(SidebarRulesProvider.viewType, providerRules)
		);

		context.subscriptions.push(
			vscode.languages.registerCodeActionsProvider({ scheme: 'file', language: 'html' }, new DiagnosticCodeActionProvider(), {
				providedCodeActionKinds: DiagnosticCodeActionProvider.providedCodeActionKinds
			})
		);
	} catch (err) {
		vscode.window.showErrorMessage('Erro de Inicialização:');
		if (err) {
			vscode.window.showErrorMessage(String(err));
		}
	}
}

export async function deactivate(context: vscode.ExtensionContext) {
	await context.globalState.update('validweb.initialized', undefined);
}
