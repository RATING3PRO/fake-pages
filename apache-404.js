export default {
  async fetch(request) {
    return fakeApache404(request);
  }
};

function fakeApache404(request) {

  const url = new URL(request.url);
  const host = url.hostname;

  const now = new Date();
  const lastModified = new Date(now.getTime() - 86400000);

  const body = `<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html>
<head>
<title>404 Not Found</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
</head>
<body>
<h1>Not Found</h1>
<p>The requested URL ${url.pathname} was not found on this server.</p>
<hr>
<address>Apache/2.4.58 (Debian) OpenSSL/3.0.11 PHP/8.2.12 Server at ${host} Port 443</address>
</body>
</html>`;

  const encoder = new TextEncoder();
  const contentLength = encoder.encode(body).length;

  const headers = new Headers();

  /* ===== 基础协议层 ===== */
  headers.set("Date", now.toUTCString());
  headers.set("Server", "Apache/2.4.58 (Debian) OpenSSL/3.0.11 PHP/8.2.12");
  headers.set("Connection", "keep-alive");
  headers.set("Keep-Alive", "timeout=5, max=100");

  /* ===== 内容相关 ===== */
  headers.set("Content-Type", "text/html; charset=iso-8859-1");
  headers.set("Content-Length", contentLength.toString());
  headers.set("Content-Language", "en");
  headers.set("Accept-Ranges", "bytes");
  headers.set("Last-Modified", lastModified.toUTCString());
  headers.set("ETag", `"${Math.random().toString(16).slice(2)}"`);

  /* ===== 缓存控制 ===== */
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "Thu, 01 Jan 1970 00:00:00 GMT");

  /* ===== 安全策略 ===== */
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "geolocation=()");
  headers.set("Content-Security-Policy", "default-src 'self'");

  /* ===== 反代痕迹 ===== */
  headers.set("Via", "1.1 apache-proxy");
  headers.set("X-Backend-Server", "web01.internal");
  headers.set("X-Forwarded-For", "203.0.113.10");
  headers.set("X-Real-IP", "203.0.113.10");
  headers.set("X-Cache", "MISS");
  headers.set("X-Cache-Hits", "0");

  /* ===== CORS ===== */
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "*");
  headers.set("Allow", "GET,POST,HEAD,OPTIONS");

  /* ===== Vary ===== */
  headers.set("Vary", "Accept-Encoding,User-Agent");

  if (request.method === "HEAD") {
    return new Response(null, {
      status: 404,
      headers
    });
  }

  return new Response(body, {
    status: 404,
    headers
  });
}
