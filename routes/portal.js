var express = require('express');
var router = express.Router();




const roleList = [
  {
    account: 'admin',
    token: 'admin_a1b2c3d4e5f6',
    appRuleList: ['exchange', 'admin', 'bigdata','aisystem'],
  },
  {
    account: 'tenement',
    token: 'tenement_a1b2c3d4e5f6',
    appRuleList: ['exchange', 'bigdata','aisystem'],
  }
]


// 添加认证中间件
const authMiddleware = (req, res, next) => {
  // 排除/login路径
  if (req.path === '/login') {
    return next();
  }

  // 从请求头获取token
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.send({
      code: 7001,
      msg: '未提供认证token'
    })
  }

  // 验证token有效性
  const validTokens = roleList.find(item => item.token === authToken)
  if (!validTokens) {
    return res.send({
      code: 7002,
      msg: 'token已失效'
    })
  }

  // token验证通过，继续执行后续路由
  next();
};

// 应用中间件到所有路由
router.use(authMiddleware);

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('11111');
});

router.post('/login', function (req, res, next) {
  console.log(req.body, 'req的值')
  let Item = roleList.find(item => item.account === req.body.account)
  if (Item) {
    res.send({
      code: 200,
      msg: 'success',
      data: {
        account: 'admin',
        token: Item.token,
        appRuleList: Item.appRuleList,
      }
    });
  } else {
    res.send({
      code: 7003,
      msg: '账号密码错误',
    });
  }

})

router.get('/userInfo', function (req, res, next) {
  let Item = roleList.find(item => item.token === req.headers.authorization)
  res.send({
    code: 200,
    msg: 'success',
    data: {
      account: 'admin',
      token: Item.token,
      appRuleList: Item.appRuleList,
    }
  })
})

module.exports = router;

