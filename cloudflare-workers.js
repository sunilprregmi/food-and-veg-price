addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = 'https://kalimatimarket.gov.np/price';
  const response = await fetch(url);

  if (!response.ok) {
    return new Response('Data not found! / डाटा फेला परेन!');
  }

  const htmlContent = await response.text();
  const regexTable = /<table[^>]*id="commodityPriceParticular"[^>]*>([\s\S]*?)<\/table>/;
  const tableMatch = regexTable.exec(htmlContent);

  if (!tableMatch || !tableMatch[1]) {
    return new Response('Table not found! / तालिका फेला परेन!');
  }

  const tableContent = tableMatch[1];
  const rows = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g);
  const headers = rows.shift().match(/<th[^>]*>([\s\S]*?)<\/th>/g).map(header => header.replace(/<[^>]*>?/gm, '').trim());

  // Translation mapping for headers
  const headerTranslations = {
    'कृषि उपज': 'Commodity',
    'ईकाइ': 'Unit', 
    'न्यूनतम': 'Minimum',
    'अधिकतम': 'Maximum',
    'औसत': 'Average'
  };

  // Translation mapping for units
  const unitTranslations = {
    'के.जी.': 'KG',
    'के जी': 'KG',
    'केजी': 'KG',
    'प्रति दर्जन': 'Per Dozen',
    'गोटा': 'Piece',
    'प्रति गोटा': 'Per Piece'
  };

  // Mapping for Devanagari to English numbers
  const devanagariToEnglish = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };

