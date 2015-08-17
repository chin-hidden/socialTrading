all: bundle

deps:
	npm install

js:
	jspm bundle-sfx scripts/accountapp dist/account.bundle.js --minify
	jspm bundle-sfx scripts/wizardapp dist/wizard.bundle.js --minify

bundle: js

.PHONY: js all bundle deps
