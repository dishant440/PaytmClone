const {Router} = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../database/db');
const router = Router();



router.get('/balance',authMiddleware, async (req, res) => {
    const userid = req.userId; 
    const account = await Account.findOne({
        userid
    }) 
    res.json({
        balance:account.balance
    })
});  




module.exports = router;