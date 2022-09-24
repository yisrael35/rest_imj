#!/bin/bash
# NOTE -- dir init_files should be exist with: .env, rsa_id, nginx_server, nginx_client
sudo apt update
sudo apt install curl
sudo apt install npm
sudo npm install pm2 -g
sudo apt install bashtop
sudo apt-get install mysql-server
sudo mysql -u root -p
 ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'xxxxxxxxxxxxxxx';

sudo apt install nginx
# install certbot
sudo apt install python3 python3-venv libaugeas0
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot certbot-nginx
sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot

# update node version
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.bashrc
nvm install v14.16.0



sudo adduser $imj_user --disabled-password 
cd /home/$imj_user/
mkdir .ssh
# cp  $root_user/init_files/authorized_keys ./.ssh/authorized_keys
chown -R $linux_user:$linux_user /home/$linux_user/


# init projects
git clone https://github.com/yisrael35/rest_imj.git imj_server
git clone https://github.com/yisrael35/react_imj.git imj_client

linux_user=`pwd`
server_path=$linux_user/imj_server/
client_path=$linux_user/imj_client/
cd $server_path

git checkout dev 
npm i

init_files_path=$linux_user/init_files
cp $init_files_path/.env $server_path/
cp $init_files_path/rsa_id  $server_path/certificates/

mysql -e  "CREATE DATABASE imj_db DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;"
mysql imj_db < $server_path/mysql/migration/data_and_structure.sql

cd $imj_client
git checkout dev 
npm run build 
cd ..


# ----------------------------------------------------
NGINX_AVAILABLE_VHOSTS='/etc/nginx/sites-available'
NGINX_ENABLED_VHOSTS='/etc/nginx/sites-enabled'
imj_client ='imj_client'
imj_server_rest ='imj_server_rest'
imj_server_ws ='imj_server_ws'
# Create the Nginx config file.
cat > $imj_client <<EOF
server {
root /home/ubuntu/react_imj/build;
index index.html index.htm index.nginx-debian.html;
server_name _ yisraelbar.xyz www.yisraelbar.xyz;
location / {
try_files $uri $uri/ /index.html;
}
}
EOF
echo "imj_client file created"

cat > $imj_server_rest <<EOF
server {
  server_name rest-api.yisraelbar.xyz;
  location / {
proxy_pass http://localhost:3001;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;
proxy_read_timeout 300;
proxy_connect_timeout 300;
proxy_send_timeout 300;
}
}
EOF
echo "imj_server_rest file created"


cat > $imj_server_ws <<EOF
server {
  server_name ws-api.yisraelbar.xyz;
  location / {
    proxy_pass http://localhost:3020;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 300;
    proxy_connect_timeout 300;
    proxy_send_timeout 300;
    }
}
EOF
echo "imj_server_rest file created"

cp ./$imj_client $NGINX_AVAILABLE_VHOSTS/$imj_client
echo "imj_client file copied"
rm ./$imj_client

cp ./$imj_server_rest $NGINX_AVAILABLE_VHOSTS/$imj_server_rest
echo "imj_server_rest file copied"
rm ./$imj_server_rest

cp ./$imj_server_ws $NGINX_AVAILABLE_VHOSTS/$imj_server_ws
echo "imj_server_ws file copied"
rm ./$imj_server_ws

# certbot --nginx -d $sub_domain -d www.$sub_domain

ln -s $NGINX_AVAILABLE_VHOSTS/$imj_client $NGINX_ENABLED_VHOSTS/$imj_client
ln -s $NGINX_AVAILABLE_VHOSTS/$imj_server_rest $NGINX_ENABLED_VHOSTS/$imj_server_rest
ln -s $NGINX_AVAILABLE_VHOSTS/$imj_server_ws $NGINX_ENABLED_VHOSTS/$imj_server_ws
echo "file is been pointed"

# certbot -nginx
sudo certbot --nginx -d yisraelbar.xyz -d www.yisraelbar.xyz
sudo certbot --nginx -d rest-api.yisraelbar.xyz -d ws-api.yisraelbar.xyz
sudo /etc/init.d/nginx restart 

sudo su 
crontab -e
0 12 * * * /usr/bin/certbot renew --quiet

# cronjob
sudo su ubuntu 
crontab -e 
00 0 * * * /usr/bin/node /home/ubuntu/rest_imj/cron_job/clean_files.js > /home/ubuntu/rest_imj/cron_job/clean_files.log

pm2 start index.js --name server_imj