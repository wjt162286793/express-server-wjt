var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('11111');
});

router.post('/login',function(req, res, next) {
    console.log(req,'req的值')
  res.send({

        code:200,
        msg:'登录成功',
        data:{
         token:'123456' 
        }  
     
  });
})

module.exports = router;

