const {Router} = require('express');
const userRouter = require('./User');
const accountRouter = require('./account');

Router.use('/user',userRouter)
Router.use('./account',accountRouter)

module.exports = router;


