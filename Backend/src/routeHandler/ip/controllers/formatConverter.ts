import js2xmlparser from "js2xmlparser";
import {Parser} from "json2csv";
import {Response} from "express";
import {IpGeoResponse} from "../../../services/ip/ipData";
import {logError} from "../../../services/servicesExport.js";

type formatConverterType = {
    format: string;
    data: any;
    res: Response;
}

export default function formatConverter({format, data, res}:formatConverterType) {
    if (format === 'xml') {
        res.set('Content-Type', 'application/xml')
        return js2xmlparser.parse("response", data)

    } else if (format === 'csv') {
        try {
            const parser = new Parser();
            const flatData = flattenObject(data as IpGeoResponse);
            const csv = parser.parse(flatData);
            res.set('Content-Type', 'text/csv');
            return csv
        } catch (err) {
            logError(err)
            throw new Error ('CSV Parsing Error')
        }
    } else {
        return data;
    }
}

function flattenObject(obj: Record<string, any>, parentKey = '', result: Record<string, any> = {}): Record<string, any> {
    for (let key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            flattenObject(obj[key], newKey, result);
        } else {
            result[newKey] = obj[key];
        }
    }
    return result;
}