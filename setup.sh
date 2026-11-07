#!/usr/bin/env bash

set -e

PROJECT_DIR="$(pwd)"
VENV="${PROJECT_DIR}/venv"
USER="$(whoami)"

python3 -m venv "${VENV}"
sleep 1
"${VENV}/bin/python" -m pip install -r requirements.txt

sleep 2

sudo tee /etc/systemd/system/portfolio-flask.service >/dev/null <<EOF
[Unit]
Description=Portfolio Flask application
After=network.target

[Service]
User=${USER}
Group=www-data
WorkingDirectory=${PROJECT_DIR}
Environment="PATH=${VENV}/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=${VENV}/bin/gunicorn --workers 2 --bind 127.0.0.1:9000 app:app
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sleep 1
sudo systemctl daemon-reload
sleep 1
sudo systemctl enable portfolio-flask
sleep 1
sudo systemctl restart portfolio-flask
sleep 1
echo "setup complete."
