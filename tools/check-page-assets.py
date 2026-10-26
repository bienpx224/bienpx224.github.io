#!/usr/bin/env python3
"""
Find broken local asset links in the static site before pushing.

Checks every git-tracked .html/.css file: each relative src / href / srcset /
CSS url() / @import must point to a file that is tracked in git (that is what
GitHub Pages will serve). Typical catch: a project page was committed without
its assets/ folder, or a file name differs only in letter case (macOS ignores
case, GitHub Pages does not).

Paths built at runtime in JavaScript are not visible to this check.

Usage:
  python3 tools/check-page-assets.py              # whole site
  python3 tools/check-page-assets.py etis/ ecochic/   # only pages under these folders
Exit code 1 when anything is missing.
"""
import os
import re
import subprocess
import sys
from urllib.parse import unquote

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ATTR_RE = re.compile(r'\b(?:src|href|poster|data-src)\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s>"\']+))', re.I)
SRCSET_RE = re.compile(r'\bsrcset\s*=\s*["\']([^"\']+)["\']', re.I)
CSS_URL_RE = re.compile(r'url\(\s*["\']?([^"\')]+)["\']?\s*\)', re.I)
CSS_IMPORT_RE = re.compile(r'@import\s+["\']([^"\']+)["\']', re.I)
COMMENT_RE = re.compile(r'<!--.*?-->|/\*.*?\*/', re.S)
INLINE_SCRIPT_RE = re.compile(r'(<script\b[^>]*>).*?(</script>)', re.S | re.I)  # keep the tag, drop inline JS
SCHEME_RE =re.compile(r'^[a-z][a-z0-9+.-]*:', re.I)  # http:, mailto:, zalo:, data:, ...


def tracked_files():
    out = subprocess.check_output(['git', 'ls-files', '-z'], cwd=ROOT)
    return set(p for p in out.decode('utf-8').split('\0') if p)


def is_checkable(ref):
    ref = ref.strip()
    # Skip external links, anchors and runtime-built paths (JS templates)
    return (ref and not SCHEME_RE.match(ref) and not ref.startswith(('#', '//'))
            and '${' not in ref and '{{' not in ref)


def resolve(page, ref):
    """Return the repo-relative path a reference points to (posix style)."""
    ref = unquote(ref.strip().split('#')[0].split('?')[0]).replace('\\', '/')
    if not ref:
        return None
    base = '' if ref.startswith('/') else os.path.dirname(page)
    return os.path.normpath(os.path.join(base, ref.lstrip('/'))).replace(os.sep, '/')


def exists(target, tracked):
    # GitHub Pages also serves folder/ -> folder/index.html and page -> page.html
    candidates = (target, target + '/index.html', target + '.html')
    return any(c in tracked for c in candidates)


def refs_in(page, text):
    text = COMMENT_RE.sub('', text)
    found = CSS_URL_RE.findall(text) + CSS_IMPORT_RE.findall(text)
    if page.endswith('.html'):
        text = INLINE_SCRIPT_RE.sub(r'\1\2', text)
        found += [next(v for v in groups if v) for groups in ATTR_RE.findall(text) if any(groups)]
        for srcset in SRCSET_RE.findall(text):
            found += [part.strip().split(' ')[0] for part in srcset.split(',')]
    return found


def main(prefixes):
    try:
        tracked = tracked_files()
    except (OSError, subprocess.CalledProcessError) as err:
        print(f'cannot list git files: {err}')
        return 2
    pages = sorted(p for p in tracked if p.endswith(('.html', '.css'))
                   and (not prefixes or p.startswith(tuple(prefixes))))
    missing = []
    for page in pages:
        try:
            with open(os.path.join(ROOT, page), encoding='utf-8', errors='replace') as fh:
                text = fh.read()
        except OSError as err:
            print(f'cannot read {page}: {err}')
            continue
        for ref in sorted(set(refs_in(page, text))):
            if not is_checkable(ref):
                continue
            target = resolve(page, ref)
            if target and not exists(target, tracked):
                missing.append((page, ref))

    if not missing:
        print(f'OK: {len(pages)} file(s) checked, every local asset link resolves.')
        return 0
    print(f'{len(missing)} missing local asset(s) (not tracked in git):')
    for page, ref in missing:
        print(f'  {page}  ->  {ref}')
    return 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
