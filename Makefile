include secrets.mk

.PHONY: clean

init_db:
	npx wrangler d1 execute $(DATA_BASE_NAME) --local --file=./schema.sql