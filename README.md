# Readme

## Installation Guide

### Running Server Locally
1. Install `Expo Go` app on your iPhone
1. Clone this repo
1. `cd` into the cloned repo
1. Run `npm i`
1. Run `npm run start`

And now the Expo Go server is running and can be connected to by your iPhone

## User Guide

1. Start the Hitch API
1. Set the domain and pag variable in the frontend code to utilize the hosted domain
1. Install and launch the `Expo Go` app on your iPhone
1. Run the frontend server on your device
1. Scan the QR code after the server is running
1. Use the app as normal

### Login Page
This is the first page you see in the app. You enter your username and password in order to login and start using the rest of the app.

### Account Creation Page
The first time you use the app, you will need an account. Getting to this page is easy and done by clicking the create account link on the login page.

### Home Page
The home page is where you decide what you want to do in the app. Normally you can choose to view your account, join a ride, or create a ride. When you have a ride or a drive that is active, you can also select the active ride page that changes if you are a rider or a driver.

### Account Info/Logout Page
This page allows you to see the stored account data and logout. On a button press you can view all past rides that are completed, both as a rider and a driver

### Ride Join Page
On this page you can select a ride start point and destination and filter available rides to join. You can view rides that are awaiting a decision to join as well and see rides you are accepted into and some information to make sure you can join the ride when the moment comes.

### Drive Creation Page
This page allows you to set the drive start point and destination you are going to make. You can also specify how much each user should pay and how far you are willing to go to pick them up, as well as how many people you can drive. After creating a ride, you can use this page to accept and deny riders from joining your ride.

### Active Ride
When an active ride is in session that you are going to be picked up in, this page allows you to see where you are supposed to be picked up at, as well as a button to notify the app that you have indeed been found and picked up by the driver.

### Active Drive page
When you have a drive in session, it lets you know the information about the ride, like how many people to pick up, how much you are going to make and the destination. The locations of all the riders and the destination of the ride is also displayed in text format and on a map with the route to take. Once the ride is complete, simply mark it as so on this page.