# Select the Dress
## Description
Select the Dress is a server rendered app that will allow users to compare dresses they have tried on to help select the perfect one for the occasion.  The user can upload images of each dress along with any additional information they want to use for comparison including designer, style, price, store and notes.  The user can view dresses individually, compare two side by side or see all dresses and sort by rating, price and designer.

## User
This app is intended for users who are shopping for a dress and want to compare their options and share with family
and friends.


## Demo Log In
To see a demo of how the app works with dresses already added to the users account, use the following login info:
email: jane.doe@gmail.com
password: password1


## Layout
The app starts with a home page where information about how the app works is found and users are asked to create an account.
![Alt text](/screenshots/home-page-new.png?raw=true "Home Screenshot")


The user is taken to a sign up page to create an account.
![Alt text](/screenshots/sign-up-page.png?raw=true "Sign Up Screenshot")


If a user has an account, they will use the log in page.
![Alt text](/screenshots/log-in-page.png?raw=true "Log In Screenshot")


After creating an account or logging in, the user can add a dress by uploading images and adding information to the add a dress form.
![Alt text](/screenshots/add-dress.png?raw=true "Add Dress Screenshot")


All dresses can be viewed on the dresses page.  The user can view the front, side or back images of the dresses
and sort by rating, price and designer.  The user has the option to select two dresses and compare them sided by side
by clicking the compare button after selecting the two dresses. If the user clicks on the rating, it will be updated.  
If the user clicks on a dress they will be taken to the dress details page.
![Alt text](/screenshots/dresses-page-front.png?raw=true "Dresses Screenshot")


At the bottom of the dress page is a link that the user can send to friends.  This link does not require a log in.
The user's friends can only view the dresses, dress details and compare pages.
![Alt text](/screenshots/share-link.png?raw=true "Share Link Screenshot")


The dress details page lists all information the user added about the dress.  The user can edit this information
by clicking the edit button.  They will be taken to a form where details can be updated and saved.
![Alt text](/screenshots/dress-page.png?raw=true "Dress Screenshot")


Edit dress form:
![Alt text](/screenshots/edit-dress-page.png?raw=true "Edit Dress Screenshot")


The compare page allows the user to view two dresses and the details about each dress side by side.
![Alt text](/screenshots/compare-details.png?raw=true "Compare Screenshot")


If the user wants to update their name or email they may do so on the account page:
![Alt text](/screenshots/account-page.png?raw=true "Account Screenshot")


Flash messages are used to send messages to the user, for example: if there are errors in a form, if a dress was successfully
added, if the user was logged out successfully.
![Alt text](/screenshots/form-flash-message.png?raw=true "Flash Message Screenshot")


## Technologies, middleware and libraries used
* HTML & CSS
* Pug
* JavaScript
* jQuery
* Node.js & Express
* MongoDB & Mongoose
* Passport.js
* Mocha & Chai
* Sinon.JS
* Lodash
* Numeral.js
* Sessions
* Connect Flash
* Cloudinary & Multer
