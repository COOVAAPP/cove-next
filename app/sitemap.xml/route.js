export async function GET() {
  const urls = [
    "https://coovaapp.com/",
    "https://coovaapp.com/browse",
    "https://coovaapp.com/login",
    // add more static pages if needed
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `<url>
  <loc>${u}</loc>
  <changefreq>daily</changefreq>
  <priority>0.7</priority>
</url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, { headers: { "content-type": "application/xml" } });
}