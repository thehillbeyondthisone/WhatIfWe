#!/bin/bash

echo ""
echo "=========================================="
echo "  Starting 'What if we…' Date Idea App"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Get OS type
OS=$(uname -s)

echo "🔍 Network Configuration Help:"
echo ""
echo "To access from other devices, you need your computer's IP address."
echo ""

if [[ "$OS" == "Darwin" ]]; then
    echo "On macOS, find your IP address:"
    echo "  1. System Preferences → Network"
    echo "  2. Select your active connection (Wi-Fi or Ethernet)"
    echo "  3. Look for 'IP Address' (usually starts with 192.168.x.x or 10.x.x.x)"
    echo ""
    echo "Or run this command in another terminal:"
    echo "  ipconfig getifaddr en0    (for Wi-Fi)"
    echo "  ipconfig getifaddr en1    (for Ethernet)"
    echo ""
elif [[ "$OS" == "Linux" ]]; then
    echo "On Linux, find your IP address:"
    echo "  Run: ip addr show | grep 'inet ' | grep -v 127.0.0.1"
    echo "  Or: hostname -I"
    echo "  Look for an address starting with 192.168.x.x or 10.x.x.x"
    echo ""
else
    echo "On Windows, find your IP address:"
    echo "  1. Open Command Prompt"
    echo "  2. Run: ipconfig"
    echo "  3. Look for 'IPv4 Address' under your active network adapter"
    echo "  4. Use the address starting with 192.168.x.x or 10.x.x.x"
    echo ""
fi

echo "🔥 Firewall Configuration:"
echo ""
if [[ "$OS" == "Darwin" ]]; then
    echo "On macOS:"
    echo "  System Preferences → Security & Privacy → Firewall"
    echo "  Make sure Node.js/Terminal is allowed"
    echo ""
elif [[ "$OS" == "Linux" ]]; then
    echo "On Linux (if using ufw):"
    echo "  sudo ufw allow 3000/tcp"
    echo "  sudo ufw reload"
    echo ""
    echo "On Linux (if using firewalld):"
    echo "  sudo firewall-cmd --add-port=3000/tcp --permanent"
    echo "  sudo firewall-cmd --reload"
    echo ""
else
    echo "On Windows:"
    echo "  1. Windows Security → Firewall & network protection"
    echo "  2. Advanced settings → Inbound Rules → New Rule"
    echo "  3. Port → TCP → 3000 → Allow the connection"
    echo ""
fi

echo "=========================================="
echo ""

# Start the server
node server.js
