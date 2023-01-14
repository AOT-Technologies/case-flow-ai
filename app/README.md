

# CASEFLOW Documentation For Application Installation

In the following document, we’ll describe about the different project dependencies, and the installation options being supported.


## Prerequisites
- For Docker-based installation [Docker](https://www.docker.com/) needs to be installed.
    + For Mac, make sure the [docker for mac](https://docs.docker.com/desktop/get-started/#resources) memory allocation is set to at least 16GB.


## Download the caseflow.ai
- Clone this github repo: https://github.com/AOT-Technologies/case-flow-ai
- Git repo contains 4 folders 

    ![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/development/.images/folder-structure-caseflow.png)
        
    

## Individual Service Deployment
- ### caseflow_idm(Keycloak)
    - Make sure you have a Docker machine up and running.. 
    - Make sure your current working directory is cd {Your Directory}/case-flow-ai/app/caseflow-idm
    #### To start Keycloak server     
    - Run  `docker-compose up -d to start.`
    
     ![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/development/.images/keyclock.png)
    
    NOTE: Use --build command with the start command to reflect any future changes eg : `docker-compose up --build -d`

    #### To stop the keycloak server
    - Run `docker-compose stop` to stop.
    The application should be up and available for use in http://localhost:8085/

    #### Login Credentials :

    Username : admin 

    Password : changeme

    ![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/development/.images/kclogin.png)

    #### Create user in the keycloak admin 
    
    ![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/development/.images/adduser.png)
    ![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/development/.images/passwordset.png)
    

- ### caseflow-dms
    Make sure your current working directory is cd {Your Directory}/case-flow-ai/app/caseflow-dms
    
    Make sure you are adding the below changes in app.module, for enabling graphql playground at port:7002 where you can test dms server queries and mutations 
    
    ```sh
    introspection:true,
    playground:true
  ```
   
    
    ![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/dev/.images/caseflow-dms-setting.png)
    
    NOTE: You should revert the changes before pushing the code for build
    
   #### To start the caseflow-dms server in local
    - Run `docker-compose up -d` to start

        ![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/dev/.images/dms-docker-compose.png)
    #### To stop the caseflow-dms server
    - Run `docker-compose stop` to stop.    

        The application should be up and available for use in http://localhost:7002/graphql
   

        ![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/dev/.images/case-flow-dms-playground.png)
        
        
 
 
- ### caseflow-core (NestJS server)
    
    Make sure your current working directory is cd {Your Directory}/case-flow-ai/app/caseflow-core
    
    Make sure you are adding the below changes in app.module, for enabling graphql playground at port:7001 where you can test core server queries and mutations 
    
     ```sh
    introspection:true,
    playground:true
  ```
    
    ![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/dev/.images/caseflow-core-setting.png)
    
    NOTE: You should revert the changes before pushing the code for build
    
   #### To start the caseflow-core server in local
    - Run `docker-compose up -d` to start

        ![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/dev/.images/caseflow-core-docker-compose.png)
    #### To stop the caseflow-dms server
    - Run `docker-compose stop` to stop.    

        The application should be up and available for use in http://localhost:7001/graphql
   

        ![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/dev/.images/caseflow-core-7001-graphql.png)
        
        
   
   
- ### gateway-service

   
    Make sure your current working directory is cd {Your Directory}/case-flow-ai/app/gateway-service
    
    Make sure you are adding the below changes in app.module, for enabling graphql playground at port:7000 where you can test dms server queries and mutations 
    
     ```sh
    introspection:true,
    playground:true
  ```
    
    ![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/dev/.images/caseflow-gateway-setting.png)
    
    NOTE: You should revert the changes before pushing the code for build
    
   #### To start the gateway-service in local
    - Run `docker-compose up -d` to start

        ![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/dev/.images/casflow-gateway-service-docker-compose.png)
    #### To stop the gateway-service
    - Run `docker-compose stop` to stop.    

        The application should be up and available for use in http://localhost:7000/graphql
   

        ![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/dev/.images/caseflow-7000-playground.png)




- ### caseflow-web(React Application)

   Modify the environment variable in .env

   Make sure you are pointing to locally hosted server in .env

     ```sh  
    #caseflow web Api End point 
    REACT_APP_CASEFLOW_API_URL=http://localhost:7001
    REACT_APP_CASEFLOW_GRAPHQL_API_URL=http://localhost:7000    
  ``` 

Make sure your current working directory is `cd {Your Directory}/case-flow-ai/app/caseflow-web`

#### Run the following command in terminal


- Run `docker-compose up -d` to start

NOTE: Use --build command with the start command to reflect any future .env / code changes eg :` docker-compose up --build -d`

 #### To stop the caseflow-web
- Run `docker-compose stop` to stop. 




The application should be up and available for use at port defaulted to 3000 in http://localhost:3000/


![App Screenshot](https://github.com/AOT-Technologies/case-flow-ai/blob/staging/dev/.images/caseflow-web-starting-page.png)







    
