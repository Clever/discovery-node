# `make test` to run all the tests
.PHONY: test

all: test

clean:
	rm -rf lib-js lib-js-cov

test:
	NODE_ENV=test node_modules/mocha/bin/mocha --ignore-leaks --timeout 60000 --require coffee-script/register --compilers coffee:coffee-script test/*.coffee
