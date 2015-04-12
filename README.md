# 時差調整さま

## Introduction

Arranging a date for international video chat


## How to use

Just 3 Steps

1. Create a schedule
2. Share the URL
3. Answer your available dates


## Installation

```
$ git clone https://github.com/kenzan8000/chosei-sama.git
$ cd chosei-sama
$ bundle install
$ bundle exec heroku create YOUR_APP
$ heroku addons:add heroku-postgresql
$ heroku config
=== herokuapp Config Vars
DATABASE_URL:                  postgres://〜
HEROKU_POSTGRESQL_(COLOR)_URL: postgres://〜
....
$ heroku pg:promote HEROKU_POSTGRESQL_(COLOR)_URL
$ rake build server
[2015-04-12 09:58:41] INFO  WEBrick 1.3.1
[2015-04-12 09:58:41] INFO  ruby 2.1.2 (2014-05-08) [x86_64-darwin13.0]
== Sinatra (v1.4.6) has taken the stage on 4567 for development with backup from WEBrick
[2015-04-12 09:58:41] INFO  WEBrick::HTTPServer#start: pid=10994 port=4567
....
$ rake deploy
```
