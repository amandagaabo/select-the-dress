# Select the Dress App Description
The following information summarizes what the app is and how it was designed.


## General Description
Select the Dress is an app that will allow users to store and compare dresses they have tried on to help choose the perfect one. The user will add dresses that they want to compare. The user will upload a photo of them wearing the dress and add a rating for comparison to other dresses. Additional information such as designer, style number, price, store and notes may be added to each dress. After dresses have been added, the user can view all dresses, sort by rating, select one dress to view the details about that dress or select two dresses and compare the details for both dresses.  The user can have their friends rate the dresses as well by sending them a link.  


## Technologies and libraries
* HTML & CSS
* Pug
* JavaScript
* jQuery
* Node & Express
* Mongo & Mongoose
* JWT & Passport


## App Layout
### Header
The header will contain:
* Logo
* Sign up and Log in buttons  -or-  Sign out and My account buttons if user is logged in

### Home - /
The home page will contain:
* A short description of what the app should be used for
* 3 column benefits/uses
  * store and rate dresses you have tried on
  * share with friends and get feedback
  * choose the perfect dress
* Get started button (take to sign up)
* Demo print screens of how to use it

### Sign Up - /sign-up
The sign up form will be used to collect user information.  Upon submit, fields will be validated and the email will be checked against the database to make sure it is unique.  If all fields are valid the user will be taken to the dresses page and have the option to add a dress, if not they will be taken back to the form and errors will be highlighted in red.

The form will have the following:
* first name
* last name
* email
* password
* confirm password
* submit
* link to log in if the user already has an account

### Log In - /log-in
The log in form will be used for users who have already created an account. They enter the email and password and click submit then the fields are verified against the database.  If log in is successful, the user is taken to their dresses, if not they are taken back to the form and the errors will be highlighted in red.

The form will have the following:
* email
* password
* submit

### User account - /account
User may view their account info by clicking the My Account button at the top of the page.  The account page will display user information and allow the user to:
* Update contact info
* Change password

### Update user account - /account/edit
When user wants to update contact info or change password they will click edit on the user account page then be taken to the edit page.  The user can update their name, email and password.

### Dresses - /dresses
The dresses page will display all dresses the user has uploaded in a grid.  One photo for each dress and the rating will be shown.  The page will default to showing the front view of each dress and will be sorted by rank high to low.  The user will be able to select which view of the dresses they would like displayed - front, side or back.  They will also be able to sort and filter the dresses to change the view.  There will be a button that will allow the user to add a new dress.

The dresses page will have the following:
* Add a dress button
* Photo grid of dresses and rating
* View selection (front, back, side)
* Sort by drop down
  * Rating high to low
  * Price low to high
  * Designer a to z
* Filters side bar
  * Rating
    * love it
    * like it
    * ok
    * no
  * Price
    * Under $250
    * $251 - $500
    * $500 - $1000
    * $1001 - $1500
    * $1501 - $2000
    * Over $2000
  * Designer
    * List all designers added
  * Store
    * List all stores added
* Compare this dress checkbox (select up to 2)

## Add Dress Form - /dresses/add
The add dress form will allow the user to add a dress.  The user can upload photos of them wearing the dress.  The photos will be tagged with a photo type for display purposes.  The user will be required to add a rating to document how much they like each dress.  Upon successful submission the user will be taken to the dresses page and the new dress will be added.  If there are errors, a message will be displayed.

The form will include:
* Photo upload - at least one required
* Photo type selection (front, back, angled, custom) - required
* Rating (no, ok, like it, love it) - required
* Designer
* Style Number
* Price
* Store
* Notes
* Submit

### Dress Details - /dresses/:dress
When the user clicks on a dress, they will be taken to the dress page where they will see all information and notes about the dress.  All uploaded photos can be viewed here.

The following information will be displayed for the dress:
* Photos (main and thumbnails)
* Rating
* Designer
* Style Number
* Price
* Store
* Notes
* Edit info button
* Delete dress button

### Dress Details - /dresses/:dress/edit
When the user wants to edit details about a specific dress, a pre-filled in version of the add dress form will be shown with editable fields.  The user can update any of the fields then will be returned to the dress details page on submit.

