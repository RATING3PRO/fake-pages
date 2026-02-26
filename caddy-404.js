export default {
  async fetch(request) {
    return new Response(null, {
      status: 404,
      statusText: "Not Found",
      headers: {
        "Server": "Caddy",
        "Date": new Date().toUTCString(),
        "Content-Length": "0"
      }
    });
  }
};
