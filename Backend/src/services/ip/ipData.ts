import * as path from 'node:path';
import * as url from "node:url";
import moment from 'moment-timezone';
import maxmind, { CityResponse, AsnResponse, Reader } from 'maxmind';
import {isBlocked, getCurrencyMap, getCountryExtras, CurrencyType, CountryExtraType} from './functions/functionExport.js'
import { Request } from 'express';
import {UAParser} from 'ua-parser-js';
import {monitoringService} from '../servicesExport.js'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cityPath = path.resolve('/app/mainFiles/GeoLite2-City/GeoLite2-City.mmdb');
const asnPath = path.resolve('/app/mainFiles/GeoLite2-ASN/GeoLite2-ASN.mmdb');
const currencyMap = getCurrencyMap();
const countryExtraMap = getCountryExtras();

type timeInfoType = {
    timezone: string;
    current_time: string;
    utc_time_zone: string;
    offset: number;
    is_dst: boolean;
    abbr: string;
}

export type IpGeoResponse = {
    ip: string;
    continent: string | null;
    continentCode: string | null;
    country: string | null;
    countryCode: string | null;
    capital: string | null;
    region: string | null;
    regionCode: string | null;
    city: string | null;
    postal_Code: string | null;
    dial_code: string | null;
    is_in_eu: boolean;
    latitude: number | null;
    longitude: number | null;
    accuracy_radius: number | null;
    timezone: {
        time_zone: string | null;
        abbr: string | null;
        offset: number | null;
        is_dst: boolean | null;
        utc: string | null;
        current_time: string | null;
    };
    flag: {
        flag_Icon: string | null;
        flag_unicode: string | null;
    };
    currency: CurrencyType;
    connection: {
        number: number | null;
        org: string | null;
    };
    security: {
        isVpn: boolean;
        isTor: boolean;
        isThreat: "low" | "medium" | "high";
    };
};


class IPData{
    static ipData: IPData | null;
    static cityLookup: Reader<CityResponse> | null = null;
    static asnLookup: Reader<AsnResponse> | null = null;

    static async getInstance() {
        if (!IPData.cityLookup || !IPData.asnLookup) {
            IPData.cityLookup = await maxmind.open<CityResponse>(cityPath);
            IPData.asnLookup = await maxmind.open<AsnResponse>(asnPath);
        }
        if (this.ipData) return this.ipData
        this.ipData = new IPData()
        return new IPData()
    }

    public getData(ip: string, req:Request) {
        try {
            return this.getGeoData(ip, req)
        } catch (e) {
            console.log(e);
            // throw new Error("Error ")
            return false
        }
    }

