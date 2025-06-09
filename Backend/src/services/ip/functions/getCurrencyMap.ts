import path from "node:path";
import fs from "node:fs";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const currencyPath = path.resolve(__dirname, '../../../../mainFiles/json/FinalCountryCurrencyMap.json');
const currencyMap = JSON.parse(fs.readFileSync(currencyPath, 'utf-8'));

// "AD": {
//     "code": "EUR",
//         "symbol": "€",
//         "name": "Euro",
//         "name_plural": "euros"
// },

type Currency = {
    [countryCode: string]: {
        code: string,
        symbol: string,
        name: string,
        name_plural: string,
    },
}

/**
 * returns Currency object
 */

export function getCurrencyMap():Currency {
    return currencyMap;
}