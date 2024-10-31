#!/bin/bash

# merge current branch to master and switch back
merge_to_master() {
    # store current branch name
    current_branch=$(git symbolic-ref --short HEAD)
    
    # check if there are uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo "You have uncommitted changes. Please commit or stash them first."
        echo "Modified files:"
        git status --porcelain
        exit 1
    fi
    
    # checkout master and pull latest
    git checkout master && \
    git pull origin master && \
    
    # merge specified branch or current branch
    git merge ${BRANCH:-$current_branch} && \
    git push origin master && \
    
    # switch back to original branch
    git checkout $current_branch
    
    echo "Successfully merged to master and switched back to $current_branch"
}

# execute function based on command argument
case "$1" in
    "merge-to-master")
        merge_to_master
        ;;
    *)
        echo "Unknown command: $1"
        echo "Available commands: merge-to-master"
        exit 1
        ;;
esac 