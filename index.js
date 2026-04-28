const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5000;

const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Glasses — Android</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0a0a0a;
      color: #f0f0f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      max-width: 480px;
      width: 100%;
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 13px;
      color: #888;
      margin-bottom: 32px;
    }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #3d8bff; }
    img {
      width: 240px;
      border-radius: 20px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.7);
      margin-bottom: 32px;
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }
    p {
      font-size: 15px;
      color: #888;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    .features {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 32px;
      text-align: left;
    }
    .feature {
      background: #141414;
      border: 1px solid #222;
      border-radius: 12px;
      padding: 14px 16px;
    }
    .feature-icon { font-size: 20px; margin-bottom: 6px; }
    .feature-title { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
    .feature-desc { font-size: 11px; color: #666; }
    .stack {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
    }
    .tag {
      background: #181818;
      border: 1px solid #2a2a2a;
      border-radius: 6px;
      padding: 4px 12px;
      font-size: 12px;
      color: #aaa;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="dot"></span>
      Android · Meta Ray-Ban
    </div>
    <img src="screenshot.jpg" alt="Smart Glasses App" onerror="this.style.display='none'">
    <h1>Smart Glasses</h1>
    <p>Real-time AI assistant for Meta Ray-Ban smart glasses.<br>
    Sees what you see, hears through the glasses mic, talks back.</p>
    <div class="features">
      <div class="feature">
        <div class="feature-icon">✦</div>
        <div class="feature-title">Gemini Live</div>
        <div class="feature-desc">Voice + vision AI, no STT latency</div>
      </div>
      <div class="feature">
        <div class="feature-icon">▶</div>
        <div class="feature-title">Twitch Stream</div>
        <div class="feature-desc">Direct RTMP from glasses mic</div>
      </div>
      <div class="feature">
        <div class="feature-icon">◉</div>
        <div class="feature-title">Phone Mode</div>
        <div class="feature-desc">Full pipeline without glasses</div>
      </div>
      <div class="feature">
        <div class="feature-icon">⏺</div>
        <div class="feature-title">Dictaphone</div>
        <div class="feature-desc">Voice recording via glasses mic</div>
      </div>
    </div>
    <div class="stack">
      <span class="tag">Kotlin</span>
      <span class="tag">Jetpack Compose</span>
      <span class="tag">Gemini Live API</span>
      <span class="tag">Meta DAT SDK</span>
      <span class="tag">RTMP</span>
      <span class="tag">Android 14+</span>
    </div>
  </div>
</body>
</html>`;

http.createServer((req, res) => {
  if (req.url === "/screenshot.jpg") {
    const imgPath = path.join(__dirname, "docs", "screenshot.jpg");
    if (fs.existsSync(imgPath)) {
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      fs.createReadStream(imgPath).pipe(res);
      return;
    }
  }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(page);
}).listen(PORT, "0.0.0.0", () => {
  console.log(`Project info page running on http://0.0.0.0:${PORT}`);
});
