.PHONY: install dev lint test build clean ci clean
.ONESHELL:
SHELL := $(shell command -v bash)
.SHELLFLAGS := -eu -o pipefail -c

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*## ' Makefile | \
		awk 'BEGIN {FS = ":.*## "}; {printf "%-20s %s\n", $$1, $$2}'

-include .env
export

# ==============================================================================
# Production
# ==============================================================================

project_name := coderscoffeehouse
user_name := $(DEPLOYMENT_USER) 
server_name := $(DEPLOYMENT_SERVER)

prod-build: ## Build production
	rm -rf _site 
	bun eleventy
	mv _site ${project_name} 
	tar -czvf ${project_name}.tar.gz ${project_name} 
	scp -Cr ${project_name}.tar.gz ${user_name}@${server_name}:./www/
	rm -rf ${project_name}
	rm -rf ${project_name}.tar.gz
