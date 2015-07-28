dependencies:
	pip install -r requirements.txt

virtualenv:
	source virtualenvwrapper.sh && workon socialtrading

launch:
	python launcher.py
