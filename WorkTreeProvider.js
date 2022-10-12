const { Module } = require('module');
const path = require('path');
const vscode = require('vscode');

class WorkTreeProvider {

    constructor(outline) {
        console.log(outline);
        this.outline = outline;
    }

    getTreeItem(item) {
        var name = item.worktreeName;        
        if(vscode.Uri.file(item.path).path.toLowerCase() == this.getCurrentWorkspaceFolder().uri.path.toLowerCase())
            name = name+" (*)";
        let TreeItem = new vscode.TreeItem({
            label : name
        }, vscode.TreeItemCollapsibleState.None)
        TreeItem.iconPath = {
            light: path.join(__dirname, "assets", "iconL.png"),
            dark: path.join(__dirname, "assets", "iconD.png")
        }        
        TreeItem.description = item.branchName;
        
        TreeItem.command =   {
            title: "open",
            command: 'git-worktrees.switchWorktreeView',
            arguments: [item]
        }
        
        
        return TreeItem;
    }

    getChildren(element) {
        if (element) {
            return Promise.resolve(element.children);
        } else {
            return Promise.resolve(this.outline);
        }
    }

    getCurrentWorkspaceFolder() {
        let workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.workspace.workspaceFolders[0].uri);
        let activeTextEditorDocumentUri = null;
        try {
            activeTextEditorDocumentUri = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri);
        }
        catch (error) {
            activeTextEditorDocumentUri = null;
        }
        if (activeTextEditorDocumentUri) {
            workspaceFolder = activeTextEditorDocumentUri;
        }
        return workspaceFolder;
    }
}

module.exports = {
    WorkTreeProvider
}