# Steps to run this project:

1. clone the project

## Change directory into `Backend`

2. `npm i` to install modules
3. create `.env` file with valid `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `GOOGLE_PLACES_KEY`, `OAUTH_CLIENT_ID` variable
4. `node index`

## Switch directory to `Frontend`

5. `npm i` to install modules
6. create `.env` file and with valid `REACT_APP_GOOGLE_PLACES_API_KEY`, `REACT_APP_CLOUD_NAME` variable
7. `npm start`

### CI/CD SE_23:
note: `git push` will trigger `npm test` and all tests will have to pass before the push would complete successfully.

### Cybersecurity SE_09:
What can go wrong?
Fortunately, my app is for itinerary planning and does not store any payment or personal data. That said, for the application to be useful, users should not have to worry about their itinerary being edited by another person. Likewise, guide administrators should not worry their guide be edited by a user/ another admin.

**Here are some actions that should be prevented (forbidden access):**
1. user accessing/ changing itinerary of another user
2. non-admin tries to access admin page
3. non-admin tries to add markers on to map

**A list of cyber security measures that you have implemented:**
1. Passwords (hashed and salted)
2. JWT tokens (signed to prevent unauthorised access)
3. google auth (reduce number of passwords I have to manage)
4. check for forbidden access (detailed in threat model above ^)
5. implement user roles (admin vs user)

### Web and Mobile Backend Development SE_22:
**A diagram that describes your overall backend architecture**
- to mongoDb and Cloudinary: https://imgur.com/a/faTLOLv

**A summary of the data types, queries, and mutations in your GraphQL API**
https://github.com/WJKwok/TravelPlanner/blob/master/backend/graphql/typeDefs.js
- When an admin adds a place of interest to the guide, image files uploaded to the frontend form are submitted to Cloudinary which returns an array of imageIds. That array is then stored in a document on MongoDB together with other information in the same form. 
- When a place of interest is queried, MongoDB returns the document, and the array of imageIds is then used to call Cloudinary to return the image assets

A link to the project running as a prototype or in production, if possible: https://reverent-kilby-0bf6d0.netlify.app/
