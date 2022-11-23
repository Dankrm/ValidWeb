import { Diagnostic } from "../lib/Diagnostic";
import Rule from "../lib/Rule";
import * as vscode from 'vscode';
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export abstract class Validator {
    protected abstract chain: string;
    protected abstract ignoredChars: string[];
    protected invalidation: [string, string] = ['', ''];
    protected rule: Rule;
    protected jsdom: any;
    protected doc: vscode.TextDocument;
    protected elements: Element[] = [];

    public constructor (rule: Rule, doc: vscode.TextDocument) {
        this.rule = rule;
        this.doc = doc;
        this.jsdom = new JSDOM(doc.getText(), { includeNodeLocations: true });
        this.invalidation = rule.constructQuerySelector();
    }

    private initInvalidation(): void {
        if (this.invalidation) {
            for (const igChar of this.ignoredChars) {
                this.invalidation[1] && ( this.invalidation[1] = this.invalidation[1].replaceAll(igChar, ''));
            }
        }
    }

    private initElements(): void {
        this.elements = this.jsdom.window.document.querySelectorAll(this.invalidation[0]);
    }
    
    protected abstract customValidate(): void;
    protected abstract customCreateFix(diagnostic: vscode.Diagnostic): vscode.CodeAction;

    public createFix (diagnostic: vscode.Diagnostic): vscode.CodeAction {
        this.initInvalidation();
        return this.customCreateFix(diagnostic);
    };
    
    protected alternativeValidate(): void {
        this.showInformationMessage();
    }

    protected showInformationMessage(): void {
        Diagnostic.getInstance().showInformationMessage(this.rule.getRule().description, this.doc);
    }

    private validate(): void {
        try {
            this.initElements();
            this.initInvalidation();
            this.customValidate();
        } catch (e) {
            if (e instanceof Error) {
                this.alternativeValidate();
            }
        }
    }

    public execute(): void {
        this.validate();
    }

    public getLocation (element: Element) {
		return this.jsdom.nodeLocation(element);
	}

	protected createDiagnostic(range: vscode.Range): vscode.Diagnostic {
		const diagnostic = new vscode.Diagnostic(range, this.rule.getRule().description, this.rule.getRule().ruleType.diagnostic);
		diagnostic.code = this.rule.getRule().id;
		return diagnostic;
	}

    protected createRangeFromNodeLocation (found: any): vscode.Range {
        return new vscode.Range(found.startLine - 1, found.startCol - 1, found.endLine - 1, found.endCol -1);
    }

    protected addDiagnosticToDoc (diagnostic: vscode.Diagnostic): void {
        Diagnostic.getInstance().addDiagnosticToDoc(this.doc, diagnostic);
    }
}