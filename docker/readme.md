#COMMANDS:
`docker --help`

##Build the docker image with target <useraccount>/<project>
`docker build -t mccannbristol/php-fpm .`

##List the images on your local system
`docker images`

##remove one of the images
`docker rmi <IMAGE ID>`

##Parse the docker-compose.yml file and run in a detached (background) state (run a project after it's built)
`docker-compose up -d`

##Run project and force container recreation
`docker-compose up -d --force-recreate`

## Hard reset environment
restart docker desktop

`docker system prune -a`

`docker-compose up --force-recreate --build --remove-orphans`

##List running containers
`docker ps`

##Stop a container
`docker stop [IMAGE ID]`

##Log into a container
`docker-compose exec mysql bash`

`docker-compose exec php-fpm sh`

##REMOVE ALL THE THINGS RM -RF
`docker system prune -a`

#FAQs:
1. Once you've run a build command, you shouldn't have to run it again (even after switching your machine off and on) unless you made changes to the .env file

2. It's advisable (for now) to run composer install via terminal before parsing (running) a project via docker

3. There's no harm in stopping or destroying and rebuilding any docker container (it just can take a bit of time) [WHAT ABOUT DB SYNC?]

4. At the moment we're set up to run one project at the time. If you want to run multiple ones, you can do so by changing the ports in the .env file - they need to be unique for each project.

# INSTALLATION

1. Check if you have Parallels Toolbox; if you don't install it: https://kb.parallels.com/123931

2. Check if you have docker installed
   > docker -v

   If you don't, install Docker: https://docs.docker.com/docker-for-mac/install/; and then verify with the above command;

3 Check which installation of PHP you're using
> which php

if it's /usr/local/bin you can install the rest via Homebrew
if it's something else - you need to use MacPorts

4. brew install docker-machine-parallels

5. docker-machine create --driver=parallels prl-dev

6. docker-machine env prl-dev

7. eval $(docker-machine env prl-dev)

#TO GET A PROJECT UP AND RUNNING:
1. When running Docker for the first time:

   Open docker, preferences, Resources, File Sharing, Add: /Library/WebServer/Documents

2. Clone the project you're after

3. Build the docker image (use the build command above)

4. To run a project after it's built use the parse command listed above
