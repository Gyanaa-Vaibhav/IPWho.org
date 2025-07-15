import {IpGeoResponse} from "../../../services/ip/ipData";

type QueryHelper = {
    getQuery: string,
    data: IpGeoResponse | null | false,
}

export async function getQueryHelper({getQuery, data}:QueryHelper): Promise<IpGeoResponse | undefined> {
    const dataToReturn = getQuery?.split(",")
    const newData = {}
    for (const item of dataToReturn) {
        // @ts-ignore
        newData[item] = null;
    }

    if(dataToReturn.length > 0){
        for (const item of dataToReturn) {
            // @ts-ignore
            if(data[item]){
                // @ts-ignore
                newData[item] = data[item];
            }
        }
        return newData as IpGeoResponse;
    }
}