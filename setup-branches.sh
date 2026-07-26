#!/usr/bin/env bash
# Run once after `git init` + first commit + pushing to GitHub `main`.
# Creates and pushes the dev + feature branches so everyone can start
# working in parallel from day one.
set -e

git checkout -b dev
git push -u origin dev

for b in feat/order-flow feat/payment-flow feat/assignment-flow feat/tracking-flow feat/domain-classes feat/seed-data feat/report; do
  git checkout dev
  git checkout -b "$b"
  git push -u origin "$b"
done

git checkout dev
echo "Done. Branches created: dev + 7 feature branches."
echo "Now set branch protection on 'main' in GitHub repo settings:"
echo "  - Require pull request before merging"
echo "  - Require at least 1 approval"
echo "  - Dismiss stale reviews on new commits"
