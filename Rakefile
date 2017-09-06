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
task :dev do 
  desc "dev wf_api"
  CACHE = ENV["CACHE"] == "true" ? "" : "--build"
  sh "docker-compose -p wf_api -f #{COMPOSE_FILE_DEV} up -d #{CACHE} dev"
end

# Unit Test
task :test do 
  desc "test wf_api"
  CACHE = ENV["CACHE"] == "true" ? "" : "--build"
  sh "docker-compose -p wf_api -f #{COMPOSE_FILE_DEV} up #{CACHE} tester"
end