# Quick Start: Claude GitHub Integration

Get Claude working on your GitHub issues in 5 minutes.

## Fastest Method: Use Claude Code (You're Already Here!)

**Since you're already using Claude Code**, you can work on issues right now without any setup:

```bash
# Simply tell Claude to work on an issue:
# "Work on GitHub issue #1 and create a PR when done"
```

That's it! Claude Code has full access to:
- Your GitHub repository
- Git operations
- File editing
- PR creation

## Alternative: Automate with GitHub Actions

### Step 1: Store API Key (30 seconds)

```bash
# Set your Anthropic API key as a GitHub secret
gh secret set ANTHROPIC_API_KEY
# Paste your API key when prompted
```

Get your API key: https://console.anthropic.com/settings/keys

### Step 2: Enable Workflows (10 seconds)

The workflows are already created in `.github/workflows/`. Just commit them:

```bash
git add .github/
git commit -m "Add Claude GitHub integration"
git push
```

### Step 3: Use It!

**Option A: Auto-respond to issues**
```bash
# Add label to trigger Claude
gh issue edit 1 --add-label "claude-assist"

# Or comment on any issue
gh issue comment 1 --body "@claude help with this"
```

**Option B: Create PR for an issue**
```bash
# Manually trigger PR creation
gh workflow run claude-pr-creator.yml -f issue_number=1
```

## What Happens?

### With GitHub Actions
1. Claude reads the issue
2. Claude analyzes the codebase
3. Claude creates a branch
4. Claude implements changes
5. Claude creates a PR
6. You review and merge

### With Claude Code (Current Session)
1. You ask Claude to work on an issue
2. Claude does everything above interactively
3. You can guide and iterate in real-time
4. Claude commits and creates PR when ready

## Examples

### Example 1: Work on issue #1 (Strategy Definitions)
```
You (in Claude Code): "Read issue #1 and implement the solution.
Add actual strategy rules to the Basic Strategy definition."

Claude will:
- Read the issue
- Find relevant files (app.js)
- Add detailed strategy rules
- Test the changes
- Commit and create PR
```

### Example 2: Fix mobile bug #2
```
You: "Fix the mobile chart touch detection bug in issue #2"

Claude will:
- Analyze the touch detection code
- Implement better mobile support
- Test on mobile viewports
- Create PR with fix
```

### Example 3: Add new feature #8
```
You: "Implement the command palette search from issue #8"

Claude will:
- Design the search interface
- Implement fuzzy matching
- Add keyboard shortcuts
- Style the component
- Create comprehensive PR
```

## Current Session Example

Since you're in Claude Code right now, try this:

```
"Let's work on GitHub issue #1. Please:
1. Read the issue details
2. Show me the current Basic Strategy definition
3. Propose improved content that teaches the actual strategy
4. Update the code when I approve
5. Commit and create a PR"
```

## Tips

### For Claude Code (Interactive)
- Be conversational: "Help me with issue #1"
- Iterate: "That's good, but make it more concise"
- Review before commit: "Show me the changes first"

### For GitHub Actions (Automated)
- Write detailed issue descriptions
- Mention specific files in backticks
- Add acceptance criteria
- Use labels to categorize

## Troubleshooting

### "Claude doesn't have API key"
For GitHub Actions only. Claude Code uses your session.

### "Changes aren't what I expected"
With Claude Code: Just ask for revisions!
```
"This is close, but can you make the text more concise?"
```

### "How do I test the PR?"
```bash
# Check out the PR locally
gh pr checkout 1

# Test it
# ... your testing process

# Approve and merge
gh pr review 1 --approve
gh pr merge 1
```

## Next Steps

1. **Try it now**: Ask Claude to work on issue #1
2. **Set up automation**: Run `.github/scripts/setup-claude-integration.sh`
3. **Create more issues**: Claude can help with all of them!

## Cost

Using Claude Code session: **Free** (your current session)
Using GitHub Actions: ~$0.50-2.00 per issue with Claude Sonnet 4

## Documentation

- Full setup guide: [CLAUDE_INTEGRATION.md](CLAUDE_INTEGRATION.md)
- GitHub Actions: [workflows/](../workflows/)
- Scripts: [scripts/](scripts/)