// Commodity translations
const commodityTranslations = {
    'छ्यापी हरियो': 'Green Chyapi',
    'ताजा माछा(रहु)': 'Fresh Fish (Rahu)', 
    'गोलभेडा ठूलो(नेपाली)': 'Tomato Large (Nepali)',
    'गोलभेडा ठूलो(भारतीय)': 'Tomato Large (Indian)',
    'गोलभेडा सानो(लोकल)': 'Tomato Small (Local)',
    'गोलभेडा सानो(तराई)': 'Tomato Small (Terai)',
    'आलु रातो': 'Red Potato',
    'आलु रातो(मुडे)': 'Red Potato (Mude)',
    'प्याज सुकेको (भारतीय)': 'Dried Onion (Indian)',
    'गाजर(लोकल)': 'Carrot (Local)',
    'गाजर(तराई)': 'Carrot (Terai)',
    'बन्दा(लोकल)': 'Cabbage (Local)',
    'बन्दा(तराई)': 'Cabbage (Terai)',
    'बन्दा(नरिवल)': 'Cabbage (Coconut)',
    'काउली स्थानिय': 'Local Cauliflower',
    'स्थानीय काउली(ज्यापु)': 'Local Cauliflower (Jyapu)',
    'मूला रातो': 'Red Radish',
    'मूला सेतो(लोकल)': 'White Radish (Local)',
    'सेतो मूला(हाइब्रीड)': 'White Radish (Hybrid)',
    'भन्टा लाम्चो': 'Long Eggplant',
    'भन्टा डल्लो': 'Round Eggplant',
    'बोडी(तने)': 'Climbing Bean',
    'मटरकोशा': 'Green Peas',
    'घिउ सिमी(लोकल)': 'Local French Bean',
    'घिउ सिमी(हाइब्रीड)': 'Hybrid French Bean',
    'घिउ सिमी(राजमा)': 'Rajma French Bean',
    'टाटे सिमी': 'Flat Bean',
    'तितो करेला': 'Bitter Gourd',
    'लौका': 'Bottle Gourd',
    'परवर(लोकल)': 'Local Pointed Gourd',
    'परवर(तराई)': 'Terai Pointed Gourd',
    'घिरौला': 'Snake Gourd',
    'झिगूनी': 'Ridge Gourd',
    'फर्सी पाकेको': 'Ripe Pumpkin',
    'फर्सी हरियो(लाम्चो)': 'Long Green Pumpkin',
    'हरियो फर्सी(डल्लो)': 'Round Green Pumpkin',
    'सलगम': 'Turnip',
    'भिण्डी': 'Okra',
    'सखरखण्ड': 'Sweet Potato',
    'बरेला': 'Sponge Gourd',
    'पिंडालू': 'Taro',
    'स्कूस': 'Chayote',
    'रायो साग': 'Mustard Green',
    'पालूगो साग': 'Spinach',
    'चमसूरको साग': 'Garden Cress',
    'तोरीको साग': 'Mustard Leaf',
    'मेथीको साग': 'Fenugreek Leaf',
    'प्याज हरियो': 'Green Onion',
    'बकूला': 'Broad Leaf Mustard',
    'तरुल': 'Yam',
    'च्याउ(कन्य)': 'Button Mushroom',
    'च्याउ(डल्ले)': 'Round Mushroom',
    'कुरीलो': 'Asparagus',
    'न्यूरो': 'Fiddlehead Fern',
    'ब्रोकाउली': 'Broccoli',
    'चुकुन्दर': 'Beetroot',
    'सजिवन': 'Drumstick',
    'कोइरालो': 'Bauhinia Flower',
    'रातो बन्दा': 'Red Cabbage',
    'जिरीको साग': 'Water Spinach',
    'ग्याठ कोबी': 'Kohlrabi',
    'सेलरी': 'Celery',
    'पार्सले': 'Parsley',
    'सौफको साग': 'Fennel Leaf',
    'पुदीना': 'Mint',
    'गान्टे मूला': 'Knol-khol',
    'इमली': 'Tamarind',
    'तामा': 'Bamboo Shoot',
    'तोफु': 'Tofu',
    'गुन्दुक': 'Fermented Leafy Green'
  };

  const data = rows.map((row, index) => {
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    const nepaliData = headers.reduce((rowData, header, index) => {
      rowData[header] = cells[index].replace(/<[^>]*>?/gm, '').trim();
      return rowData;
    }, {});

    // Convert Devanagari numbers to English
    const convertToEnglishNumbers = (str) => {
      return str.replace(/[०-९]/g, match => devanagariToEnglish[match]);
    };

    // Create formatted commodity data
    const categoryId = Math.floor(index / 2) + 1;
    const subId = (index % 2) + 1;
    const id = `${categoryId.toString().padStart(3, '0')}-${subId.toString().padStart(3, '0')}`;

    return {
      commodity: {
        id: id,
        nepali: nepaliData['कृषि उपज'],
        english: commodityTranslations[nepaliData['कृषि उपज']] || nepaliData['कृषि उपज'],
        prices: {
          unit: {
            nepali: nepaliData['ईकाइ'],
            english: unitTranslations[nepaliData['ईकाइ']] || nepaliData['ईकाइ']
          },
          minimum: {
            nepali: nepaliData['न्यूनतम'],
            english: convertToEnglishNumbers(nepaliData['न्यूनतम']).replace('रू', 'NPR')
          },
          maximum: {
            nepali: nepaliData['अधिकतम'],
            english: convertToEnglishNumbers(nepaliData['अधिकतम']).replace('रू', 'NPR')
          },
          average: {
            nepali: nepaliData['औसत'],
            english: convertToEnglishNumbers(nepaliData['औसत']).replace('रू', 'NPR')
          }
        }
      }
    };
  });

  // Extract dates
  const dateBS = htmlContent.match(/वि\.सं\.\s*([^<]*)/)?.[1]?.trim() || '';
  const currentDateAD = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Return formatted response
  return new Response(
    JSON.stringify({
      date_bs: dateBS,
      date_ad: currentDateAD,
      copyright: "https://kalimatimarket.gov.np",
      scrapped_by: "Sunil Prasad Regmi",
      data: data
    }, null, 2),
    {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Authorization',
      }
    }
  );
}
