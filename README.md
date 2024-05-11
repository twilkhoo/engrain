# Engrain

## Description

A web app to view, save and share important memories. The backend is uses a dockerized GraphQL server (via NextJS's API library), Auth0 for authentication, Prisma for an ORM to deal with the DB, CockroachDB for a quick cloud-based distributed PostgreSQL cluster, Google Maps Places API to select locations, AWS S3 to save images, and later AWS EC2 for deployment. The frontend uses NextJS (React) and Tailwind CSS.

This was really a way for myself to get familiar with some of the most prominent AWS products (S3, EC2, ECS in experimenting), while also reconnecting with some tech I've used before such as Prisma and CockroachDB.

## Functionality
- Users can login via Auth0, which includes login via Google.
- Users have two modes- admins (that can create global memories for the world to see), and regular users that can only view. Authentication is required to view any data, though.
- Admins can create memories that specify a title (location), a description, a category, an optional image, an optional url, and an optional Google Maps coordinate pair- this is also the schema format.
- Images are uploaded to an AWS S3 bucket.
- The Google Maps Places Autocomplete and Map Viz API is used to specify the location of the memory.

## Spin-up
First, clone the repo.
Then, we need to sign ourselves up for the services we must use.

1. Create a CockroachDB cluster, attached to PostgreSQL.
2. Create an AWS S3 Bucket (and also EC2 instance if wanting to deploy later).
3. Create a Google Maps project and get the API.
4. Create an Auth0 project
With Auth0 in particular, also define allowable callback/origin URLs you use, e.g. the AWS instance URL or localhost:3000.

Copy the required connection strings/keys into an .env (all listed below).

Run `npx prisma generate` to generate the Prisma query engine (and the Pothos code generator).
Invoke `npm run dev` or `docker compose run --build` to actually start the server.

If there's ever a need to debug, `npx prisma studio` is very helpful- one of the reason's why I default to Prisma as my ORM of choice. To update a schema, run `npx prisma db push`, creating a migration.


Here's everything used in the .env:

```
DATABASE_URL=""

APP_AWS_ACCESS_KEY = ''
APP_AWS_SECRET_KEY = ''
APP_AWS_REGION = ''
AWS_S3_BUCKET_NAME = ''
NEXT_PUBLIC_AWS_S3_BUCKET_NAME = ''

AUTH0_SECRET=''
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_CALLBACK_URL = 'http://localhost:3000/api/auth/callback'
AUTH0_ISSUER_BASE_URL=''
AUTH0_CLIENT_ID=''
AUTH0_CLIENT_SECRET=''
AUTH0_HOOK_SECRET=''
NEXT_PUBLIC_MAPS_KEY=""
```

## Demos

## Next steps
An easier way to see memories from particular users could be helpful, which makes it more like a modern social media app.


