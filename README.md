# Printify NodeJS

A brief description of what this project does and who it's for

## Acknowledgements

-   [Printify API Documentation](https://developers.printify.com/#overview)
-   [readme.so](https://readme.so)

## Installation

Install printify-nodejs with npm

```bash
  npm install printify-nodejs
```

## Usage/Examples

```javascript
import { PrintifyClient } from "printify-nodejs";

const client = new PrintifyClient({
    token: "PRINTIFY_API_TOKEN",
    version: "v1", // API Version
    debug: false, // Optional, whether to console log debug message from api calls.
});

const shops = await client.getShops();
```

## Authors

-   [@iWeeti](https://www.github.com/iWeeti)

## Feedback

If you have any feedback, please reach out to us at veeti.maaninka@seven-1.com
