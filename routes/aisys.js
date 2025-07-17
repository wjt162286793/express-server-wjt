const express = require('express');
const router = express.Router();
const OpenAI = require("openai");

router.use(express.json()); // 解析 application/json
router.use(express.urlencoded({ extended: true }));

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-59bcbdeb9be440ddb820d42c8aa063ef' // 请确保使用你的有效API Key
});

// 流式处理函数
async function streamCompletion(res, messages) {
  try {
    const stream = await openai.chat.completions.create({
      messages: [{ role: "system", content: messages }],
      model: "deepseek-chat",
      stream: true
    });

    // 设置SSE和CORS头
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    });

    // 发送初始消息确认连接
    res.write('event: connected\ndata: {"status": "Stream started"}\n\n');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        // 按照SSE格式发送数据
        res.write(`data: ${JSON.stringify({content})}\n\n`);
        console.log('Sent chunk:', content);
      }
    }

    // 发送结束标记
    res.write('event: end\ndata: {"status": "Stream completed"}\n\n');
  } catch (error) {
    console.error('Stream error:', error);
    if (!res.headersSent) {
      res.write('event: error\ndata: {"error": "Stream generation failed"}\n\n');
    }
  } finally {
    res.end();
  }
}

// 处理OPTIONS预检请求
router.options('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).end();
});

router.post('/', (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  const message = req.body.message
  console.log('进到这里了没',message)
  streamCompletion(res, message);
});

module.exports = router;