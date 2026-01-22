# Claude GitHub Integration - Ready to Use!

Your Claude GitHub integration is now set up and ready. Here's how to use it:

## Current Status

- ✅ Workflows pushed to GitHub
- ✅ Label `claude-assist` created
- ⏳ Waiting for API key (complete Step 1 below)

## Step 1: Add API Key (Required)

**Choose one method:**

### Option A: Via GitHub CLI (Recommended)
```bash
gh secret set ANTHROPIC_API_KEY
```
When prompted, paste your API key from: https://console.anthropic.com/settings/keys

### Option B: Via Web UI
1. Go to: https://github.com/matthewfrazier/holdem/settings/secrets/actions
2. Click "New repository secret"
3. Name: `ANTHROPIC_API_KEY`
4. Value: Paste your key
5. Click "Add secret"

## Step 2: Start Using It!

### Method 1: Auto-respond to Issues (Issue Handler Workflow)

When you add the `claude-assist` label or comment `@claude` on any issue, Claude will automatically:
- Read the issue
- Analyze relevant code
- Comment with implementation suggestions

**Try it:**
```bash
# Add label to trigger Claude
gh issue edit 1 --add-label "claude-assist"

# Or comment on an issue
gh issue comment 1 --body "@claude Please analyze this issue"
```

**Result:** Within 1-2 minutes, Claude will comment on the issue with detailed analysis and suggestions.

### Method 2: Create Pull Request (PR Creator Workflow)

Manually trigger Claude to create a full implementation PR for any issue:

```bash
# Create PR for issue #1
gh workflow run claude-pr-creator.yml -f issue_number=1

# Create PR for issue #5
gh workflow run claude-pr-creator.yml -f issue_number=5
```

**Or via GitHub UI:**
1. Go to: https://github.com/matthewfrazier/holdem/actions/workflows/claude-pr-creator.yml
2. Click "Run workflow"
3. Enter issue number (e.g., `1`)
4. Click "Run workflow"

**Result:** Claude will:
1. Read the issue and mentioned files
2. Implement the solution
3. Create a branch (e.g., `claude/issue-1-1234567890`)
4. Commit changes
5. Open a PR with the implementation

## Examples

### Example 1: Get help with issue #1 (Strategy Definitions)
```bash
gh issue edit 1 --add-label "claude-assist"
```

Claude comments with:
- Analysis of the problem
- Specific code suggestions
- Files to modify

### Example 2: Create PR to fix issue #2 (Mobile Touch)
```bash
gh workflow run claude-pr-creator.yml -f issue_number=2
```

Claude creates:
- Branch: `claude/issue-2-1234567890`
- PR with fix for mobile touch detection
- Detailed explanation of changes

### Example 3: Work through all issues
```bash
# Get analysis on all issues
for i in 1 2 3 4 5 6 7 8; do
  gh issue edit $i --add-label "claude-assist"
done

# Review Claude's comments, then create PRs for the ones you approve
gh workflow run claude-pr-creator.yml -f issue_number=1
gh workflow run claude-pr-creator.yml -f issue_number=5
# etc.
```

## Monitoring

### Check workflow runs:
```bash
# List recent runs
gh run list

# View specific run
gh run view [run-id]

# Watch a run in progress
gh run watch
```

### View in GitHub:
- Actions tab: https://github.com/matthewfrazier/holdem/actions
- Your issues: https://github.com/matthewfrazier/holdem/issues

## What to Expect

### Issue Handler (Auto-response)
- **Trigger:** Label or comment with `@claude`
- **Time:** 1-2 minutes
- **Result:** Comment with analysis
- **Cost:** ~$0.10-0.50 per issue

### PR Creator (Full implementation)
- **Trigger:** Manual workflow run
- **Time:** 2-5 minutes
- **Result:** Full PR with code changes
- **Cost:** ~$0.50-2.00 per issue

## Troubleshooting

### Workflow doesn't run
- **Check:** Is the API key set? Go to Settings > Secrets
- **Check:** Are GitHub Actions enabled? Go to Settings > Actions
- **Try:** Re-run the workflow manually

### Claude's response is wrong
- **Fix:** Add more details to the issue description
- **Fix:** Mention specific files in backticks: `app.js`
- **Fix:** Add acceptance criteria or examples

### Rate limit errors
- **Cause:** Anthropic API rate limit (5 req/min on standard)
- **Fix:** Wait a few minutes between runs
- **Fix:** Upgrade API tier if needed

## Next Steps

1. ✅ Add your API key (Step 1 above)
2. 🧪 Test with issue #5 (simple text change):
   ```bash
   gh issue edit 5 --add-label "claude-assist"
   ```
3. 🚀 Once you see Claude's comment, create a PR:
   ```bash
   gh workflow run claude-pr-creator.yml -f issue_number=5
   ```
4. 📝 Review the PR and merge if good!
5. 🎉 Repeat for other issues

## Tips

- Start with simple issues (#5 text simplification)
- Review all PRs before merging
- Claude can iterate - add review comments and it responds
- Use detailed issue descriptions for best results
- Mention specific files Claude should look at

## Support

- Documentation: `.github/CLAUDE_INTEGRATION.md`
- Quick reference: `.github/QUICKSTART.md`
- Anthropic API: https://console.anthropic.com
- GitHub Actions: Repository Settings > Actions

---

**Ready to test?** Add your API key and then run:
```bash
gh issue edit 5 --add-label "claude-assist"
```

Watch for Claude's comment on the issue!
