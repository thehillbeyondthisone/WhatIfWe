# ngrok Setup Guide

ngrok allows you to access your "What if we..." app from anywhere, even when you're not on the same network as your partner!

## Quick Start

1. **Get your ngrok authtoken**
   - Visit https://dashboard.ngrok.com/get-started/your-authtoken
   - Sign up for a free account if you don't have one
   - Copy your authtoken

2. **Choose a setup method** (pick one):

### Option 1: Environment Variable (Recommended for Security)

Best for: Keeping your token secure and out of git

```bash
# Linux/Mac
export NGROK_AUTHTOKEN="your_token_here"
npm run remote

# Windows (PowerShell)
$env:NGROK_AUTHTOKEN="your_token_here"
npm run remote

# Windows (CMD)
set NGROK_AUTHTOKEN=your_token_here
npm run remote
```

### Option 2: Local Config File

Best for: Convenience and multiple projects

1. Create `ngrok.config.json` in the project root:
```json
{
  "authtoken": "your_token_here",
  "region": "us"
}
```

2. Start with remote access:
```bash
npm run remote
```

**Note:** This file is automatically ignored by git for security.

### Option 3: System Config

Best for: Using ngrok across all projects

```bash
# One-time setup
ngrok config add-authtoken YOUR_TOKEN

# Then use it
npm run remote
```

This saves to `~/.ngrok2/ngrok.yml` on your system.

## Regional Servers

Choose a region closer to you and your partner for better performance:

```bash
npm run remote        # US (default)
npm run remote:eu     # Europe
npm run remote:ap     # Asia Pacific
npm run remote:au     # Australia
npm run remote:sa     # South America
npm run remote:jp     # Japan
npm run remote:in     # India
```

## Usage

**Local network only** (no ngrok):
```bash
npm start
```

**With remote access** (ngrok tunnel):
```bash
npm run remote
```

After starting, you'll see:
```
🌍 REMOTE ACCESS (ngrok tunnel)
============================================================

🔗 Access from anywhere: https://abc123.ngrok-free.app
📱 Share this link with your partner!
```

## Troubleshooting

**"invalid tunnel configuration"**
- You need to set up your authtoken using one of the methods above

**Tunnel expires or disconnects**
- ngrok free tier has session limits
- The URL changes each time you restart
- Sessions may expire after inactivity

**Want a permanent URL?**
- Upgrade to ngrok paid plan for reserved domains
- Or use the LAN option when on the same network

## Free Tier Limits

- Sessions expire after inactivity
- URL changes on each restart
- Connection limits apply

For always-on access, consider ngrok's paid plans or deploy to a cloud service.
