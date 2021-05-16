run a command in the shell


docker exec -it  digiqrp_app_1 /bin/bash




#RUN openssl x509 -req -sha256 -days 3650 -in server.csr -signkey server.key -out server.crt -extensions req_ext -extfile ssl.conf