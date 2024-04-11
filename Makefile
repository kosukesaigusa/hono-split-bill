include secrets.mk

.PHONY: clean

PORT = 8787

GROUP_1_UUID = 123e4567-e89b-12d3-a456-426614174000

MEMBER_1_UUID = 550e8400-e29b-41d4-a716-446655440000

MEMBER_2_UUID = 6f9619ff-8b86-d011-b42d-00cf4fc964ff

init_db:
	npx wrangler d1 execute $(DATA_BASE_NAME) --local --file=./schema.sql

init_db_remote:
	npx wrangler d1 execute $(DATA_BASE_NAME) --remote --file=./schema.sql

dev:
	bun run wrangler:dev

root:
	curl -X GET localhost:$(PORT) -H "Content-Type: application/json" | jq

fetch_expenses:
	curl -X GET localhost:$(PORT)/api/groups/$(GROUP_1_UUID)/expenses \
		-H "Content-Type: application/json" \
		| jq

add_expense:
	curl -X POST localhost:$(PORT)/api/groups/$(GROUP_1_UUID)/expenses \
		-H "Content-Type: application/json" \
		-d '{ \
			"paidByMemberUuid": "$(MEMBER_1_UUID)", \
			"participantMemberUuids": ["$(MEMBER_1_UUID)", "$(MEMBER_2_UUID)"], \
			"amount": 100, \
			"description": "Test Expense" \
		}' \
		| jq

fetch_members:
	curl -X GET localhost:$(PORT)/api/groups/$(GROUP_1_UUID)/members \
		-H "Content-Type: application/json" \
		| jq

add_member:
	curl -X POST localhost:$(PORT)/api/groups/$(GROUP_1_UUID)/members \
		-H "Content-Type: application/json" \
		-d '{ \
			"name":"Test User" \
		}' \
		| jq
