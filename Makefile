include secrets.mk

.PHONY: clean

init_db:
	npx wrangler d1 execute $(DATA_BASE_NAME) --local --file=./schema.sql

init_db_remote:
	npx wrangler d1 execute $(DATA_BASE_NAME) --remote --file=./schema.sql

fetch_expenses:
	curl -X GET \
		-H "Content-Type: application/json" \
		localhost:5173/api/groups/123e4567-e89b-12d3-a456-426614174000/expenses \
		| jq

add_member:
	curl -X POST \
		-H "Content-Type: application/json" \
		-d '{"name":"Test User"}' \
		localhost:5173/api/groups/123e4567-e89b-12d3-a456-426614174000/members \
		| jq

remove_member:
	curl -X DELETE \
		-H "Content-Type: application/json" \
		localhost:5173/api/groups/123e4567-e89b-12d3-a456-426614174000/members/1 \
		| jq