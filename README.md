# Design Document
#*ALl API Keys and Servers have been disabled
### 1. Introduction
- This doc is meet to provide an outline for how everything works for the front-end of the project. To outline how the system works and to help programemrs understand the code based 

### 2. System Overview
- Components:

## App.js
- This contains all the pages for the front. 
- Renders the parent container the page flow for all the various pages and implementing various
- handles all the logic for the tokens

## Login.js 
- renders when no valid token is found in the async storage
- allows people to login posting to the backend api

## account_create.js
- ride account creation page that make a post to our api to create page

## Home
- This page is used as navigation between chosing if you want to Hitch a ride or post ride

# components in the container
    1.account_setting.jsx
    - displays the UserData As well as the logout button

- Data
## post_landing_page.js
- Displays the page that allows people to post thier routes for people

## HitchLandingPage.jsx
- Displays the page that allows people to Join Rides that are avaible. 

## ActiveRide.js
- Displays the active rides page that shows pickup locations for people to pickup as well as a confirmation button to signal that the ride was complete.
# componet in Container 
- Active_ride_map.js
- displays the map that Is displays the map for the start end and waypoints in the ride

## ActivePassenger 
- Displays A button with information about the ride and confirmation of the pickup. 




### API Used 
# backend part api we use for the project where we made api
## Google Gloud servercices 
#   Places Api
- api used for auto completion of places for the textbox as well as the a way to retrieve the coordingates 

#  Google Directions Api
- api used to render out the directions for start and stop location
