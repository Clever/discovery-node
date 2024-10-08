include node.mk
.PHONY: all test build lint
SHELL := /bin/bash
NODE_VERSION := "v18"
$(eval $(call node-version-check,$(NODE_VERSION)))

TS_FILES := $(shell find . -name "*.ts" -not -path "./node_modules/*" -not -name "*.d.ts")

all: test build

format:
	@./node_modules/.bin/prettier --write $(TS_FILES)

lint:
	@echo "Linting..."
	@npx eslint $(TS_FILES)
	@echo "Running prettier"
	@./node_modules/.bin/prettier -l $(TS_FILES) || \
		(echo "**** Prettier errors in the above files! Run 'make format' to fix! ****" && false)

test: lint
	@echo "Testing..."
	node_modules/.bin/jest

build:
	@echo "Building..."
	@rm -rf dist
	@./node_modules/.bin/tsc --declaration
