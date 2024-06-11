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

Deployed on a DigitalOcean Ubuntu instance, using Nginx as a reverse proxy and accessible at: [[137.184.186.52:4200](https://137.184.186.52/)](http://137.184.186.52).
We had to reconfigure the routing and redownloading the packages through npm.

Start at the page: http://137.184.186.52/login

A test account that can be used for login is:

Username: jchan20@uci.edu

Password: tester123
