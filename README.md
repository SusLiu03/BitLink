# BitLink

Team Members: Phillip Peterson, Anthony Wong, Susannah Liu, Justin Chan

a social media platform catered towards computer science lovers!

Our stack:
Angular + TailwindCSS frontend + Express.js, MongoDB backend

How to deploy:
navigate into the Bitlink folder from github,
in one terminal:

`cd bitlink-app`

`ng build`

`ng serve`

then navigate to bitlink-app's parent directory in another terminal:

`npx ts-node server/server.ts`

Deployed on a DigitalOcean Ubuntu instance, using Nginx as a reverse proxy and accessible at: 137.184.186.52:4200.
We had to reconfigure the routing and redownloading the packages through npm.

