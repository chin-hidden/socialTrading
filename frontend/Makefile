DEST=../socialtrading/static

all: build

deps:
	npm install
	bower install

dir:
	mkdir -p $(DEST)/scripts
	mkdir -p $(DEST)/styles
	mkdir -p .tmp

js: dir
	babel js --out-dir $(DEST)/scripts --modules amd --source-maps

css: dir
	npm-css styles/main.css > $(DEST)/styles/bundle.css

build: js css
	cp -rfu img $(DEST)
	cp -rfu bower_components $(DEST)

clean:
	rm -rf $(DEST)
	rm -rf .tmp

watch:
	while true; do \
		make && notify-send --urgency=low --expire-time=500 "Front-end built" || notify-send --urgency=critical --icon=error "Front-end build broke"; \
		inotifywait -qre close_write .; \
	done
