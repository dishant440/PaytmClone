const {Router} = require('express');
const userRouter = require('./User');

Router.use('/user',userRouter)

module.exports = router;


