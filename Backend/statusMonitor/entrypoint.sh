#!/bin/sh

set -e

if node databaseInit.js; then
    echo "DB init succeeded"
else
    echo "DB init failed"
    exit 1
fi

echo "Starting main app..."
exec node app.js