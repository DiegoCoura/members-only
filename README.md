# [Members-Only](https://members-only-production-9476.up.railway.app/)
### A secret club for wizards 

Members-Only is a message board where only true friends can send messages, delete their own messages and discover who the authors are.

<img style="align-self: center" alt="user home page" src="./public/images/screen1.png">

## 🛠️ Tools

- `NodeJs`
- `Express`
- `Postgresql`
- `Passport`
- `Ejs`

## About the Project

This is a Node/Express server-side rendering project, and the goal of Members-Only is to allow only authorized people to interact. For this purpose, the project includes an authentication system made with PassportJS. Form validation was implemented using express-validator, and all the data is stored in a PostgreSQL database hosted on Railway. For the interfaces, I used the EJS template engine and CSS.

With Passport and express-session, I was able to manage client sessions, and used bcrypt for password utilities.

Dealing with timezone differences was quite challenging. To avoid polluting the UI with a dropdown menu where the user would choose the timezone, I had to use geoip-lite and request-ip to track the clients' timezones.

### <img style="width: 20px" src="./public/images/linkedin.png" /> [Linkedin](https://www.linkedin.com/in/diego-coura-18b88317b/)

<img style="align-self: center" alt="user home page" src="./public/images/notlogged.png">

<img style="align-self: center" alt="user home page" src="./public/images/signup.png">