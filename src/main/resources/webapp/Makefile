all: build

deps:
	npm install
	bower install

dir:
	mkdir -p dist/scripts
	mkdir -p dist/styles
	mkdir -p .tmp

js: dir
	jsx -x jsx app/js .tmp
	jsx -x js app/js .tmp
	cat .tmp/*.js > dist/scripts/bundle.js

css: dir
	npm-css app/styles/main.css > dist/styles/bundle.css

build: js css
	cp app/index.html dist
	cp -rfu app/img dist
	cp -rfu bower_components dist

clean:
	rm -rf dist
	rm -rf .tmp

watch:
	while true; do \
		make ; \
		inotifywait -qre close_write .; \
	done
