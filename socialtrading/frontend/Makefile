all: bundle

deps:
	npm install
	jspm install

js:
	jspm bundle-sfx scripts/app dist/app.bundle.js --minify
bundle: js

.PHONY: js all bundle deps