    private getGeoData(ip: string, req:Request):IpGeoResponse | null {
        ip = ip.trim();
        const valid = maxmind.validate(ip)
        if (!valid) {
            throw new Error("Invalid IP address")
        }
        if(!IPData.cityLookup || !IPData.asnLookup) {
            throw new Error("Initiation failed please make sure you using the class like this 'await IPData.getInstance()'")
        }
        const cityData = IPData.cityLookup.get(ip);
        const asnData = IPData.asnLookup.get(ip);
        let subdivisions

        if(!cityData) {
            return null;
            // throw new Error("ASNData or CityData are missing")
        }
        
        if (cityData.subdivisions) {
            subdivisions = cityData.subdivisions[0]
        }
        const currencyData:CurrencyType | null = this.getCurrency(cityData?.country?.iso_code ?? '')
        const extraData = this.getExtras(cityData?.country?.iso_code ?? '')
        const timeData: timeInfoType = this.getTimeInfo(cityData?.location?.time_zone ?? '')
        const isProxy = isBlocked(ip);
        const userAgent = getUserAgentData(req)

        monitoringService.getCounter("userDemographic[LDO]")?.inc({
            location: cityData?.country?.names?.en || "null",
            device: userAgent.deviceType,
            os: userAgent.os,
        })

        return {
            ip,
            continent: cityData?.continent?.names?.en || null,
            continentCode: cityData?.continent?.code || null,
            country: cityData?.country?.names?.en || null,
            countryCode: cityData?.country?.iso_code || null,
            capital: extraData?.capital || null,
            region: subdivisions?.names?.en || null,
            regionCode: subdivisions?.iso_code || null,
            city: cityData?.city?.names?.en || null,
            postal_Code: cityData?.postal?.code || null,
            dial_code: extraData?.dial_code || null,
            is_in_eu: extraData?.is_in_eu !== false,
            latitude: cityData?.location?.latitude || null,
            longitude: cityData?.location?.longitude || null,
            accuracy_radius: cityData?.location?.accuracy_radius || null,
            timezone:{
                time_zone: timeData?.timezone,
                abbr: timeData?.abbr,
                offset: timeData?.offset,
                is_dst: timeData?.is_dst,
                utc: timeData?.utc_time_zone,
                current_time: timeData?.current_time,
            },
            flag:{
                flag_Icon: extraData?.flag || null,
                flag_unicode: extraData?.unicode || null,
            },
            currency: currencyData as CurrencyType,
            connection: {
                number: asnData?.autonomous_system_number || null,
                org: asnData?.autonomous_system_organization || null,
            },
            security: {
                ...isProxy
            }
        }
    }

    private getCurrency(countryCode:string): CurrencyType | null {
        return currencyMap[countryCode] || null
    }

    private getExtras(countryCode:string): CountryExtraType | null {
        return countryExtraMap[countryCode] || null
    }

    private getTimeInfo(timeZone: string):timeInfoType {
        const now = new Date();
        const getAbbrIst = this.getAbbrAndDST(timeZone);

        const options: Intl.DateTimeFormatOptions = {
            timeZone,
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
        };

        const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(now);
        const getPart = (type: string) => parts.find(p => p.type === type)?.value ?? '00';
        const localTimeString = `${getPart('year')}-${getPart('month')}-${getPart('day')}T${getPart('hour')}:${getPart('minute')}:${getPart('second')}`;

        // Get offset in minutes using Intl for the right time zone
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const localDate = new Date(now.toLocaleString('en-US', { timeZone }));

        const offsetMinutes = Math.round((localDate.getTime() - utcDate.getTime()) / 60000);
        const sign = offsetMinutes >= 0 ? '+' : '-';
        const absOffset = Math.abs(offsetMinutes);
        const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
        const offsetMins = String(absOffset % 60).padStart(2, '0');
        const offset = `${sign}${offsetHours}:${offsetMins}`;

        return {
            timezone: timeZone,
            current_time: `${localTimeString}${offset}`,
            utc_time_zone: offset,
            offset: offsetMinutes*60,
            abbr: getAbbrIst?.abbr,
            is_dst: getAbbrIst?.is_dst,
        };
    }

    private getAbbrAndDST(timeZone: string) {
        const now = new Date();
        const abbr = moment.tz(timeZone).format('z');

        const jan = new Date(Date.UTC(now.getFullYear(), 0, 1));
        const offsetNow = -now.toLocaleString('en-US', { timeZone }).localeCompare('', undefined);
        const offsetJan = -jan.toLocaleString('en-US', { timeZone }).localeCompare('', undefined);
        const is_dst = offsetNow !== offsetJan;

        return { abbr, is_dst };
    }

}

export const ipDataService = await IPData.getInstance()
// console.log(ipDataService.getData('223.241.100.90'))
// console.log(ipDataService.getData('171.25.193.25'))

function getUserAgentData(req:Request):{os:string,deviceType:string}{
    const userAgent = req.headers['user-agent'] || '';
    const parser = new UAParser(userAgent);
    const uaResult = parser.getResult();

    const os = uaResult.os.name || 'Unknown';
    const deviceType = uaResult.device.type || 'desktop';

    return { os, deviceType }
}
