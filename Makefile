HTML_VALIDATE_VERSION := 11.6.2
LYCHEE_VERSION := 0.24.2
LYCHEE_IMAGE := lycheeverse/lychee:$(LYCHEE_VERSION)

HTML_FILES := "*.html" "case-studies/**/*.html"
JS_FILES := assets/js/*.js

.PHONY: check check-html check-js check-links

check: check-html check-js check-links

check-html:
	npx --yes html-validate@$(HTML_VALIDATE_VERSION) $(HTML_FILES)

check-js:
	@for file in $(JS_FILES); do \
		node --check "$$file"; \
	done

check-links:
	docker run --init --rm \
		-v "$(CURDIR):/workspace" \
		-w /workspace \
		$(LYCHEE_IMAGE) \
		--root-dir /workspace \
		--verbose \
		--no-progress \
		--exclude-loopback \
		--accept 200,204,206,429 \
		--exclude '^https://www\.linkedin\.com/' \
		'./**/*.md' \
		'./**/*.html'
