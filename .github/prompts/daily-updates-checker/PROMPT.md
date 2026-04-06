# daily-updates-checker

Use this prompt when you want a quick daily review of the repository for new changes, dependency drift, and any maintenance items that need attention.

## What to Check

1. Review the latest git changes and recent commits.
2. Look for package, lockfile, configuration, or documentation updates.
3. Flag any missing follow-up work, broken references, or suspicious diffs.
4. If available, run any project health checks or repo-specific verification steps.
5. Summarize what changed, what matters, and what should be handled today.

## Output Format

Return a short report with:

- New changes noticed today
- Risks or regressions to watch
- Dependency or tooling updates
- Recommended next actions
