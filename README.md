# Shipments and Organizations
____

## Prerequisites
In order to run this project, it's needed:

- Docker Desktop (here the Postgres database and pgAdmin will be build).


### Install dependencies
> npm i

### Set up DB
> npm run db:up
> npm run db:migrate

### Seed DB
In another bash (located in the same directory), run:
> npm run send

__Then, you will be able to log into the [pgAdmin](http://localhost:5433/)__ with email: admin@admin.com and password `admin`

#### Take into account: 
**In order to create  a connection in pgAdmin** the host must be `host.docker.internal`

### Start in dev
> npm run start:dev

____
## TODO: 
- Improve express response mechanism.  Standardization.
- Implement schema validations.
- **COVERAGE**
- Workaround PrismaClient to work with inversify. 
- Always can get better 🤷🏻‍♂️  
