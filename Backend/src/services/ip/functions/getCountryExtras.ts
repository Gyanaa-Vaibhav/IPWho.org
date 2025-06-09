import path from "node:path";
import fs from "node:fs";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const countryExtraMapPath = path.resolve(__dirname, '../../../../mainFiles/json/CountryExtras2.json');
const countryExtraMap = JSON.parse(fs.readFileSync(countryExtraMapPath, 'utf-8'));

// "AD": {
//     "flag": "🇦🇩",
//         "dial_code": "+376",
//         "unicode": "U+1F1E6 U+1F1E9",
//         "is_in_eu": false,
//         "capital": "Andorra la Vella"
// },

type CountryExtra = {
    [countryCode: string]: {
        flag: string;
        unicode: string;
        dial_code: string;
        is_in_eu: boolean;
        capital: string;
    };
}

export function getCountryExtras():CountryExtra {
    return countryExtraMap;
}