# GoTo - a simple URL redirector
### Introduction
A minimalistic application built using NodeJS and React, to allow managing personal bookmarks. 

### Getting Started

steps:

1. Install Docker (if you don't have it already)
2. Create GoTo deployment folder e.g. `mkdir goto`
3. `cd` into `goto`
4. Create a file named: `production.env`
    1. Add `PORT=8000`
    2. Add `DB_PATH=./db.sqlite`
    3. Save the file
5. Run `echo "" > db.sqlite` to create an empty file
6. Run `docker container create --name goto -p 8000:8000 -v ${PWD}/production.env:/app/production.env -v ${PWD}/db.sqlite:/app/db.sqlite mandaarp/goto`
7. Create NGINX deployment folder e.g. `mkdir nginx`
8. `cd` into `nginx`
9. Save following content as `nginx.conf`
    ```
     events { }
     http {
       server {
            listen 80;
            server_name goto;
            location / {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://192.168.8.3:8010/;
                proxy_ssl_session_reuse off;
                proxy_set_header Host $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
             }
             location /robots.txt {
                alias /var/www/robots.txt;
             }
        }
     }
10. Run `docker container create --name nginx -p 80:80 -v ${PWD}/nginx.conf:/etc/nginx/nginx.conf:ro nginx`
11. Add following line to your `/etc/hosts`(Mac and Linux) or `C:\Windows\System32\drivers\etc\hosts` file:
    ```
    127.0.0.1 goto
    ```
12. Start NGINX using `docker container start nginx`
13. Start GoTo using `docker container start goto`
14. Open your favorite browser and navigate to: `http://goto/`
