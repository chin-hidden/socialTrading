all: build

deps:
	npm install
	bower install

dir:
	mkdir -p ../public/scripts
	mkdir -p ../public/styles
	mkdir -p .tmp

js: dir
	jsx -x jsx app/js .tmp
	jsx -x js app/js .tmp
	cat .tmp/*.js > ../public/scripts/bundle.js

css: dir
	npm-css app/styles/main.css > ../public/styles/bundle.css

build: js css
	cp app/index.html ../public
	cp -rfu app/img ../public
	cp -rfu bower_components ../public

clean:
	rm -rf ../public
	rm -rf .tmp

watch:
	while true; do \
		make ; \
		inotifywait -qre close_write .; \
	done
