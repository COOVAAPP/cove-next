export async function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: https://coovaapp.com/sitemap.xml
`;
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}