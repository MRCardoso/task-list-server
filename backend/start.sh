#!/bin/bash
cp env.example .env

dbname="dev_task_list"
dbuser="dev_mc_task"

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
sed -i "s/BUCKET_NAME/task-list-development/" .env
sed -i "s/BUCKET_PUBLIC/AKIAVU52HV6F7QVKYSEZ/" .env
sed -i "s/BUCKET_SECRET/fhx3XJYOas7QZSdA\/41CRh+IuwOGrZ08RJNW8BHR/" .env
sed -i "s/BUCKET_FOLDER/images/" .env
sed -i "s/BUCKET_URL/s3\.amazonaws\.com/" .env

#install dependencies
npm install
npm install -g knex
#run migrations
knex migrate:latest
knex seed:run