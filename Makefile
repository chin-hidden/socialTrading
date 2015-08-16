# Install dependencies
deps:
	env python3 -m pip install -r requirements.txt

# Launch the server
launch:
	./launcher.py

launch-production:
	CONFIG_FILE=$(PWD)/production_configs.py ./launcher.py

# Create the database
db:
	psql duber < db/schema.sql
	psql duber < db/fixtures.sql

test:
	PYTHONPATH=. py.test

test-continuously:
	PYTHONPATH=. py.test --looponfail


.PHONY: deps launch launch-production db test test-continuously
