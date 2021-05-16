## Useful Docker Commands


Run a console Command

```` docker compose exec app bash -c "cd /var/www/html && php artisan solar:pull" ```` 

Builds the containers

```` docker compose build ````

Start and stop the containers

````
 docker compose build
 docker compose up -d
````
