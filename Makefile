deploy: deps prep

# Install dependencies
deps:
	env python3.4 -m pip install -r requirements.txt
	cd socialtrading/frontend && make deps

prep:
	cd socialtrading/frontend && make

# Launch the server
run:
	./launcher.py

run-prod:
	CONFIG_FILE=$(PWD)/production_configs.py ./launcher.py

# Create the database
db:
	psql duber < db/schema.sql
	psql duber < db/fixtures.sql

db-demo:
	psql duber < db/schema.sql
	psql duber < db/demo_fixtures.sql

test:
	PYTHONPATH=. py.test

test-continuously:
	PYTHONPATH=. py.test --looponfail


.PHONY: deps launch launch-production db test test-continuously
