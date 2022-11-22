import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import { Diagnostic } from './Diagnostic';
import { TreeViewItem } from '../TreeView/TreeViewItem';
const pdfDocument = require('pdfkit');


export class Report {
    constructor () {}

    private out: fs.WriteStream | null = null;
    private doc: any = null;

    private async file (uri: vscode.Uri) {
        const textDocument = await vscode.workspace.openTextDocument(uri);
        const diagnostics = Diagnostic.getInstance().getDiagnosticsOfPath(uri.path);

        if (textDocument && diagnostics !== undefined) {
            const fileContent = textDocument.getText().replaceAll('\r', '');
            const fileContentLines = fileContent.split('\n');
            this.doc.fontSize(8);

            let savedX = this.doc.x;
            let savedY = this.doc.y;
            for (let index in fileContentLines) {
                const line = fileContentLines[index];
                const lineIndex = Number(index);

                const range = new vscode.Range(lineIndex, 0, lineIndex, line.length);
                const filteredDiagnostics = diagnostics.filter(diagnostic => {
                    return diagnostic.range.intersection(range) !== undefined;
                });

                let colorDiagnostic = 'black';

                if (filteredDiagnostics.length > 0) {
                    if (filteredDiagnostics[0].severity === vscode.DiagnosticSeverity.Error) {
                        colorDiagnostic = 'red';
                    } else {
                        colorDiagnostic = 'blue';
                    }
                }

                this.doc.fillColor(colorDiagnostic)
                    .text(lineIndex + 1, 0, savedY, {
                        width: '60',
                        align: 'right',
                        lineBreak: false
                    });
                this.doc.text(line, savedX, savedY, {
                    lineBreak: false
                });
                this.doc.moveDown();
                this.doc.text("");

                for (let diagnostic of filteredDiagnostics) {
                    if (diagnostic.range.start.line === lineIndex) {
                        this.doc.moveDown();
                        this.doc.text(`Tipo: ${diagnostic.severity === 0 ? "Erro" : "Informação"}`, savedX);
                        this.doc.text(`Código: ${diagnostic.code}`, savedX);
                        this.doc.text(`Mensagem: ${diagnostic.message}`, savedX);
                        this.doc.moveDown();
                        this.doc.text("");
                    }
                }

                savedY = this.doc.y;
            }
        }
    }

    private startReport(title: string, subtitle: string) {
        this.doc = new pdfDocument({ 
            font: 'Times-Roman',
            size: 'A4' 
        });
        
        this.doc.font('Times-Bold').fontSize(16);
        this.doc.text(`${title}`, {
            align: 'center'
        });

        this.doc.font('Times-Roman').fontSize(12);
        this.doc.text(`${subtitle}`, {
            align: 'center'
        });

        this.doc.moveDown();
    }

    private sectionReport(title: string, subtitle: string) {
        this.doc.font('Times-Bold').fontSize(14);
        this.doc.text(`${title}`, {
            align: 'center'
        });

        this.doc.font('Times-Roman').fontSize(10);
        this.doc.text(`${subtitle}`, {
            align: 'center'
        });

        this.doc.moveDown();
    }


    private finishReport() {
        this.out = fs.createWriteStream(os.tmpdir() + '/generateValidWeb.pdf');
        this.doc.pipe(this.out);
        this.doc.end();

        this.out.on('finish', () => {
            vscode.window.showSaveDialog({
                filters: {
                    'Arquivos pdf': ['pdf']
                },
                saveLabel: "Salvar",
                title: "Salvar Relatório",
                defaultUri: vscode.Uri.parse('~/')
            }).then(file => {
                if (file && this.out) {
                    fs.copyFile(this.out.path, file.fsPath, fs.constants.COPYFILE_FICLONE, (status) => {
                        if (status !== null) {
                            vscode.window.showErrorMessage("Ocorreu um erro durante o salvamento do arquivo. (TMP)");
                        } else {
                            vscode.env.openExternal(vscode.Uri.parse(file.path));
                        }
                    });
                } else {
                    vscode.window.showErrorMessage("Ocorreu um erro durante o salvamento do arquivo. (FILE)");
                }
            });
            
        });
    }

    public async generateForFile (uri: vscode.Uri) {
        this.startReport("Relatório de Arquivo", uri.fsPath);
        await this.file(uri);
        this.finishReport();
    }

    public async generateForFolder (context: TreeViewItem) {
        if (context.resourceUri && context.children) {
            this.startReport("Relatório de Diretório", context.resourceUri.fsPath);
            await this.sectionFolder(context);
            this.finishReport();
        }
    }

    public async sectionFolder (context: TreeViewItem) {
        if (context.resourceUri && context.children) {
            for (let item of context.children) {
                if (item.resourceUri) {
                    if (item.contextValue === 'htmlFolder') {
                        await this.sectionFolder(item);
                    } else {
                        this.sectionReport(item.label, item.resourceUri.fsPath);
                        await this.file(item.resourceUri);
                    } 
                    this.doc.moveDown();
                    this.doc.text("");
                }
            }
        }
    }
}