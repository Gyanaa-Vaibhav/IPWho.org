import React from "react";
import DataComponentWrapper from "./UIComponents/dataComponent.tsx";
import SkeletonListWithCustomLoaders from "./UIComponents/SkeletonList.tsx";
import Search from '../../../assets/svg/icon-search.svg?url'
import Location_Pin from '../../../assets/svg/icon-location-pin.svg?url'
import Money from '../../../assets/svg/icon-money.svg?url'
import Wifi from '../../../assets/svg/icon-wifi.svg?url'
import Security from '../../../assets/svg/icon-security-important.svg?url'
import Time from '../../../assets/svg/icon-time.svg?url'
import '../styles/IPLookupModal.css'

const url = import.meta.env.VITE_SERVER ? `${import.meta.env.VITE_SERVER}` : "/";
export default function IPLookupModal() {
    const [data,setData] = React.useState<Record<string, string>[]>([])
    const [ip,setIP] = React.useState<string>("")
    const [load,setLoad] = React.useState(false);
    const [securityData,setSecurityData] = React.useState<Record<string, string>[]>([])
    const [timezoneData,setTimezoneData] = React.useState<Record<string, string>[]>([])
    const [currencyData,setCurrencyData] = React.useState<Record<string, string>[]>([])
    const [connectionData,setConnectionData] = React.useState<Record<string, string>[]>([])
    const [loading,setLoading] = React.useState<boolean>(true)

    React.useEffect(() => {
        fetch(`${url}${ip ? `ip/${ip}` : "me"}`)
            .then(j => j.json())
            .then(d => {
                setLoading(false)
                setData(
                    [
                        {Success: d.success},
                        {latitude:d.data["latitude"]},
                        {Country: d.data["country"]},
                        {capital:d.data["capital"]},
                        {is_in_eu:d.data["is_in_eu"]},
                        {flag:d.data.flag["flag_Icon"]},
                        {IP: d.data["ip"]},
                        {longitude:d.data["longitude"]},
                        {continent:d.data["continent"]},
                        {dial_code:d.data["dial_code"]},
                        {accuracy_radius:d.data["accuracy_radius"]},
                        {flag_unicode:d.data.flag["flag_unicode"]},
                    ]
                )
                setCurrencyData([d.data["currency"]])
                setTimezoneData([d.data["timezone"]])
                setSecurityData([d.data["security"]])
                setConnectionData([d.data["connection"]])
            })
            .catch(e => console.log(e));
    },[load])

    const skeletonItems = [
        { heading: 'Location', lineCount: 6, icon:Location_Pin, iconAlt:"Location_Pin"},
        { heading: 'Currency', lineCount: 3, icon:Money, iconAlt:"Money Badge"},
        { heading: 'Timezone', lineCount: 3, icon:Time, iconAlt:"Clock"},
        { heading: 'Connection', lineCount: 1, icon:Wifi, iconAlt:"Wifi"},
        { heading: 'Security', lineCount: 2, icon:Security, iconAlt:"Security Sheild"},
    ];

    const dataItems = [
        {type: "location", title:"Location", icon:Location_Pin, iconAlt:"Location", data:data},
        {type: "currency", title:"Currency", icon:Money, iconAlt:"Money Badge", data:currencyData},
        {type: "timezone", title:"Timezone", icon:Time, iconAlt:"Clock", data:timezoneData},
        {type: "connection", title:"Connection", icon:Wifi, iconAlt:"Wifi", data:connectionData},
        {type: "security", title:"Security", icon:Security, iconAlt:"Security Shield", data:securityData},
    ]

    return (
        <>
            <div className="lookUp-Modal">
                <div className="input-Bar">
                    <input
                        id="ip-input"
                        autoComplete="off"
                        placeholder="8.8.8.8"
                        onKeyDown={e => {
                            if(e.key === "Enter") {
                                if(ip.split(".").length === 4) {
                                    setLoading(true)
                                    setLoad(prev => {
                                        if (!ip) return prev;
                                        return !prev
                                    })
                                }
                            }
                        }}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[0-9.]*$/.test(value)) {
                                setIP(value);
                            }else{
                                e.target.value = ip
                            }
                        }}
                    />
                    <button
                        onClick={() => {
                            if(ip.split(".").length === 4) {
                                setLoading(true)
                                setLoad(prev => {
                                    if (!ip) return prev;
                                    return !prev
                                })
                            }
                        }}
                    >
                        <img src={Search} alt={"Search Icon"}/></button>
                </div>
                <div className='response-Container'>
                    {loading
                        ? <SkeletonListWithCustomLoaders items={skeletonItems} />
                        : <DataComponentWrapper items={dataItems}/>
                    }
                </div>
            </div>
        </>
    )
}