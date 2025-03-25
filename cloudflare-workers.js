addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    const url = 'https://kalimatimarket.gov.np/price';
    const response = await fetch(url);
  
    if (!response.ok) {
      return new Response('डाटा फेला परेन!');
    }
  
    const htmlContent = await response.text();
    const regexTable = /<table[^>]*id="commodityPriceParticular"[^>]*>([\s\S]*?)<\/table>/;
    const tableMatch = regexTable.exec(htmlContent);
  
    if (!tableMatch || !tableMatch[1]) {
      return new Response('तालिका फेला परेन!');
    }
  
    const tableContent = tableMatch[1];
    const rows = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g);
    const headers = rows.shift().match(/<th[^>]*>([\s\S]*?)<\/th>/g).map(header => header.replace(/<[^>]*>?/gm, '').trim());
  
    const data = rows.map(row => {
      const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
      return headers.reduce((rowData, header, index) => {
        rowData[header] = cells[index].replace(/<[^>]*>?/gm, '').trim();
        return rowData;
      }, {});
    });
  
    const regexDateBS = /वि\.सं\.\s*([^<]*)/;
    const dateBSMatch = regexDateBS.exec(htmlContent);
    const dateBS = dateBSMatch ? dateBSMatch[1].trim() : '';
  
    const currentDateAD = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
    const finalData = JSON.stringify({
      date_bs: dateBS,
      date_ad: currentDateAD,
      copyright: "https://kalimatimarket.gov.np",
      scrapped_by: "Sunil Prasad Regmi",
      data
    }, null, 2);
  
    return new Response(finalData, {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Authorization',
      },
    });
  }  
