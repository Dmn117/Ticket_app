<h1 align="center">Ticket Application</h1>

<div align="center">

![App version](https://img.shields.io/badge/App-v1.0.0-blue)
![Node version](https://img.shields.io/badge/Node-v20.10.0-green)
![License](https://img.shields.io/badge/License-GPL3.0-blue)
![Express](https://img.shields.io/badge/Express-v4.21.1-green)

</div>


# Run Development Environment

Considerations: 

    - Install Docker and Docker Compose locally
    - Run Docker (WSL) in the background

Commands:
    
    npm i

    npm run dev

Recomendations: 

    - Install MongoDB Compass to manage the local database
    - Add and customize the .env file
    - Generates Private and Public Keys (.pem RS256) inside the src folder (Consider not using the same ones as in production)
    - Generate a folder in the project's working directory
    - Name it "keys", and store the production keys there. The build configuration will automatically replace them

Generate Private Key:

    openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048

Generate Public Key:

    openssl rsa -in private.pem -pubout -out public.pem

<div align="center">

[![](https://img.shields.io/badge/MongoDB_Compass-Download-blue)](https://www.mongodb.com/try/download/compass)

</div>



# Build


Commands:

    - npm run build

Docker Commands:

    - docker build --no-cache -t docker_user/name_project:version_number .



# Deploy

Considerations:

    - Add the productive .env file inside the same folder as your Docker Compose file.


Docker Compose (YAML):    

    services:
    
    tickets_mongo:
        image: mongo:latest
        container_name: tickets_mongo
        restart: always
        environment:
        MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME}
        MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
        ports:
        - "27017:27017"
        volumes:
        - tickets_mongo:/data/db
        networks:
        - ticket_app
    

    ticket_classifier:
        image: manrp/ticket_classifier:latest
        container_name: ticket_classifier
        restart: always
        env_file: .env
        networks:
        - ticket_app
        ports:
        - "5000:5000"


    tickets_backend:
        image: manrp/tickets_backend:latest
        container_name: tickets_backend
        restart: always
        env_file: .env
        networks:
        - ticket_app
        depends_on:
        - tickets_mongo
        ports:
        - "3000:3000"
        volumes:
        - tickets_backend:/tickets_backend/uploads
        - tickets_backend:/tickets_backend/temp


    tickets_frontend:
        image: manrp/tickets_frontend:latest
        container_name: tickets_frontend
        restart: always
        networks:
        - ticket_app
        depends_on:
        - tickets_backend
        ports:
        - "80:80"


    volumes: 
    tickets_mongo:
    tickets_backend:


    networks:
    ticket_app:
        driver: bridge