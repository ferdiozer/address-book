

# Address Book

Microservice architecture



### Service
**Node JS**
```
cd services/auth
npm i
npm start
```

### Client (web)
**React JS**
```
cd client/web
npm i
npm start
```




#### pm2
```
# Start all applications
pm2 start ecosystem.config.js

# Stop all
pm2 stop ecosystem.config.js

# Restart all
pm2 restart ecosystem.config.js

# Reload all
pm2 reload ecosystem.config.js

# Delete all
pm2 delete ecosystem.config.js
```





#### services

**main**
**auth**


##### Api Docs

###### AUTH
```
// base URL = "http://localhost:6201/api/v1"

POST
/users (new user)
request body
{
    name:"",
    email:"",
    password:""
}

POST
/login
request body
{
    email:"",
    password:""
}
response
{
    "result": {
        "userId": "62640a6b26302b462c90b8e3",
        "created": "2022-04-25T09:52:42.943Z",
        "_id": "62666f6a786e07e3fdbd8ec8",
        "user": {
            "_id": "62640a6b26302b462c90b8e3",
            "name": "Test",
            "email": "test4@mail.com",
            "username": "",
            "created": "2022-04-23T14:17:15.693Z"
        }
    }
}

GET
/users
request header
{
    Authorization:"62640beee9d031a6b771f7f2",
}
response
{
    "result": {
        "_id": "62640beee9d031a6b771f7f2",
        "userId": "62640a6b26302b462c90b8e3",
        "created": "2022-04-23T14:23:42.375Z",
        "user": {
            "_id": "62640a6b26302b462c90b8e3",
            "name": "Test",
            "email": "test4@mail.com",
            "username": "",
            "created": "2022-04-23T14:17:15.693Z"
        }
    }
}


```