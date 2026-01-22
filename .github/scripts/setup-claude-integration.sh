#!/bin/bash
set -e

echo "🤖 Claude GitHub Integration Setup"
echo "=================================="
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "Install it from: https://cli.github.com"
    exit 1
fi

echo "✓ GitHub CLI found"

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub"
    echo "Run: gh auth login"
    exit 1
fi

echo "✓ GitHub authentication verified"
echo ""

# Prompt for API key
echo "📝 Anthropic API Key Setup"
echo ""
echo "Get your API key from: https://console.anthropic.com/settings/keys"
echo ""
read -p "Enter your Anthropic API key (or press Enter to skip): " API_KEY

if [ -n "$API_KEY" ]; then
    echo "Setting GitHub secret..."
    echo "$API_KEY" | gh secret set ANTHROPIC_API_KEY
    echo "✓ API key stored as GitHub secret"
else
    echo "⚠️  Skipping API key setup - you'll need to add it manually"
fi

echo ""
echo "📋 Setting up issue labels..."

# Create labels if they don't exist
gh label create "claude-assist" --description "Request Claude AI assistance" --color "7057ff" 2>/dev/null || echo "Label 'claude-assist' already exists"

echo "✓ Labels configured"
echo ""

# Enable GitHub Actions
echo "🔄 Checking GitHub Actions..."
echo ""
echo "Go to: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/actions"
echo "Ensure Actions are enabled for this repository"
echo ""

# Check if workflows exist
if [ -f ".github/workflows/claude-issue-handler.yml" ]; then
    echo "✓ claude-issue-handler.yml found"
else
    echo "❌ claude-issue-handler.yml not found"
fi

if [ -f ".github/workflows/claude-pr-creator.yml" ]; then
    echo "✓ claude-pr-creator.yml found"
else
    echo "❌ claude-pr-creator.yml not found"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Quick Start:"
echo ""
echo "1. Add 'claude-assist' label to an issue:"
echo "   gh issue edit 1 --add-label 'claude-assist'"
echo ""
echo "2. Or comment '@claude' on any issue"
echo ""
echo "3. Manually trigger PR creation:"
echo "   gh workflow run claude-pr-creator.yml -f issue_number=1"
echo ""
echo "📖 Full documentation: .github/CLAUDE_INTEGRATION.md"
