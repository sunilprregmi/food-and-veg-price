# food-and-veg-price

A Cloudflare Workers script that scrapes daily vegetable prices from the Kalimati Market website (https://kalimatimarket.gov.np) and serves them as a JSON API. The script extracts pricing details from the commodity price table and provides dates in both Bikram Sambat (BS) and Gregorian (AD) formats.

## Features

- Scrapes real-time vegetable prices from Kalimati Market
- Converts tabular HTML data to structured JSON
- Provides dates in both BS (Nepali) and AD formats
- CORS enabled for cross-origin requests
- Error handling in Nepali language
- Filter results by commodity name and price range

## API Usage

### Basic Request
Make a GET request to:
```
https://www.sunilprasad.com.np/agro-dar
```

### Query Parameters
You can filter the results using the following optional parameters:
- `commodity`: Filter by specific commodity name
- `minPrice`: Minimum average price
- `maxPrice`: Maximum average price

Example with filters:
```
https://www.sunilprasad.com.np/agro-dar?commodity=Tomato&minPrice=50&maxPrice=100
```

### Response Format

The API returns JSON with the following structure:

```json
{
  "date_bs": "वि.सं. माघ ०६, २०८१",
  "date_ad": "January 19, 2024",
  "copyright": "https://kalimatimarket.gov.np",
  "scrapped_by": "Sunil Prasad Regmi",
  "data": [
    {
      "commodity": {
        "id": "001-001",
        "nepali": "गोलभेडा ठूलो(भारतीय)",
        "english": "Tomato Large (Indian)",
        "prices": {
          "unit": {
            "nepali": "केजी",
            "english": "KG"
          },
          "minimum": {
            "nepali": "रू ६०.००",
            "english": "NPR 60.00"
          },
          "maximum": {
            "nepali": "रू ७०.००",
            "english": "NPR 70.00"
          },
          "average": {
            "nepali": "रू ६५.००",
            "english": "NPR 65.00"
          }
        }
      }
    }
    // ... more items
  ]
}
```

### Features

- Bilingual support (Nepali and English) for:
  - Commodity names
  - Units of measurement
  - Prices
- Unique ID for each commodity
- Structured price information
- Date in both BS and AD formats```

### Error Responses

- If the source website is unavailable: `डाटा फेला परेन!`
- If price table is not found: `तालिका फेला परेन!`

## Deployment

### 1. Clone the Repository

```bash
git clone https://github.com/sunilprregmi/food-and-veg-price.git
cd food-and-veg-price
```

### 2. Deploy to Cloudflare Workers

1. Log in to [Cloudflare Workers](https://workers.cloudflare.com/)
2. Create a new Worker
3. Copy the contents of `cloudflare-workers.js` into the Worker editor
4. Save and deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
