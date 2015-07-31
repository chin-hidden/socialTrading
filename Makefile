dependencies:
	pip install -r requirements.txt

virtualenv:
	source virtualenvwrapper.sh && workon socialtrading

# Launch the server
launch:
	redis-server & python launcher.py

# Create the database
database:
	psql duber < db/schema.sql
	psql duber < db/fixtures.sql

