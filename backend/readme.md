# install npm modules
```shell
npm install
```

# create env file to DB connection
```shell
cp env.example .env
```

# run migrations

```shell
knex migrate:latest
```

## run seed example (dev)
```shell
knex seed:run
```


## config .env to run the migrations and seed
```javascript
DB: {
    client: 'pg|sqlite3|mysql|mysql2|oracledb|mssql',
    connection: {
        host: 'HOST',
        database: 'DB_NAME',
        user: 'DB_USER',
        password: 'DBPASS'
    },
    pool: {
        min: 1,
        max: 1
    },
    seeds: {
        directory: 'DB_SEED_PATH'
    },
    migrations: {
        tableName: 'DB_MIGRATION_NAME'
    }
}
```

## config .env to connect with S3 bucket
```javascript
AWS: {
    Bucket: 'BUCKET_NAME',
    accessKeyId: 'BUCKET_PUBLIC_KEY',
    secretAccessKey: 'BUCKET_SECRET_KEY',
    uploadFolder: 'BUCKET_LOCAL_FOLDER',
    URL: 'BUCKET_URL'
}
```

## config .env to enable send mail
```javascript
MAIL: {
    adminMail: 'EMAIL_ADM',
    serviceMail: 'EMAIL_SERVER',
    loginMail: 'EMAIL_LOGIN',
    passMail: 'EMAIL_PASSWD',
    apiKey: 'EMAIL_API',
}
```