# Claude GitHub Integration Setup

This repository has Claude AI integration for automated issue handling and PR creation.

## Setup Options

### Option 1: GitHub Actions (Automated)

#### Prerequisites
1. Anthropic API key
2. GitHub repository admin access

#### Setup Steps

1. **Add API Key to GitHub Secrets**
   ```bash
   # Go to: Settings > Secrets and variables > Actions
   # Click "New repository secret"
   # Name: ANTHROPIC_API_KEY
   # Value: your_api_key_here
   ```

   Or via CLI:
   ```bash
   gh secret set ANTHROPIC_API_KEY
   # Paste your API key when prompted
   ```

2. **Enable GitHub Actions**
   - Workflows are in `.github/workflows/`
   - They will trigger automatically once secrets are configured

3. **Usage**

   **Automatic response to issues:**
   - Add label `claude-assist` to any issue
   - Or comment `@claude` on an issue
   - Claude will analyze and comment with suggestions

   **Create PR for issue:**
   ```bash
   # Manually trigger PR creation workflow
   gh workflow run claude-pr-creator.yml -f issue_number=1
   ```

   Or via GitHub UI:
   - Actions tab > Claude PR Creator > Run workflow
   - Enter issue number

### Option 2: Claude Agent SDK (Local)

Use the Claude Agent SDK to work on issues locally with full autonomy.

#### Setup

1. **Install Claude Agent SDK**
   ```bash
   npm install -g @anthropic-ai/claude-agent-sdk
   # or
   npx @anthropic-ai/claude-agent-sdk
   ```

2. **Configure API Key**
   ```bash
   export ANTHROPIC_API_KEY=your_api_key_here
   ```

3. **Run Claude on an issue**
   ```bash
   claude-agent github issue 1 \
     --repo matthewfrazier/holdem \
     --branch-prefix "claude/issue-" \
     --auto-commit \
     --create-pr
   ```

### Option 3: Claude Code (IDE Integration)

The Claude Code CLI provides the richest development experience.

#### Setup

1. **Install Claude Code**
   ```bash
   # Install via homebrew (macOS)
   brew install claude-code

   # Or download from anthropic.com/claude-code
   ```

2. **Connect to GitHub**
   ```bash
   claude-code auth github
   ```

3. **Work on issue**
   ```bash
   # Start working on an issue
   claude-code issue 1

   # Or open in your editor
   code .
   # Then in VS Code terminal: claude-code issue 1
   ```

## Workflow Examples

### Example 1: Fix bug automatically
```bash
# Label issue for Claude to review
gh issue edit 2 --add-label "claude-assist"

# Claude comments with analysis
# Then create PR:
gh workflow run claude-pr-creator.yml -f issue_number=2
```

### Example 2: Interactive development
```bash
# Use Claude Code for interactive work
claude-code issue 3

# Claude will:
# 1. Read the issue
# 2. Explore codebase
# 3. Make changes
# 4. Test
# 5. Create PR
```

### Example 3: Review and iterate
```bash
# Create initial PR
gh workflow run claude-pr-creator.yml -f issue_number=4

# Review PR, add comments
# Claude responds to review comments automatically
```

## Best Practices

### Issue Labeling
- `bug` - Bugs for Claude to fix
- `enhancement` - Features to implement
- `documentation` - Docs to write/update
- `claude-assist` - Trigger automatic Claude response

### Issue Templates
Use detailed issue descriptions with:
- Clear problem statement
- Expected behavior
- Files to modify (mentioned in backticks)
- Acceptance criteria

### Review Process
1. Claude creates PR with changes
2. Human reviews code and tests
3. Request changes if needed (Claude can iterate)
4. Merge when approved

## Advanced Configuration

### Customize Claude's behavior

Edit `.github/workflows/claude-pr-creator.yml`:

```yaml
# Change model
model: "claude-opus-4-20250514"  # For complex tasks

# Adjust token limits
max_tokens: 16384  # For larger responses

# Add system prompt
system: "You are an expert in casino game theory and web development..."
```

### Rate Limits
- Anthropic API: 5 requests/minute on standard tier
- GitHub Actions: 1000 minutes/month free tier

### Monitoring
- Check Actions tab for workflow runs
- View API usage in Anthropic Console
- Set up notifications for failed workflows

## Troubleshooting

### Issue: "ANTHROPIC_API_KEY not found"
**Solution:** Add secret in GitHub repo settings

### Issue: "No changes to commit"
**Solution:** Claude may need more context - add file contents to issue description

### Issue: Workflow fails with 429 error
**Solution:** Rate limit hit - wait a few minutes or upgrade API tier

### Issue: PR has incorrect changes
**Solution:** Provide more detailed issue description with specific files and requirements

## Security Notes

- API keys are stored as GitHub Secrets (encrypted)
- Claude only has access to public repo contents
- Review all PR changes before merging
- Consider using branch protection rules

## Cost Estimates

### Per Issue Resolution
- Claude Sonnet 4: ~$0.50-$2.00 per issue (depending on complexity)
- Claude Opus 4: ~$2.00-$8.00 per issue

### Monthly (10 issues/month)
- Sonnet: ~$5-$20/month
- Opus: ~$20-$80/month

## Support

- Claude API Docs: https://docs.anthropic.com
- GitHub Actions Docs: https://docs.github.com/actions
- Claude Agent SDK: https://github.com/anthropics/claude-agent-sdk
- Issues: Use this repo's issue tracker
