export default {
  async fetch(request) {
    return simulateTimeout(request);
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function simulateTimeout(request) {

  const delay = 2000 + Math.random() * 4000;
  await sleep(delay);

  const errors = [
    { code: 504, text: "Gateway Timeout" },
    { code: 502, text: "Bad Gateway" },
    { code: 524, text: "A Timeout Occurred" } // Cloudflare风格
  ];

  const err = errors[Math.floor(Math.random() * errors.length)];

  const body = `<html>
<head><title>${err.code} ${err.text}</title></head>
<body>
<center><h1>${err.code} ${err.text}</h1></center>
<hr><center>nginx</center>
</body>
</html>`;

  const encoder = new TextEncoder();
  const headers = new Headers();

  headers.set("Content-Type", "text/html");
  headers.set("Content-Length", encoder.encode(body).length.toString());
  headers.set("Cache-Control", "no-store");
  headers.set("Server", "nginx");
  headers.set("Connection", "keep-alive");

  if (request.method === "HEAD") {
    return new Response(null, {
      status: err.code,
      statusText: err.text,
      headers
    });
  }

  return new Response(body, {
    status: err.code,
    statusText: err.text,
    headers
  });
}
