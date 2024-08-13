var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  req.sessionStore.get(req.session.id, (err, sessionData) => {
    if(err){
      console.log(err)
      throw err
    }
    console.log(sessionData)
  })
  req.session.visited = true
  res.render('index', { title: 'Express' });
});

router.get('/sign-up', (req, res, next)=>{
  res.render("signupForm")
})

router.get('/login', (req, res, next)=>{
  res.render("loginForm")
})


module.exports = router;
