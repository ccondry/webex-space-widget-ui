#!/bin/sh
echo "removing webex-space-widget-ui website files..."
rm -rf /var/www/html/webex-space-widget/*
if [ $? -eq 0 ]; then
  echo "successfully removed webex-space-widget-ui website files."
else
  echo "failed to remove webex-space-widget-ui website files."
fi