### Compare Dresses - /dresses/compare?dress1&dress2
If the user selects 2 dresses and clicks compare, they will be taken to the comparison page where the two dresses and all of their details will be displayed side by side.

Each dress will have:
* Photos
* Rating
* Designer
* Style Number
* Price
* Store
* Notes


## Data Model
mLab is used to host the database for this app. There will be two models: user and occasion.

userSchema
```
{
  id: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''}
}
```

Sample user (note: email will always be lower case in the database):
```
const user = {
  id: '2575875c-711d-4670-a2a2-8f1f9ccc8d8b',
  email: 'john.smith@gmail.com',
  password: 'hash',
  firstName: 'john',
  lastName: 'smith'
}
```

dressSchema
```
{
  id: {type: String, required: true, unique: true},
  user: {type: String, required: true},
  img: {
    scr: {type: String, required: true},
    alt: {type: String, required: true},
    type: {type: String, required: true}
  },
  rating: {type: Number, required: true},
  designer: String,
  styleNum: String,
  price: Number,
  store: String,
  notes: String
}
```
Sample dress:
```
const dress = {
  id: '1575875c-711d-4670-a2a2-8f1f9ccc7d7b',
  img: {
    src: 'https://www.cloudinary/dress1-front-view.jpg',
    alt: 'dress 1 front',
    type: 'front'
  }
  rating: 4,
  designer: 'maggie sottero',
  styleNum: 'saige',
  price: 1700,
  store: 'boulder bridal',
  notes: 'love the neckline, lots of lace, beautiful dress'
}
```

## Features to add if there is time
Allow different photo size upload.

Allow user's friends to rate dresses so user can sort by rating including how other's rated the dresses.

Add occasions dashboard so user can have the option to compare dresses for multiple occasions - wedding, wedding attendant, prom, etc.  Old data will need to be migrated if this is implemented.  When the user logs in they will be taken to the occasions page and can choose an occasion to see all dresses.  New endpoints that would be added:
* Occasions Dashboard - /occasions
    * List of occasions
    * Add new occasion button
* Add Occasion Form - /occasions/add
    * Name
    * Type (dropdown)
    * Date
    * Details
    * Submit

occasionSchema would look like this:
```
{
  id: {type: number, required: true, unique: true},
  userId: {type: number, required: true},
  occasionName: {type: Number, required: true},
  occasionType: {type: Number, required: true},
  occasionDate: Date,
  dresses: [
    {
      id: {type: number, required: true, unique: true},
      img: {
        scr: {type: String, required: true},
        alt: {type: String, required: true},
        type: {type: String, required: true}
      }
      rating: {type: Number, required: true},
      designer: String,
      styleNum: String,
      price: Number,
      store: String,
      notes: String
    }
  }
}
```
Sample occasion:
```
const occasion = {
  id: '1575875c-711d-4670-a2a2-8f1f9ccc7d7b',
  userId: '2575875c-711d-4670-a2a2-8f1f9ccc8d8b',
  occasionName: 'my wedding',
  occasionType: 'wedding',
  occasionDate: 7/1/2018,
  dresses: [
    {
      id: '2575875c-711d-4670-a2a2-8f1f9ccc7d7c',
      img: {
        src: 'https://www.cloudinary/dress1-front-view.jpg',
        alt: 'dress 1 front',
        type: 'front'
      },
      rating: 4,
      designer: 'maggie sottero',
      styleNum: 'saige',
      price: 1700,
      store: 'boulder bridal',
      notes: 'love the neckline, lots of lace, beautiful dress'
    },
    {
      id: '3575875c-711d-4670-a2a2-8f1f9ccc7d7d',
      img: {
        src: 'https://www.cloudinary/dress2-front-view.jpg',
        alt: 'dress 2 front',
        type: 'front'
      },
      rating: 2,
      designer: 'sottero and midgley',
      styleNum: 'elliott',
      price: 1900,
      store: 'boulder bridal',
      notes: 'the front is too plain, needs more lace and sparkles'
    }
  ]
}
```
