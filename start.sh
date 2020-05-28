#!/bin/bash

# Example start script for usage with screen and nodemon on port 3003
# Proxy that port with nginx to the clients
cd /home/webteleprompter
/usr/bin/screen -S webteleprompter -X quit
PORTSSL=3003 /usr/bin/screen -dmS webteleprompter /usr/bin/nodemon bin/www
