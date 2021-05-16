## Craft - Docker Notes

When using docker you must be aware that the containers will attempt to grab ports that may well be in use with other systems
if you use brew for services like mysql, redis or memcached and php-fpm / nginx or laravel valet.

you need to shut these down of course or map them to other ports.

I urge you to install dry with brew available at https://github.com/moncho/dry it gives a lot of insight into how the containers are running and performance.


Docker Caveats

When you install docker desktop access access preferences and be sure to set the memory, shares and image size under resources high enough.

1. CPU recommend 2 
2. Memory recommend 4GB
3. Swap 1GB
4. Disk Image Size 16GB 

Under the same tab file sharing I set the base of the project, do not recommend doing your whole home dir as this does slow docker.


to speed up access you can use docker-machine-parallels

1. brew install docker-machine-parallels

2. docker-machine create --driver=parallels prl-dev

3. docker-machine env prl-dev

4. eval $(docker-machine env prl-dev)

it does seem to make a difference but not that much really and you need Parallels as well.

## Docker Commands
from the command line its a pain to start using docker-compose yo can use docker compose <cmd> now or hae a little script in the root a bit like artisan 
that can call commands I use dcp.sh in mine an this has the commands I most use.

## important
you must ensure you are running the correct version on php in the command line , this is were I recommend you do composer install etc.
the docker container does not have composer installed.
( you could if needed but defaults the point really install it into the container) 


if you attach to a container with

`docker compose exec php-fpm sh` to get into the command line run apt update, then apt install.
Composer can be installed but it will be removed when you restart docker.

### docker-Compose.yaml

This is the most important file here it has all of the mapping commands and ports etc.
things like ${CRAFT_PORT} are coming from env files that are copied across when the image is built, if you look into the docker directory you will see the various
definable bits 

DB this is a directory that is mapped in the docker-compose.yaml file and is the actual directory mysql uses for its storage to persist the db.

under php there are two dirs we interested in teh dev dir and the docker file has all of the build commands and this is where teh configs are copied from.


#xdebug
the xdebug is 3.x and here are the correct entries be sure of course to change you ide key to suite
xdebug.mode=debug
xdebug.start_with_request=yes
xdebug.client_host=host.docker.internal
xdebug.remote_port=9000
xdebug.remote_enable=1
xdebug.idekey=PHPSTORM

if you chnage these you need to rebuild and restart, they are not dynamic you can use
`docker compose exec php-fpm sh` then to to /etc/php etc and change these but make sure you save your changes to your local copy and rebuild etc
so that the new config is copied into place.


### Mysql
in many of the setups teh mysql directory is stored locally with.


if your containers get messed up you can clear all the data using docker desktop under debugging 
and then do a docker system prune -a and rebuild, your config and db are safe.


## SSL and host names
The commands in the docker file for php are wrong, yuo can can generate a key and it is ok but you will get a bad response form the browser
as local host is actually replying to you could have dns pointing to vwfs.rac.local for example but browser think its local host is replying and
throws an error its because of the 0.0.0.0 mapping so one may to get around this is to remove the 0.0.0.0 mapping and have nginx acting as a 
reverse proxy as well, I am going to do some work in this over the weekend and fix it for sure.

on prod its not an issue and the ip address resolves correctly.

at this moment use http only and I will update the necessary files as soon as possible.

use dnsmasq if possible thsi makes life easier and you can install this with brew config lives in usr/local/etc/dnsmasq.conf


#### useful Commands

#COMMANDS:
`docker --help`


##List the images on your local system
`docker images`

##remove one of the images
`docker rmi <IMAGE ID>`

##Parse the docker-compose.yml file and run in a detached (background) state (run a project after it's built)
`docker compose up -d`

##Run project and force container recreation
`docker compose up -d --force-recreate`

## Hard reset environment
remove data using  docker desktop

`docker system prune -a`

`docker compose up --force-recreate --build --remove-orphans`

##List running containers
`docker ps`

##Stop a container
`docker stop [IMAGE ID]`

##Log into a container
`docker compose exec mysql bash`

`docker compose exec php-fpm sh`

##REMOVE ALL THE THINGS RM -RF
`docker system prune -a`


## assets and db and symlnks

Beware there are sym-links that are not orphaned you can place your data where you want as long as docker desktop/preferences/sharing knows about them

for craft you need a storage dir in the root
and 
web/cpresources
web/assets
also and .env file taken from .env,docker











 



