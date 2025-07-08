FROM frappe/bench:latest

USER root
RUN apt-get update && apt-get install -y \
    python3-dev \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

USER frappe
WORKDIR /home/frappe

# Create bench
RUN bench init --skip-redis-config-generation frappe-bench

WORKDIR /home/frappe/frappe-bench

# Install ERPNext
RUN bench get-app erpnext --branch version-15

# Create new site
RUN bench new-site erpnext.local \
    --db-root-password admin \
    --admin-password admin \
    --no-mariadb-socket

# Install ERPNext app
RUN bench --site erpnext.local install-app erpnext

# Set developer mode
RUN bench --site erpnext.local set-config developer_mode 1

EXPOSE 8000 9000 8001

CMD ["bench", "start"]
