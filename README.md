## Management events system

### About the project

This project was built for The Israel Museum, Jerusalem.
The technology stack:

> For the DB I used MySQL [Link](https://github.com/yisrael35/rest_imj/tree/main/sql/structure)<br>
> For the FrontEnd I used React with Redux and Material UI [Link](https://github.com/yisrael35/react_imj)<br>
> For the BackEnd I used REST-API and WebSocket (NodeJS) - current repository <br>
> For the deployment I used AWS-EC2 [Link](https://yisraelbar.xyz)<br>
> For the documentation I used wiki.js [Link](https://wiki-imj.herokuapp.com/)<br>
> To menage all the project I used Monday and Git<br>
> The project goal is to build a Management events system for IMJ.<br>

<p align="center">
  <h1 align="center">IMJ Server Architecture</h1>
  <p align="center">
    General documentation on the structure of the IMJ project
  </p>
</p>

## Required files to run the project

<ol>
  <li> .env - required variables in ./_env</li>
  <li> db structure and data - ./sql/structure/imj_db.mwb  || ./sql/migration/last_dump.sql</li>
</ol>


### Client API
<b>Production:</b>
<a href="https://www.yisraelbar.xyz">https://www.yisraelbar.xyz</a>
<b>Local:</b>
<a href="http://localhost:3001">http://localhost:3000</a>


### Server API
<b>Production:</b>

> <ol><li>Rest: <a href="https://rest-api.yisraelbar.xyz">https://rest-api.yisraelbar.xyz</a></li><li>WebSocket: <a href="wss://ws-api.yisraelbar.xyz">wss://ws-api.yisraelbar.xyz</a></li></ol>


<b>Local:</b>
> <ol><li>Rest: <a href="http://localhost:3001">http://localhost:3001</a></li><li>WebSocket: <a href="ws://localhost:3020">ws://localhost:3020</a></li></ol>

## Docker
Run the project - Simply by running the commend:
docker-compose up 
Stop the project:
docker-compose down --rmi all


## LOGIN

To make any request REST / WS you will have to get a token from <a href="https://wiki-imj.herokuapp.com/en/Backend/auth"> here</a>
There 3 types of Tokens:

<ol>
  <li> Platform - used for all the requests (valid for 1d)</li>
  <li> Login -(NOTE - NOT available yet)  used for 2FA, after you enter username and password another validation is required: email/sms (valid for 20m)</li>
  <li> Reset Password - (valid for 20m)</li>
</ol>

Payload token for example:

```json
{
  "user": { "id": 1, "level": 1 },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiY295NWR5d0gyM0dQdHpjaFB2ZGs2Y0ZpWGVqenlXcmNBQUJqWVN0SWMzWT0iLCJhbGdvcml0aG0iOiJIUzI1NiIsImlhdCI6MTY0ODE1OTIxNSwiZXhwIjoxNjQ4MjQ1NjE1fQ.EwRKw_6WVGcpU6n2SSMyAawUz0YPVmWDB6xZcScqSbM"
}
```

The token been created with

## DB

### Configurations & Connectivity

The project works with db in mysql, where the db name is: imj_db
When the project starts to run he tries to init db connections from .env file
The values:

```js
DB_HOST = localhost
DB_USERNAME = root
DB_PASSWORD = password
DB_NAME = imj_db
```

### DB - helper

All call's to db (execution of sql queries) done by db_helper file `./utils/db_helper`
For example:

```js
const product = await db_helper.get(query.get_product_by_id(product_id))
```

## SQL

### migration

contains queries to update the dbs

### structure

contains DB structure: imj_db

### queries

contains all queries to mysql db

## Channels

### WS

All about the WS in the project you will find in our ws-documentation <a href="https://wiki-imj.herokuapp.com/en/Backend/WebScoket"> wiki-ws
</a>

#### Sessions

After the connection to the WS a unique session will be created in order to identity the connection and handle all of his requests.
Session example:

```js
{ user: { id: 1, level: 1 }, authenticate: true }
```

### REST

All the rest is this project are been declare in index.js and the implementation is in the ./api/ folder,
The available EndPoints:

 <ol>
  <li> auth </li>
  <li> bid </li>
  <li> client </li>
  <li> cost </li>
  <li> csv </li>
  <li> event </li>
  <li> event_type </li>
  <li> forgot_password </li>
  <li> location </li>
  <li> pdf </li>
  <li> schedule_event </li>
  <li> supplier </li>
  <li> user </li>
  <li> utils </li>
</ol>

Each EndPoint divide to three parts:

 <ol>
  <li> auth.routes.js </li>
  <li> auth.controller.js </li>
  <li> auth.service.js </li>
</ol>

<b> More info in our <a href="https://github.com/yisrael35/rest_imj/wiki"> Wiki </a></b>

## Worker

Some of the tasks in the project are highly consuming cpu usage and in order to not block the Node main loop - we created workers for those tasks.
The task that using a worker:
csv - in order to create a csv files for different tables in the db/ and client display

## Helper File

We using `./utils/helper.js` in order to validate phone number/ emails/ passwords etc' using regex.

## RabbitMQ - QUEUES

We using Rabbit-MQ in order to handle our loges in the project.
We using a single connection in order to connect to the queues,
each queue use `./utils/message_broker.js` that's produce (DP - Singleton) object of the queue
For more info about RabbitMQ <a href="https://www.rabbitmq.com/documentation.html">click here</a>
The queue path in the project: `./utils/log_queue.js`

## Files (assets)

The Folder `./files/` is contain all the files that user will upload or create(csv/pdf) while he used the website, in order to download the files the client side need to call to follow path:
`http://example.com/assets/file_name.pdf`

For example:

> http://localhost:3001/assets/csv_1648217122426.csv

### Cron Jobs

It runs a job/task periodically on a given schedule in our server, and one of the benefit of this is that we able change the task or replace it without stopping the server.
Our cron job is: `./cron_job/clean_files.js` and every night in: 00:00 it delete all the files that created during the day. (in order to clean the server from unused files)

## Messaging

### SMS

The sms in our project is in use to for 2FA, sms path in the project: `./utils/send_sms.js`
We using twilio package to send the sms.
<a href="https://www.npmjs.com/package/twilio">sms-twilio</a>

### email

The emails in our project is used for forgot password/ send files/ 2FA
The package that we used:
<a href="https://www.npmjs.com/package/@sendgrid/mail">sendgrid/mail</a>

## Document generation

### csv

We using csv files in order to produce reports and db tables data.
The package that we used:
<a href="https://www.npmjs.com/package/csv-writer">csv-writer</a>

### pdf

We using the following package in order to create FDP files for bids.
The package that we used:
<a href="https://www.npmjs.com/package/pdfkit">pdfkit</a>


👀 All rights reserved to Yisrael Bar<br>
🌱 How to reach me:<br>
[My Linkedin](https://www.linkedin.com/in/yisrael-bar-7534a842/)<br>
If you want to see more of my projects:<br>
[My GitHub](https://github.com/yisrael35)<br>

### Created by: Yisrael Bar
