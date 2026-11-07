#!/usr/bin/env python3
"""Check a Jekyll build for broken internal links, images, fonts and styles.

Run after `bundle exec jekyll build`: python3 scripts/check_site.py _site
External services are deliberately outside this deterministic build check.
"""

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.refs = []
        self.ids = set()
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        if tag in {'a', 'link', 'img', 'script', 'iframe', 'source'}:
            for name in ('href', 'src'):
                if attrs.get(name):
                    self.refs.append(attrs[name])
        self.refs.extend(css_urls(attrs.get('style', '')))


def css_urls(text):
    return re.findall(r'url\([\s\'"]*([^\)\'"]+?)[\s\'"]*\)', text)


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site').resolve()
    if not (root / 'index.html').is_file():
        sys.exit(f'No built homepage at {root}; build the site first.')
    pages = {p: Page(p.read_text()) for p in root.rglob('*.html')}
    errors = set()
    checked = 0

    def check(source, ref):
        nonlocal checked
        base = 'https://deniszagitov.github.io/' + source.relative_to(root).as_posix()
        url = urlsplit(urljoin(base, ref))
        if url.scheme not in ('http', 'https'):
            return
        if url.hostname != 'deniszagitov.github.io':
            if url.hostname and url.hostname.startswith('deniszagitov.github.io'):
                errors.add(f'{source.relative_to(root)}: malformed URL {ref}')
            return
        target = root / unquote(url.path).lstrip('/')
        if target.is_dir():
            target /= 'index.html'
        elif not target.is_file() and target.with_suffix('.html').is_file():
            target = target.with_suffix('.html')
        checked += 1
        if not target.is_file():
            errors.add(f'{source.relative_to(root)}: missing {ref}')
        elif url.fragment and target in pages:
            fragment = unquote(url.fragment)
            if fragment not in pages[target].ids:
                errors.add(f'{source.relative_to(root)}: missing anchor {ref}')

    for source, page in pages.items():
        for ref in page.refs:
            check(source, ref)
    for source in root.rglob('*.css'):
        for ref in css_urls(source.read_text()):
            check(source, ref)
    manifest = root / 'images/manifest.json'
    for icon in json.loads(manifest.read_text()).get('icons', []):
        check(manifest, icon['src'])
    for error in sorted(errors):
        print(error)
    print(f'Checked {len(pages)} HTML pages and {checked} internal references; {len(errors)} errors.')
    return bool(errors)


if __name__ == '__main__':
    sys.exit(main())
