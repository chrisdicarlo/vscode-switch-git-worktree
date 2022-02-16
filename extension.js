const vscode = require('vscode');
const cp = require('child_process');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "git-worktrees" is now active!');

    let disposable = vscode.commands.registerCommand('git-worktrees.switchWorktree', function () {
        let worktrees = getWorktreeList();

        vscode.window.showQuickPick(worktrees.map(object => object.name)).then(worktree => {
            let path = worktrees[worktrees.findIndex(object => object.name == worktree)].path;
            let uri = vscode.Uri.file(path);

            vscode.commands.executeCommand('vscode.openFolder', uri, {
                forceNewWindow: false
            });
        });
	});

	// @ts-ignore
	context.subscriptions.push(disposable);
}

function deactivate() {}

function getWorktreeList() {
    const proc = cp.spawnSync('git', ['worktree', 'list', '--porcelain'], {
        cwd: vscode.workspace.rootPath
    });

    let stdout = String(proc.stdout).replace(/^.*worktree .*\s*bare.*$/mg, "").replace(/^.*HEAD .*$/mg, "").replace(/^\s*$\s*/mg, "").trim();

    let regex = /worktree (.*)\s*branch refs\/heads\/(.*)/g;
    let matches = stdout.matchAll(regex);

    let worktrees = [];

    for (const match of matches) {
        worktrees.push({ name: match[2], path: match[1] });
    }

    return worktrees;
}

module.exports = {
	activate,
	deactivate
}
