export default {
  async fetch(request) {
    return fakeNginxWelcome(request);
  }
};

function fakeNginxWelcome(request) {

  const profiles = [
    {
      distro: "Ubuntu",
      server: "nginx/1.22.0 (Ubuntu)",
      version: "1.22.0"
    },
    {
      distro: "Debian",
      server: "nginx/1.24.0 (Debian)",
      version: "1.24.0"
    },
    {
      distro: "CentOS",
      server: "nginx/1.20.1",
      version: "1.20.1"
    },
    {
      distro: "Alpine",
      server: "nginx/1.24.0",
      version: "1.24.0"
    },
    {
      distro: "Arch",
      server: "nginx/1.25.3",
      version: "1.25.3"
    }
  ];

  // 随机选择一个发行版
  const profile = profiles[Math.floor(Math.random() * profiles.length)];

  const now = new Date();

  const body = `<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and working.</p>

<p>Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx ${profile.version}.</em></p>
</body>
</html>`;

  const encoder = new TextEncoder();
  const contentLength = encoder.encode(body).length;

  const headers = new Headers();

  headers.set("Date", now.toUTCString());
  headers.set("Server", profile.server);
  headers.set("Connection", "keep-alive");

  headers.set("Content-Type", "text/html");
  headers.set("Content-Length", contentLength.toString());
  headers.set("Last-Modified", now.toUTCString());
  headers.set("ETag", `"${Math.random().toString(16).slice(2)}"`);
  headers.set("Accept-Ranges", "bytes");

  headers.set("Cache-Control", "max-age=0");

  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (request.method === "HEAD") {
    return new Response(null, {
      status: 200,
      headers
    });
  }

  return new Response(body, {
    status: 200,
    headers
  });
}
