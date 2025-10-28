// Bun server for NASA Solar System Visualization
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Serve static files
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(Bun.file("public/index.html"));
    }
    
    if (url.pathname.startsWith("/js/")) {
      const file = Bun.file(`public${url.pathname}`);
      return new Response(file, {
        headers: { "Content-Type": "application/javascript" }
      });
    }
    
    if (url.pathname.startsWith("/css/")) {
      const file = Bun.file(`public${url.pathname}`);
      return new Response(file, {
        headers: { "Content-Type": "text/css" }
      });
    }
    
    if (url.pathname.startsWith("/textures/")) {
      const file = Bun.file(`public${url.pathname}`);
      const ext = url.pathname.split('.').pop();
      const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
      return new Response(file, {
        headers: { "Content-Type": contentType }
      });
    }
    
    // Proxy for NASA RSS feeds (CORS-free)
    if (url.pathname === "/api/space-news") {
      try {
        const response = await fetch("https://www.nasa.gov/rss/dyn/breaking_news.rss");
        const text = await response.text();
        return new Response(text, {
          headers: { 
            "Content-Type": "application/xml",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch news" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    
    return new Response("Not Found", { status: 404 });
  }
});

console.log(`NASA Solar System running at http://localhost:${server.port}`);
