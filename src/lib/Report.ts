import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import { request } from 'https';
import path = require('path');
const pdfDocument = require('pdfkit');


export class Report {
    constructor () {}

    public static async generateForFile (diagnostics: vscode.Diagnostic[], uri: vscode.Uri) {
        const textDocument = await vscode.workspace.openTextDocument(uri);
        
        const doc = new pdfDocument({ 
            font: 'Times-Roman',
            size: 'A4' 
        });
        
        doc.font('Times-Bold').fontSize(18);
        doc.text(`RELATÓRIO DE ARQUIVO`, {
            align: 'center'
        });
        doc.font('Times-Roman').fontSize(14);
        doc.text(`${textDocument.fileName}`, {
            align: 'center'
        });
        doc.moveDown();
        
        doc.fontSize(10);

        for (let diagnostic of diagnostics) {
            doc.text(`Código: ${diagnostic.code}`, {});
            doc.text(`Mensagem: ${diagnostic.message}`, {});
            doc.text(diagnostic.tags, {});
            doc.moveDown();
        }
        
        const fileContent = textDocument.getText().replaceAll('\r', '');
        const fileContentLines = fileContent.split('\n');
        doc.fontSize(8);

        let savedX = doc.x;
        let savedY = doc.y;
        for (let index in fileContentLines) {
            const line = fileContentLines[index];
            doc.text(Number(index) + 1, 0, savedY, {
                width: '60',
                align: 'right',
                lineBreak: false
            });
            doc.text(line, savedX, savedY, {
                lineBreak: false
            });
            doc.moveDown();
            doc.text("");
            savedY = doc.y;
        }

        let out = fs.createWriteStream(os.tmpdir() + '/generateValidWeb.pdf');
        doc.pipe(out);
        doc.end();
        
        out.on('finish', () => {
            vscode.window.showSaveDialog({
                filters: {
                    'Arquivos pdf': ['pdf']
                },
                saveLabel: "Salvar",
                title: "Salvar Relatório",
                defaultUri: vscode.Uri.parse('~/')
            }).then(file => {
                if (file) {
                    fs.copyFile(out.path, file.fsPath, fs.constants.COPYFILE_FICLONE, (status) => {
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
}