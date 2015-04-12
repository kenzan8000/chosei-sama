require 'rake'
require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/activerecord/rake'


task :clean do
  cleanup
end

task :build => :clean do
  compass
  javascript
end

task :server do
  server
end

task :deploy do
  deploy
end

task :migrate do
  migrate
end


def cleanup
  sh 'rm -rf public/js/*'
  sh 'rm -rf public/css/*'
end

def server
  sh 'ruby app.rb -e development'
end

def compass(opts = '')
  sh 'compass compile -c config.ru --force ' + opts
end

def javascript
  sh 'cp assets/js/* public/js/'
end

def deploy
  sh 'git push heroku master'
  sh 'heroku run rake db:migrate'
  sh 'bundle exec heroku open'
end

def migrate(env = 'development')
  if env == 'development'
    sh 'bundle exec rake db:migrate'
  end
end
