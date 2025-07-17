const express = require('express');
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-59bcbdeb9be440ddb820d42c8aa063ef' // 请确保使用你的有效API Key
});

// 流式处理函数
async function streamCompletion(res) {
  const stream = await openai.chat.completions.create({
    messages: [{ role: "system", content: "10+10等于几" }],
    model: "deepseek-chat",
    stream: true // 关键：启用流式输出
  });

  // 设置响应头为流式传输
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    res.write(content); // 逐步发送数据到客户端
    console.log('Sent chunk:', content);
  }

  res.end(); // 结束响应
}

router.get('/', (req, res, next) => {
  streamCompletion(res).catch(err => {
    console.error('Stream error:', err);
    if (!res.headersSent) {
      res.status(500).send('Error during streaming');
    }
  });
});

module.exports = router;












