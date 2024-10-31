#!/bin/bash

# merge current branch to master and switch back
merge_to_master() {
    # store current branch name
    current_branch=$(git symbolic-ref --short HEAD)
    echo "📍 Current branch: $current_branch"
    
    # check if there are uncommitted changes (excluding line ending changes)
    if ! git diff --ignore-space-at-eol --quiet HEAD --; then
        echo "❌ You have uncommitted changes. Please commit or stash them first."
        echo "Modified files:"
        git status --porcelain
        exit 1
    fi
    
    # checkout master and pull latest
    echo "Switching to master branch..."
    if ! git checkout master; then
        echo "Failed to checkout master branch"
        exit 1
    fi
    
    echo "Pulling latest changes from master..."
    if ! git pull origin master; then
        echo "Failed to pull from master"
        git checkout $current_branch
        exit 1
    fi
    
    # merge specified branch
    echo "Merging ${BRANCH:-$current_branch} into master..."
    if ! git merge ${BRANCH:-$current_branch}; then
        echo "Merge failed"
        git checkout $current_branch
        exit 1
    fi
    
    echo "Pushing changes to master..."
    if ! git push origin master; then
        echo "Failed to push to master"
        git checkout $current_branch
        exit 1
    fi
    
    # switch back to original branch
    echo "Switching back to $current_branch..."
    if ! git checkout $current_branch; then
        echo "Failed to switch back to $current_branch"
        exit 1
    fi
    
    echo "✅ Successfully merged to master and switched back to $current_branch"
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