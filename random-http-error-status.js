export default {
  async fetch(request) {
    return randomErrorResponse(request);
  }
};

function pickWeighted(arr) {
  const total = arr.reduce((sum, i) => sum + i.weight, 0);
  let r = Math.random() * total;
  for (const item of arr) {
    if ((r -= item.weight) < 0) return item;
  }
  return arr[0];
}

function randomErrorResponse(request) {

  const pool = [
    { code: 400, text: "Bad Request", type: "plain", weight: 10 },
    { code: 403, text: "Forbidden", type: "html", weight: 10 },
    { code: 404, text: "Not Found", type: "nginx", weight: 20 },
    { code: 408, text: "Request Timeout", type: "plain", weight: 5 },
    { code: 421, text: "Misdirected Request", type: "plain", weight: 3 },
    { code: 429, text: "Too Many Requests", type: "json", weight: 5 },
    { code: 500, text: "Internal Server Error", type: "html", weight: 10 },
    { code: 502, text: "Bad Gateway", type: "nginx", weight: 10 },
    { code: 503, text: "Service Unavailable", type: "nginx", weight: 10 },
    { code: 504, text: "Gateway Timeout", type: "nginx", weight: 7 }
  ];

  const chosen = pickWeighted(pool);
  const now = new Date().toUTCString();

  let body = "";
  let contentType = "text/plain";

  switch (chosen.type) {

    case "nginx":
      contentType = "text/html";
      body = `<html>
<head><title>${chosen.code} ${chosen.text}</title></head>
<body>
<center><h1>${chosen.code} ${chosen.text}</h1></center>
<hr><center>nginx</center>
</body>
</html>`;
      break;

    case "html":
      contentType = "text/html";
      body = `<html>
<head><title>${chosen.code} ${chosen.text}</title></head>
<body>
<h1>${chosen.text}</h1>
<p>Error ${chosen.code}</p>
</body>
</html>`;
      break;

    case "json":
      contentType = "application/json";
      body = JSON.stringify({
        error: chosen.text,
        status: chosen.code
      });
      break;

    default:
      body = `${chosen.code} ${chosen.text}`;
  }

  const encoder = new TextEncoder();
  const contentLength = encoder.encode(body).length;

  const headers = new Headers();

  headers.set("Date", now);
  headers.set("Content-Type", contentType);
  headers.set("Content-Length", contentLength.toString());
  headers.set("Connection", "keep-alive");
  headers.set("Server", "nginx");
  headers.set("Cache-Control", "no-store");

  if (request.method === "HEAD") {
    return new Response(null, {
      status: chosen.code,
      statusText: chosen.text,
      headers
    });
  }

  return new Response(body, {
    status: chosen.code,
    statusText: chosen.text,
    headers
  });
}
