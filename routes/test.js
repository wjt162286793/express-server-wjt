const express = require('express')
const router = express.Router()
const app = express()

//reqUrl : http://localhost:3030/test/userName/wjt/id/1207
//res: { userName: 'wjt', id: '1207' }
router.get('/userName/:userName/id/:id',(req,res,next)=>{
    console.log(req.params,'请求数据测试1')

    res.send(req.params)
})

//reqUrl: http://localhost:3030/test/userName/wjt-1207
//res: { name: 'wjt', id: '1207' }
router.get('/userName/:name-:id',(req,res,next)=>{
    console.log(req.params,'请求数据测试2')
    res.send(req.params)
})

//reqUrl: http://localhost:3030/test/userName/functions
//res.send函数第一次调用的结果就是返回值,next()只要调用,就会进行下一个函数的调用,如果不调用next,就会中断掉后续的函数
router.get('/userName/functions',[fun1,fun2,fun3])

function fun1 (req,res,next){
  console.log('回调1')
//   res.send('回调1')
  next()
}
function fun2 (req,res,next){
    console.log('回调2')
    res.send('回调2')
    // next()
}
function fun3 (req,res,next){
    console.log('回调3')
    res.send('回调3')
}

const centerFun = (req,res,next)=>{
 console.log('进入中间件')
 next()
}
app.use(centerFun)
router.get('/userName/centerFun',function(req,res,next){
    res.send('中间件测试')
})

module.exports = router