# nodejs

A minimal Node.js web application.

![static-site](public/images/static-site.png)

For a step-by-step guide to deploying on [Railway](https://railway.app/?referralCode=alphasec), see [this](https://alphasec.io/how-to-deploy-a-nodejs-app-on-railway/) post, or click the button below.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/Abo1zu?referralCode=alphasec)

## Merge current branch to master

pnpm merge-to-master

### Common Issues

#### 1. Line Ending Issues

When executing shell scripts on Windows, you might encounter line ending errors:

```sh
scripts/git-commands.sh: line 2: $'\r': command not found
scripts/git-commands.sh: line 4: syntax error near unexpected token $'{\r''
```

Solution:

- Open the script file in VS Code
- Click 'CRLF' in the bottom right corner
- Change it to 'LF'
- Save the file

Alternative solutions:

- Using dos2unix

```sh
dos2unix scripts/git-commands.sh
```

- Using sed

```sh
sed -i 's/\r$//' scripts/git-commands.sh
```

- Using Git config

```sh
git config --global core.autocrlf false
git rm --cached -r .
git reset --hard
```

#### 2. Git Authentication Failed

If you see this error when pushing to GitHub:

remote: Support for password authentication was removed on August 13, 2021.
remote: Please see [cloning with https urls](https://docs.github.com/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls)
fatal: Authentication failed

Solution:
Switch to SSH authentication (recommended):

```sh
# Check current remote URL
git remote -v
```

```sh
# Change to SSH URL
git remote set-url origin git@github.com:zopenge/rtc-server-railway.git

#### 3. Uncommitted Changes Detection

If the merge script reports uncommitted changes but git status shows clean:

Solution:
Force reset working directory:

```sh
# Reset working directory
git reset --hard HEAD

# Clean untracked files
git clean -fd
```

Or modify the script to ignore line ending changes:

```sh
# Use --ignore-space-at-eol flag
git diff --ignore-space-at-eol --quiet HEAD --
```

Add secondary remote repository:

```sh
git remote add secondary <SECONDARY_REPO_URL>
```
