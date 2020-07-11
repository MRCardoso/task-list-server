#!/bin/bash
cp env.example .env

dbname="dev_task_list"
dbuser="dev_mc_task"
dbhost="db"

if [[ -n $1 ]]
then
    dbhost='127.0.0.1'
    mysql -h$MC_DB_HOST -u$MC_DB_USER -p$MC_DB_PASSWORD < ./scripts/development/init.sql
fi

#change auth credentials
sed -i "" -e "s/AUTH_SECRET_KEY/theworldismyne/" .env
#change database credentials
sed -i "" -e "s/DB_CLIENT/mysql/" .env
sed -i "" -e "s/DB_HOST/$dbhost/" .env
sed -i "" -e "s/DB_NAME/$dbname/" .env
sed -i "" -e "s/DB_USER/$dbuser/" .env
sed -i "" -e "s/DB_PASS/$dbuser/" .env
sed -i "" -e "s/DB_MIGRATION/migrations/" .env
#change AWS configurations
sed -i "" -e "s/BUCKET_NAME/task-list-development/" .env
sed -i "" -e "s/BUCKET_PUBLIC/AKIAVU52HV6F7QVKYSEZ/" .env
sed -i "" -e "s/BUCKET_SECRET/fhx3XJYOas7QZSdA\/41CRh+IuwOGrZ08RJNW8BHR/" .env
sed -i "" -e "s/BUCKET_FOLDER/images/" .env
sed -i "" -e "s/BUCKET_URL/s3\.amazonaws\.com/" .env

#install dependencies
npm install
npm install -g knex
#run migrations
knex migrate:latest
knex seed:run