const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>シンプルテストアプリ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background-color: #f0f8ff;
                text-align: center;
            }
            h1 {
                color: #2c3e50;
                font-size: 28px;
            }
            h2 {
                color: #34495e;
                font-size: 20px;
            }
            .status {
                color: #27ae60;
                font-size: 18px;
                font-weight: bold;
                margin: 20px 0;
            }
            button {
                background-color: #3498db;
                color: white;
                border: none;
                padding: 18px 24px;
                margin: 8px;
                border-radius: 12px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                min-width: 200px;
            }
            .btn2 { background-color: #9b59b6; }
            .btn3 { background-color: #e74c3c; }
            button:hover {
                opacity: 0.8;
            }
        </style>
    </head>
    <body>
        <h1>シンプルテストアプリ</h1>
        <h2>基本動作確認用</h2>
        <div class="status" id="status">状態: 待機中</div>
        
        <button onclick="basicTest()">基本テスト</button><br>
        <button class="btn2" onclick="simpleTest()">シンプルテスト</button><br>
        <button class="btn3" onclick="stateTest()">状態変更</button><br>
        
        <p>各ボタンをタップして動作確認</p>
        
        <script>
            function basicTest() {
                document.getElementById('status').textContent = '状態: 基本機能テスト完了';
                alert('成功 - アプリが正常に動作しています！');
            }
            
            function simpleTest() {
                document.getElementById('status').textContent = '状態: シンプルテスト完了';
                alert('テスト - ボタンが正常に動作しました！');
            }
            
            function stateTest() {
                const status = document.getElementById('status');
                if (status.textContent.includes('変更中')) {
                    status.textContent = '状態: 状態リセット';
                    alert('状態テスト - ローディング状態: OFF');
                } else {
                    status.textContent = '状態: 状態変更中';
                    alert('状態テスト - ローディング状態: ON');
                }
            }
        </script>
    </body>
    </html>
  `);
});

console.log('テストサーバーを起動中...');
app.listen(port, () => {
  console.log('サーバーが http://localhost:' + port + ' で動作中');
  console.log('ブラウザでアクセスして動作確認してください');
});