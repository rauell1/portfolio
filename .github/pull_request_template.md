## What does this PR do?

<!-- Brief description of the change -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] CI / workflow change
- [ ] Docs / README

## CI Checklist

> The Workflow Guard runs automatically. Tick these manually before requesting review.

- [ ] No heredocs added to any `.github/workflows/*.yml` `run:` block
- [ ] No raw `<!--` or `-->` strings written directly in `run:` blocks (use shell variables instead)
- [ ] Every `find` call that lists multiple directories guards each path with `[ -d "$dir" ]`
- [ ] Every `find` / `node -p` call ends with `|| echo '0'` or `|| echo 'n/a'`
- [ ] `set -euo pipefail` is present in every non-trivial `run:` block
- [ ] `npm run build` passes locally
- [ ] Tested on both push and workflow_dispatch trigger paths (for workflow changes)

## Screenshots / logs (if applicable)
