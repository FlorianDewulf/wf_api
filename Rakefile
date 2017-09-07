require 'pathname'

# RAKE CONFIG

PROJECT_DIR = Pathname.new(".")
COMPOSE_FILE_BUILD = PROJECT_DIR + "etc/docker/docker-compose.build.yml"
COMPOSE_FILE_DEV = PROJECT_DIR + "etc/docker/docker-compose.dev.yml"

# Build
task :build do 
  desc "build wf_api"
  CACHE = ENV["CACHE"] == "true" ? "" : "--build"
  sh "docker-compose -p wf_api -f #{COMPOSE_FILE_BUILD} up #{CACHE} builder"
end

# Start dev server
task :start do 
  desc "dev wf_api"
  CACHE = ENV["CACHE"] == "true" ? "" : "--build"
  sh "docker-compose -p wf_api -f #{COMPOSE_FILE_DEV} up -d #{CACHE} dev"
end

# Stop dev server
task :stop do 
  desc "stop dev wf_api"
  sh "docker stop wfapi_dev_1 wfapi_dev-server_1"
end

# Stop dev server
task :restart do 
  desc "restart dev wf_api"
  sh "rake stop"
  sh "rake start"
end

# Unit Test
task :test do 
  desc "test wf_api"
  CACHE = ENV["CACHE"] == "true" ? "" : "--build"
  sh "docker-compose -p wf_api -f #{COMPOSE_FILE_DEV} up #{CACHE} tester"
end