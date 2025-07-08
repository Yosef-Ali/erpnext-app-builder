.PHONY: setup start stop clean logs shell-frappe shell-mcp

setup:
	@chmod +x scripts/*.sh
	@./scripts/setup.sh

start:
	@./scripts/start-dev.sh

stop:
	@docker compose down

clean:
	@docker compose down -v
	@rm -rf frappe-bench/

logs:
	@docker compose logs -f

shell-frappe:
	@docker compose exec frappe bash

shell-mcp:
	@docker compose exec mcp-server sh

restart:
	@docker compose restart
