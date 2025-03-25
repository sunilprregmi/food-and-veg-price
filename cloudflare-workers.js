import cheerio from "cheerio";

// Sunil, Here are some changes that make your code more efficient and scalable in production
// - Uses Cloudflare's free caching service (Edge Cache API)
// - Caches frequent fetched data for 10 minutes at Cloudflare Edge
// - Added search functionality
// - Added filter range functionality

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const { searchParams } = new URL(request.url);
  const filterCommodity =
    searchParams.get("commodity")?.trim().toLowerCase() || "";
  const minPrice = parseFloat(searchParams.get("minPrice")) || 0;
  const maxPrice = parseFloat(searchParams.get("maxPrice")) || Infinity;

  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  let response = await cache.match(cacheKey);

  // If cached response exists, return it
  if (response) {
    return response;
  }

  // Fetch live data from Kalimati Market website
  const url = "https://kalimatimarket.gov.np/price";
  const fetchResponse = await fetch(url);
  if (!fetchResponse.ok) {
    return new Response("डाटा फेला परेन! ", { status: 404 });
  }

  const htmlContent = await fetchResponse.text();
  const extractedData = extractData(htmlContent);
  const filteredData = filterData(
    extractedData,
    filterCommodity,
    minPrice,
    maxPrice
  );
  response = sendResponse(filteredData);

  // Cache the response for 10 minutes
  response.headers.append("Cache-Control", "public, max-age=600");
  event.waitUntil(cache.put(cacheKey, response.clone()));

  return response;
}

// Extract table data using Cheerio
function extractData(htmlContent) {
  const $ = cheerio.load(htmlContent);
  const table = $("#commodityPriceParticular");

  if (!table.length) return { message: "तालिका फेला परेन!" };

  let headers = [];
  let data = [];

  table.find("tr").each((i, row) => {
    const cells = $(row)
      .find(i === 0 ? "th" : "td")
      .map((_, cell) => $(cell).text().trim())
      .get();
    if (i === 0) {
      headers = cells;
    } else {
      let rowData = {};
      headers.forEach((header, idx) => (rowData[header] = cells[idx]));
      data.push(rowData);
    }
  });

  // Extract the Nepali date from the page
  const dateBS =
    $('div:contains("वि.सं.")')
      .text()
      .match(/वि\.सं\.\s*([^<]*)/)?.[1]
      ?.trim() || "";
  // Get the current English date
  const currentDateAD = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    date_bs: dateBS,
    date_ad: currentDateAD,
    copyright: "https://kalimatimarket.gov.np",
    scrapped_by: "Sunil Prasad Regmi",
    data,
  };
}

//  FIX: Search + Price Range Filtering
function filterData(data, filterCommodity, minPrice, maxPrice) {
  return {
    ...data,
    data: data.data.filter((item) => {
      const matchesCommodity =
        !filterCommodity ||
        item["कृषि उपज"]?.toLowerCase().includes(filterCommodity);
      const avgPrice = parseFloat(item["औसत"]?.replace(/[^\d.]/g, "") || 0);
      const matchesPrice = avgPrice >= minPrice && avgPrice <= maxPrice;
      return matchesCommodity && matchesPrice;
    }),
  };
}

// Format and return JSON response
function sendResponse(data) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Authorization",
    },
  });
}
