const vscode = require('vscode');
const cp = require('child_process');
const WorkTreeProvider = require('./WorkTreeProvider');
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "git-worktrees" is now active!');



        const tree = vscode.window.createTreeView('WorktreeList', {treeDataProvider: new WorkTreeProvider.WorkTreeProvider(getWorktreeList()), showCollapseAll: true });
        tree.onDidChangeSelection( e => {
            let path = e[0].path;
            let uri = vscode.Uri.file(path);

            vscode.commands.executeCommand('vscode.openFolder', uri, {
                forceNewWindow: false
            });
        });
     context.subscriptions.push(tree);

    let switchWorktreeCommand = vscode.commands.registerCommand('git-worktrees.switchWorktree', function () {
        let worktrees = getWorktreeList();

        vscode.window.showQuickPick(worktrees.map(object => {
            return {
                label: "📁"+object.worktreeName,
                detail: object.branchName,
                id:object.worktreeName
            }
        
        })).then(worktree => {
            let path = worktrees[worktrees.findIndex(object => object.worktreeName == worktree.id)].path;
            let uri = vscode.Uri.file(path);

            vscode.commands.executeCommand('vscode.openFolder', uri, {
                forceNewWindow: false
            });
        });
	});

	// @ts-ignore
	context.subscriptions.push(switchWorktreeCommand);

    let switchWorktreeViewCommand = vscode.commands.registerCommand('git-worktrees.switchWorktreeView', function (worktree) {
                
            let path = worktree.path;
            let uri = vscode.Uri.file(path);

            vscode.commands.executeCommand('vscode.openFolder', uri, {
                forceNewWindow: false
            });
        });

	// @ts-ignore
	context.subscriptions.push(switchWorktreeViewCommand);
}

function deactivate() {}

function getWorktreeList() {
    const proc = cp.spawnSync('git', ['worktree', 'list', '--porcelain'], {
        cwd: vscode.workspace.rootPath
    });

    // let stdout = String(proc.stdout).replace(/^.*worktree .*\s*bare.*$/mg, "").replace(/^.*HEAD .*$/mg, "").replace(/^\s*$\s*/mg, "").trim();

    // let regex = /worktree (.*)\s*branch refs\/heads\/(.*)/g;
    let regex = /worktree (.*)\s*.*\s*branch refs\/heads\/(.*)/g;
    let matches = String(proc.stdout).matchAll(regex);

    let worktrees = [];

    for (const match of matches) {
        worktrees.push({ worktreeName: match[1].match(/([^\/]*)\/*$/)[1] ,branchName: match[2], path: match[1] });
    }

    return worktrees;
}

module.exports = {
	activate,
	deactivate
}


