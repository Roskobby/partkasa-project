#!/bin/sh
set -e

# Default if not provided
: "${REACT_APP_API_URL:=http://localhost:8000/api}"

cat > /usr/share/nginx/html/env.js <<EOF
window.__ENV = {
  REACT_APP_API_URL: "${REACT_APP_API_URL}"
};
EOF

exec nginx -g 'daemon off;'

