#!/bin/bash
cp env.example .env

dbname="dev_task_list"
dbuser="dev_mc_task"

# rm-db-user.sh --dbname $dbname --dbuser $dbuser
# add-db-user.sh $dbname $dbuser

#change auth credentials
sed -i "s/AUTH_SECRET_KEY/theworldismyne/" .env
#change database credentials
sed -i "s/DB_CLIENT/mysql/" .env
sed -i "s/DB_HOST/db/" .env
sed -i "s/DB_NAME/$dbname/" .env
sed -i "s/DB_USER/$dbuser/" .env
sed -i "s/DB_PASS/$dbuser/" .env
sed -i "s/DB_MIGRATION/migrations/" .env
#change AWS configurations
sed -i "s/BUCKET_NAME/task-list-app-develop/" .env
sed -i "s/BUCKET_PUBLIC/AKIAVU52HV6F5GSK4O5P/" .env
sed -i "s/BUCKET_SECRET/NPu9zEMa8SNeCGoeq4Cgj3t7ms78hnlQBgLWTIUD/" .env
sed -i "s/BUCKET_LOCAL_FOLDER/uploads/" .env
sed -i "s/BUCKET_URL/s3-us-east-1.amazonaws.com/" .env

#install dependencies
npm install
npm install -g knex
#run migrations
knex migrate:latest