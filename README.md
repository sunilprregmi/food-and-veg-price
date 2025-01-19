# food-and-veg-price
A Cloudflare Workers script to fetch daily vegetable prices from the Kalimati Market website and provide them as a JSON API. This API includes pricing details, dates in BS/AD formats, and additional metadata. Perfect for developers building applications with real-time vegetable price data from Nepal.

## Usage

To use this service, simply make a GET request to the deployed Cloudflare Workers URL:

```
https://www.sunilprasad.com.np/agro-dar/
```

### Response Format

The response will be in JSON format and will contain the following fields:

- `date_bs`: The date in Bikram Sambat (BS) format (Nepali calendar).
- `date_ad`: The date in Gregorian calendar format (AD).
- `copyright`: The URL of the Kalimati Market website.
- `scrapped_by`: The name of the script that fetched the data.
- `data`: An array containing the vegetable prices. Each item in the array represents a vegetable and its corresponding price details.

Example response:

```json
{
  "date_bs": "माघ ०६, २०८१",
  "date_ad": "January 19, 2025",
  "copyright": "https://kalimatimarket.gov.np",
  "scrapped_by": "Sunil Prasad Regmi",
  "data": [
    {
      "कृषि उपज": "गोलभेडा ठूलो(भारतीय)",
      "ईकाइ": "केजी",
      "न्यूनतम": "रू ६०.००",
      "अधिकतम": "रू ७०.००",
      "औसत": "रू ६५.००"
    },
    ...
  ]
}
```

## Deployment

To deploy this script to your Cloudflare Workers account, follow these steps:

1. Clone this GitHub repository to your local machine:

```bash
git clone https://github.com/sunilprregmi/food-and-veg-price.git
```

2. Install the Cloudflare Workers CLI:

```bash
npm install -g @cloudflare/wrangler
```

3. Navigate to the project directory:

```bash
cd food-and-veg-price
```

4. Modify the `wrangler.toml` file with your Cloudflare account ID:

```toml
account_id = "<YOUR_ACCOUNT_ID>"
```

Replace `<YOUR_ACCOUNT_ID>` with your actual Cloudflare account ID.

5. Build and deploy the script using Wrangler:

```bash
wrangler publish
```

6. Your Cloudflare Workers script is now deployed! You can access it via the provided URL.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or create a merge request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

