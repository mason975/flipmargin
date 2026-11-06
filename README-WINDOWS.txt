FLIPMARGIN V3 — SEO FOUNDATION
===============================

V3 preserves the V2 calculator and adds a first SEO foundation.

NEW FILES
---------
- ebay-fee-calculator.html: focused US eBay fee guide and calculator landing page
- etsy-fee-calculator.html: focused US Etsy fee guide and calculator landing page
- robots.txt: permits normal crawling and points crawlers to the sitemap
- sitemap.xml: lists the homepage and two platform guide pages

UPDATED
-------
- index.html: descriptive title and meta description, canonical URL, social preview
  metadata, WebApplication structured data, and internal links to platform guides.
- styles.css: styles for the new guide pages and homepage platform links.
- script.js: unchanged from V2.

INSTALL LOCALLY
---------------
Replace the existing V2 files with all files from this V3 folder. Keep these files
together at the site root:
index.html
styles.css
script.js
ebay-fee-calculator.html
etsy-fee-calculator.html
robots.txt
sitemap.xml

The README can stay in the project folder but does not need to be deployed.

PUBLISH TO CLOUDFLARE WORKERS / STATIC ASSETS
---------------------------------------------
Upload/commit the seven site files above to the same root directory used by the
current live deployment. Do not put them inside an extra nested folder unless that
is how the current deployment is configured. If connected to GitHub, commit and
push the changes; otherwise upload using the same Cloudflare workflow used for V2.
This package does not publish or deploy anything.

AFTER DEPLOYMENT
----------------
1. Visit /, /ebay-fee-calculator.html, and /etsy-fee-calculator.html.
2. Visit /robots.txt and /sitemap.xml to confirm they load.
3. Set up or open Google Search Console and verify the site.
4. Submit https://flipmargin.mason-5d3.workers.dev/sitemap.xml.
5. Use URL Inspection to request indexing for the homepage and both guides.

IMPORTANT CAVEATS
-----------------
- The current calculator code and fee formulas are unchanged from V2.
- Marketplace guide copy describes simplified US scenarios and includes official
  fee-documentation links. Rates and exceptions can change; review official sources.
- The calculator continues to exclude sales tax from its fee bases. This is disclosed
  on the platform-specific guides; V3 does not add tax-aware calculations.
- Search engines decide whether and when to crawl, index, and rank pages. A sitemap
  is a discovery hint, not a guarantee of indexing or traffic.
- The workers.dev URL is usable for an initial site, but a custom domain is preferable
  for long-term branding and search presence.
