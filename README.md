#COMMANDS:
`docker --help`

##List the images on your local system
`docker images`

##remove one of the images
`docker rmi <IMAGE ID>`

##Parse the docker-compose.yml file and run in a detached (background) state (run a project after it's built)
`docker-compose up -d`

##Run project and force container recreation runs in background
`docker-compose up -d --force-recreate`

##Run project rebuilding as required and remove any orphaned containers
`docker-compose up --force-recreate --remove-orphans --build`

##Stop the running project that was started with -d switch
`docker-compose stop`


## Hard reset environment
restart docker desktop

## clear down and remove all docker containers, networks etc
`docker system prune -a`

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

# INSTALLATION ( contains optional steps )

1. Check if you have Parallels Toolbox; if you don't install it: https://kb.parallels.com/123931

2. Check if you have docker installed
    > docker -v

    If you don't, install Docker: https://docs.docker.com/docker-for-mac/install/; and then verify with the above command;

3 Check which installation of PHP you're using
> which php

