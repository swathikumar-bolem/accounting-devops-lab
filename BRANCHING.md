# Branching model

Long-lived branches:
- `main`: production-ready code only.
- `develop`: integration branch for the next release.

Short-lived branches:
- `feature/<name>`: created from `develop`, merged back to `develop` through a pull request.
- `hotfix/<name>`: created from `main` for an urgent production fix, then merged to both `main` and `develop`.

For this small-team lab we intentionally do not keep a permanent release branch. We can add `release/*` later when practicing release freezes/UAT.
