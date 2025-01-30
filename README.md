# food-and-veg-price
A Cloudflare Workers script to fetch daily vegetable prices from the Kalimati Market website and provide them as a JSON API. This API includes pricing details, dates in BS/AD formats, and additional metadata. Perfect for developers building applications with real-time vegetable price data from Nepal.

## Usage

To use this service, simply make a GET request to the deployed Cloudflare Workers URL:

```
https://www.sunilprasad.com.np/agro-dar
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

Follow these steps to deploy the script on your Cloudflare Workers account:  

### 1. **Get the Code**  
Clone the repository or manually copy the script:  
- **Clone via Git**:  
  ```bash
  git clone https://github.com/sunilprregmi/food-and-veg-price.git
  cd food-and-veg-price
  ```
- **Manual Copy**:  
  Copy the script from the repository and save it as `workers.js` on your local machine.

### 2. **Set Up a Cloudflare Worker**  
1. **Log In to Cloudflare Workers**  
   Visit [Cloudflare Workers](https://workers.cloudflare.com/) and log in or create a free account.  

2. **Create a New Worker**  
   - Go to **Workers** > **Create a Worker**.  
   - Replace the default Worker code with the `workers.js` script.  

### 3. **Deploy Using Wrangler (Optional)**  
To use the Cloudflare Wrangler CLI:  

1. **Install Wrangler**:  
   ```bash
   npm install -g @cloudflare/wrangler
   ```  

2. **Log in to Cloudflare**:  
   ```bash
   wrangler login
   ```  

3. **Modify `wrangler.toml`**  
   Update the `account_id` field in the `wrangler.toml` file:  
   ```toml
   account_id = "<YOUR_ACCOUNT_ID>"
   ```  
   Replace `<YOUR_ACCOUNT_ID>` with your Cloudflare account ID (found in your Cloudflare dashboard).  

4. **Publish the Worker**:  
   ```bash
   wrangler publish
   ```  

### 4. **Access Your API**  
Once deployed, your API will be available at your Worker’s URL:  
```
https://<your-worker-subdomain>.workers.dev/
```  
Example:  
```
https://agro-dar.spr.workers.dev
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or create a merge request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

