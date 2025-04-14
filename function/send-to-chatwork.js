const axios = require('axios');

exports.handler = async function(event, context) {
  // POSTリクエストのみ処理
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // リクエストボディの解析
    const { apiKey, roomId, message } = JSON.parse(event.body);

    // ChatWork APIへリクエスト送信
    const response = await axios.post(
      `https://api.chatwork.com/v2/rooms/${roomId}/messages`,
      new URLSearchParams({ body: message }),
      { 
        headers: { 
          'X-ChatWorkToken': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // 成功レスポンス
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    // エラーレスポンス
    console.log('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data || 'No details available'
      })
    };
  }
};
