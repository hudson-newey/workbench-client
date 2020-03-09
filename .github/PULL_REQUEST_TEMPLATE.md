# Title of PR

What is the purpose of this PR?

## Changes

List of changes added as part of this PR. This only needs to include the big changes which reviewers should carefully check.

## Issues

Any issues that are causes by the PR that will need to be address in another PR. These issues may be caused by another branch which will change how this branch functions.

## Closes

Issues closed by this PR. Most PR's should not address more than one issue. If an issue does not exist for this PR to fix, create one so that admins can verify that the change is wanted.

## Blocked By

List of PR's blocking this PR from being reviewed or merged. This is required if the PR is not built from the master branch. If the PR is blocked, add the blocked label to the issue. If this PR is blocked, you will need to merge or rebase it with master after the blocking PR is accepted.

## Visual Changes

If the PR has any visual changes to the website, post pictures of the new pages and how they look. Label any images if more than one is given.

## Final Checklist

- [ ] Assign reviewers if you have permission
- [ ] Assign labels if you have permission
- [ ] Link issues related to PR
- [ ] Ensure project linter is not producing any warnings (`npm run lint`)
- [ ] Ensure build is passing on all browsers (`npm run test:all`)
- [ ] Ensure CI build is passing