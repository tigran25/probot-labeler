# Add Comment Bot

[![Downloads][npm-downloads]][npm-url] [![version][npm-version]][npm-url]
[![Build Status][travis-status]][travis-url]

A [Probot](https://probot.github.io) bot to perform label additions/removals based on specific github event actions.

## Setup

Add a `.github/label.yml` file to your repository and then run the bot against it.

If the config is empty or doesn't exist, the bot will not run.

```yml

# Config

issues:
  opened:
    add:
      - triage/untriaged
    remove:
      - needs-triage
pulls:
  opened:
    add:
      - needs-review
```

## Contribute

If you have suggestions for how this bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

[travis-status]: https://travis-ci.org/lswith/probot-labeler.svg?branch=master
[travis-url]: https://travis-ci.org/lswith/probot-labeler
[npm-downloads]: https://img.shields.io/npm/dm/probot-labeler.svg?style=flat
[npm-version]: https://img.shields.io/npm/v/probot-labeler.svg?style=flat
[npm-url]: https://www.npmjs.com/package/probot-labeler
