/**
 * Seeds the 4 service packages into Sanity (creates or updates by slug).
 * Usage:  SANITY_WRITE_TOKEN=sk... node scripts/seed-services.mjs
 * Optional: DELETE_SLUGS="old-slug-1,old-slug-2" to remove old services.
 */
const projectId = "i8n8hd39";
const dataset = "production";
const token = process.env.SANITY_WRITE_TOKEN;
if (!token) { console.error("Set SANITY_WRITE_TOKEN"); process.exit(1); }

const packages = [
  { slug: "landing-page", order: 1, popular: false, title: "Landing Page", startingPrice: "₹7,999", deliveryTime: "3–5 days",
    shortDescription: "One high-converting page for your business, campaign or product. Perfect for ads, Google listing and WhatsApp enquiries.",
    features: ["1 page, custom design (no template)", "Mobile-friendly & fast loading", "WhatsApp / call / enquiry form", "Google Maps & social links", "Basic SEO setup", "1 round of revisions"],
    whatsappText: "Hi Rohit, I need a Landing Page (₹7,999 package). My business is: ______" },
  { slug: "business-website", order: 2, popular: true, title: "Business Website", startingPrice: "₹14,999", deliveryTime: "7–10 days",
    shortDescription: "A complete 5–7 page website for shops, clinics, agencies, restaurants and service businesses. Built in WordPress so you can edit it yourself.",
    features: ["5–7 pages (Home, About, Services, Gallery, Contact)", "Custom design matching your brand", "Mobile-friendly & fast", "Contact form + WhatsApp button", "Google Maps, social media links", "SEO-ready (titles, descriptions, sitemap)", "Easy admin panel + training video", "2 rounds of revisions", "1 month free support"],
    whatsappText: "Hi Rohit, I'm interested in the Business Website package (₹14,999). My business is: ______" },
  { slug: "ecommerce-store", order: 3, popular: false, title: "E-commerce Store", startingPrice: "₹24,999", deliveryTime: "10–15 days",
    shortDescription: "Sell online with a Shopify or WooCommerce store. Products, payments, shipping and order management, all set up and ready.",
    features: ["Up to 50 products uploaded", "Payment gateway (Razorpay / UPI / cards)", "Shipping & tax setup", "Cart, checkout, order emails", "Mobile-friendly design", "Admin training", "1 month free support"],
    whatsappText: "Hi Rohit, I want an E-commerce Store (₹24,999 package). I sell: ______" },
  { slug: "custom-web-app", order: 4, popular: false, title: "Custom Web App (React / Next.js)", startingPrice: "₹39,999", deliveryTime: "3–4 weeks",
    shortDescription: "Custom-built websites and web apps with dashboards, logins, search or API integrations. For startups and media companies that need more than a template.",
    features: ["Built in React / Next.js", "Custom features & integrations", "Admin dashboard / CMS", "Fast, SEO-friendly, scalable", "Deployment on Vercel / your server", "1 month free support"],
    whatsappText: "Hi Rohit, I need a custom web app. Here's my idea: ______" },
];

const api = `https://${projectId}.api.sanity.io/v2024-01-01`;
const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

const query = async (q) => {
  const r = await fetch(`${api}/data/query/${dataset}?query=${encodeURIComponent(q)}`, { headers });
  const j = await r.json(); if (j.error) throw new Error(JSON.stringify(j.error)); return j.result;
};

const existing = await query('*[_type=="service"]{_id, "slug": slug.current, title}');
console.log("Existing services:", existing.map((s) => `${s.title} (${s.slug || "no slug"})`).join(", ") || "none");

const mutations = [];
for (const p of packages) {
  const found = existing.find((s) => s.slug === p.slug);
  const doc = { _type: "service", ...p, slug: { _type: "slug", current: p.slug } };
  if (found) mutations.push({ patch: { id: found._id, set: doc } });
  else mutations.push({ create: { _id: `service-${p.slug}`, ...doc } });
}
for (const slug of (process.env.DELETE_SLUGS || "").split(",").map((s) => s.trim()).filter(Boolean)) {
  const found = existing.find((s) => s.slug === slug);
  if (found) { mutations.push({ delete: { id: found._id } }); mutations.push({ delete: { id: `drafts.${found._id}` } }); }
}

const r = await fetch(`${api}/data/mutate/${dataset}?returnIds=true`, { method: "POST", headers, body: JSON.stringify({ mutations }) });
const j = await r.json();
if (j.error) { console.error("Failed:", j.error); process.exit(1); }
console.log("Done. Results:", j.results.map((x) => `${x.operation} ${x.id}`).join("\n"));
