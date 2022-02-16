// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cp = require('child_process');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposables = [];
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "git-worktrees" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

    disposables.push(vscode.commands.registerCommand('git-worktrees.switchWorktree', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
        let worktrees = getWorktreeList();
        vscode.window.showQuickPick(worktrees.map(object => object.name)).then(worktree => {
            let path = worktrees[worktrees.findIndex(object => object.name == worktree)].path;
            let uri = vscode.Uri.file(path);

            vscode.commands.executeCommand('vscode.openFolder', uri, { forceNewWindow: false});
            vscode.window.showInformationMessage('Switched worktree to ' + worktree);
        });

	}));

	// @ts-ignore
	context.subscriptions.push(disposables);
}

// this method is called when your extension is deactivated
function deactivate() {}

function getWorktreeList() {
    const proc = cp.spawnSync('git', ['worktree', 'list', '--porcelain'], {
        cwd: vscode.workspace.rootPath
    });

    let stdout = String(proc.stdout);
    let worktrees = [];

    let regex = /worktree (.*)\s*branch refs\/heads\/(.*)/g;
    let matches = stdout.replace(/^.*worktree .*\s*bare.*$/mg, "").replace(/^.*HEAD .*$/mg, "").replace(/^\s*$\s*/mg, "").trim().matchAll(regex);

    for (const match of matches) {
        worktrees.push({ name: match[2], path: match[1] });
    }

    return worktrees;
}

module.exports = {
	activate,
	deactivate
}
