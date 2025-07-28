import {Overview} from "./Overview.tsx";
import {BaseURL} from "./BaseURL.tsx";
import {Response} from "./Response.tsx";
import React from "react";

export function Docs () {

    React.useEffect(() => {
        document.title = "IPWHO | Documentation";
    }, [])

    return(
        <>
            <Overview />
            <BaseURL />
            <Response />
        </>
    )
}