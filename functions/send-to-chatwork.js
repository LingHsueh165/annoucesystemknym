const axios = require('axios');

exports.handler = async function(event, context) {
  // POSTリクエストのみ処理
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    // リクエストボディの解析
    const { apiKey, roomId, message } = JSON.parse(event.body);

    // パラメータのエンコード
    const encodedParams = new URLSearchParams();
    encodedParams.set('body', message);
    encodedParams.set('self_unread', '0');

    // ChatWork APIへリクエスト送信
    const response = await axios({
      method: 'POST',
      url: `https://api.chatwork.com/v2/rooms/${roomId}/messages`,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        'x-chatworktoken': apiKey
      },
      data: encodedParams
    });

    // 成功レスポンス
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        data: response.data 
      })
    };
  } catch (error) {
    console.error('Error:', error);
    
    // エラーレスポンスの準備
    let errorBody = {
      error: error.message
    };
    
    // レスポンスデータがあれば含める
    if (error.response) {
      errorBody.status = error.response.status;
      errorBody.details = error.response.data || 'No details available';
    }

    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify(errorBody)
    };
  }
};
