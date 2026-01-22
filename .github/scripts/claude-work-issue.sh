#!/bin/bash
# Work on a GitHub issue using Claude Code CLI
# Usage: ./claude-work-issue.sh <issue_number>

set -e

ISSUE_NUM=$1

if [ -z "$ISSUE_NUM" ]; then
    echo "Usage: $0 <issue_number>"
    echo ""
    echo "Example: $0 1"
    exit 1
fi

echo "🤖 Starting Claude to work on issue #$ISSUE_NUM"
echo ""

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code CLI not found"
    echo ""
    echo "Install options:"
    echo ""
    echo "1. Via npm (if you have Node.js):"
    echo "   npm install -g @anthropic-ai/claude-code"
    echo ""
    echo "2. Via homebrew (macOS):"
    echo "   brew install claude-code"
    echo ""
    echo "3. Download from: https://claude.com/claude-code"
    echo ""
    exit 1
fi

# Get issue details
echo "📋 Fetching issue details..."
ISSUE_JSON=$(gh issue view $ISSUE_NUM --json title,body,labels,url)
ISSUE_TITLE=$(echo "$ISSUE_JSON" | jq -r '.title')
ISSUE_URL=$(echo "$ISSUE_JSON" | jq -r '.url')

echo ""
echo "Issue #$ISSUE_NUM: $ISSUE_TITLE"
echo "URL: $ISSUE_URL"
echo ""

# Create task description file for Claude
TASK_FILE="/tmp/claude-issue-$ISSUE_NUM.md"
cat > "$TASK_FILE" <<EOF
# GitHub Issue #$ISSUE_NUM

$(gh issue view $ISSUE_NUM)

---

## Your Task

Please review this issue and implement the requested changes.

1. Read and understand the requirements
2. Explore the codebase to understand current implementation
3. Make the necessary changes
4. Test your changes
5. Create a commit with a descriptive message
6. Create a pull request that references this issue

Remember to:
- Follow existing code style
- Update documentation if needed
- Consider edge cases
- Test thoroughly before committing
EOF

echo "✓ Task description prepared"
echo ""
echo "🚀 Starting Claude Code..."
echo ""
echo "You can work with Claude interactively. Some useful commands:"
echo ""
echo "- 'Read the issue and tell me what needs to be done'"
echo "- 'Show me the files mentioned in the issue'"
echo "- 'Implement the solution'"
echo "- 'Create a PR for this issue'"
echo ""
echo "---"
echo ""

# Launch Claude Code with the task
claude --task-file "$TASK_FILE"
