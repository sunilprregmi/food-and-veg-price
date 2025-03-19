 // Sunil,  Here are some changes that would make your code more effecient and scalable in Production
 // Cache the frequent fetched data for a while at client side
 // added search functionality
 // added filter range functionality

 // Requested to merge new branch :


 import cheerio from 'cheerio';

 const CACHE_DURATION = 10 * 60 * 1000; // Cache for 10 minutes -- adjust the caching time as you need
 const cache = new Map();
 
 addEventListener('fetch', event => {
     event.respondWith(handleRequest(event.request));
 });
 
 async function handleRequest(request) {
     const { searchParams } = new URL(request.url);
     const filterCommodity = searchParams.get('commodity')?.trim().toLowerCase() || '';
     const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
     const maxPrice = parseFloat(searchParams.get('maxPrice')) || Infinity;
 
     // Check cache first
     const cacheKey = "kalimati_prices";
     if (cache.has(cacheKey) && (Date.now() - cache.get(cacheKey).timestamp < CACHE_DURATION)) {
         const cachedData = cache.get(cacheKey).data;
         return sendResponse(filterData(cachedData, filterCommodity, minPrice, maxPrice));
     }
 
     // Fetch and scrape data
     const url = 'https://kalimatimarket.gov.np/price';
     const response = await fetch(url);
     if (!response.ok) {
         return new Response('डाटा फेला परेन! ', { status: 404 });
     }
 
     const htmlContent = await response.text();
     const extractedData = extractData(htmlContent);  
     
     // Store data in cache
     cache.set(cacheKey, { data: extractedData, timestamp: Date.now() });
 
     return sendResponse(filterData(extractedData, filterCommodity, minPrice, maxPrice));
 }
 
 // Extract table data using Cheerio
 function extractData(htmlContent) {
     const $ = cheerio.load(htmlContent);
     const table = $('#commodityPriceParticular');
     
     if (!table.length) return { message: 'तालिका फेला परेन!' }; 
 
     let headers = [];
     let data = [];
 
     table.find('tr').each((i, row) => {
         const cells = $(row).find(i === 0 ? 'th' : 'td').map((_, cell) => $(cell).text().trim()).get();
         if (i === 0) {
             headers = cells;
         } else {
             let rowData = {};
             headers.forEach((header, idx) => rowData[header] = cells[idx]);
             data.push(rowData);
         }
     });
 
     const dateBS = $('div:contains("वि.सं.")').text().match(/वि\.सं\.\s*([^<]*)/)?.[1]?.trim() || '';
     const currentDateAD = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
 
     return {
         date_bs: dateBS,
         date_ad: currentDateAD,
         copyright: "https://kalimatimarket.gov.np",
         scrapped_by: "Sunil Prasad Regmi",
         data
     };
 }
 
 // ✅ FIX: Search + Price Range Filtering
 function filterData(data, filterCommodity, minPrice, maxPrice) {
     return {
         ...data,
         data: data.data.filter(item => {
             const matchesCommodity = !filterCommodity || item["कृषि उपज"]?.toLowerCase().includes(filterCommodity);
             const avgPrice = parseFloat(item["औसत"]?.replace(/[^\d.]/g, '') || 0);
             const matchesPrice = avgPrice >= minPrice && avgPrice <= maxPrice;
             return matchesCommodity && matchesPrice;
         })
     };
 }
 
 // Format and return JSON response
 function sendResponse(data) {
     return new Response(JSON.stringify(data, null, 2), {
         headers: {
             'content-type': 'application/json',
             'Access-Control-Allow-Origin': '*',
             'Access-Control-Allow-Methods': 'GET',
             'Access-Control-Allow-Headers': 'Authorization',
         },
     });
 }
 