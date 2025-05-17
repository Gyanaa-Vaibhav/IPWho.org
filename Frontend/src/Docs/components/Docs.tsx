import {Overview} from "./Overview.tsx";
import {BaseURL} from "./BaseURL.tsx";
import {Response} from "./Response.tsx";

export function Docs () {
    return(
        <>
            <Overview />
            <BaseURL />
            <Response />
        </>
    )
}