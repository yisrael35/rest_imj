#!/bin/bash
# NOTE -- node, mysql (include .my.cnf file), nginx, git, crontab need to be already installed 
# NOTE -- dir init_files should be exist with: .env, rsa_id, nginx_server, nginx_client

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

# nginx 
cd ../../etc/nginx/sites-available/
cp $init_files_path/nginx_server /imj_server
cp $init_files_path/nginx_client /imj_client

cd ../sites-enabled/
ln -s ../sites-available/imj_client
ln -s ../sites-available/imj_server
# certbot -nginx

/etc/init.d/nginx restart
 
# cronjob
crontab -e 
00 0 * * * /usr/bin/node /home/ubuntu/rest_imj/cron_job/clean_files.js > /home/ubuntu/rest_imj/cron_job/clean_files.log

pm2 start index.js --name server_imj