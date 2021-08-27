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
sed -i "" -e "s/BUCKET_NAME/$AWS_TL_BUCKET/" .env
sed -i "" -e "s/BUCKET_PUBLIC/$AWS_TL_PUBLIC/" .env
sed -i "" -e "s/BUCKET_SECRET/$AWS_TL_SECRET/" .env
sed -i "" -e "s/BUCKET_FOLDER/images/" .env
sed -i "" -e "s/BUCKET_URL/$S3_URL/" .env
## mail credentials
sed -i "" -e "s/EMAIL_ADM/$MAIL_TL_SENDER/" .env
sed -i "" -e "s/EMAIL_API/$MAIL_TL_KEY/" .env

#install dependencies
npm install
#run migrations
knex migrate:latest
#run seeds
knex seed:run