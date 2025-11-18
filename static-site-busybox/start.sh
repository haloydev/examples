#!/bin/sh

# Create health check endpoint
cat > /home/static/health << 'EOF'
{
  "status": "healthy",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "replica_id": "${HALOY_REPLICA_ID:-unknown}",
  "uptime": "$(uptime)",
  "version": "1.0.0"
}
EOF

# Replace placeholders in index.html
sed -i "s/REPLICA_ID_VALUE/${HALOY_REPLICA_ID:-'(not set)'}/g" /home/static/index.html
sed -i "s/HEALTH_CHECK_PATH_VALUE/\/health/g" /home/static/index.html
sed -i "s/TIMESTAMP_VALUE/$(date -u +%Y-%m-%dT%H:%M:%SZ)/g" /home/static/index.html

# Function to handle shutdown
shutdown() {
    echo "Received shutdown signal, stopping httpd..."
    kill $HTTPD_PID 2>/dev/null
    exit 0
}

# Trap SIGTERM and SIGINT
trap shutdown TERM INT

# Start the HTTP server in background
busybox httpd -f -v -p 8080 &
HTTPD_PID=$!

# Wait for the background process
wait $HTTPD_PID