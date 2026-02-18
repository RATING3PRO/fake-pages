export default {
  async fetch(request) {
    return fakeS3NoSuchKey(request);
  }
};

function randomHex(len) {
  const chars = "abcdef0123456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function randomBase64(len) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function fakeS3NoSuchKey(request) {

  const url = new URL(request.url);
  const key = url.pathname.slice(1) || "";

  const requestId = randomHex(16).toUpperCase();
  const hostId = randomBase64(64);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<Error>
  <Code>NoSuchKey</Code>
  <Message>The specified key does not exist.</Message>
  <Key>${key}</Key>
  <RequestId>${requestId}</RequestId>
  <HostId>${hostId}</HostId>
</Error>`;

  const encoder = new TextEncoder();
  const contentLength = encoder.encode(body).length;

  const headers = new Headers();

  headers.set("Date", new Date().toUTCString());
  headers.set("Content-Type", "application/xml");
  headers.set("Content-Length", contentLength.toString());
  headers.set("Server", "AmazonS3");
  headers.set("x-amz-request-id", requestId);
  headers.set("x-amz-id-2", hostId);
  headers.set("x-amz-bucket-region", "us-east-1");
  headers.set("Accept-Ranges", "bytes");

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
