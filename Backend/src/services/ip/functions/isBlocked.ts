import path from "node:path";
import fs from "node:fs";
import CidrMatcher from "cidr-matcher";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const blockListPath = path.resolve(__dirname, '../../../../mainFiles/json/blockList.json');
const blockList: Blocklist = JSON.parse(fs.readFileSync(blockListPath, 'utf8'));

interface Blocklist {
    cidrs: string[];
    tor_exit_nodes: string[];
}

const validCidrs = blockList.cidrs
    .map(cidr => {
        const trimmed = cidr.trim();
        if (/^[0-9.]+$/.test(trimmed)) {
            // IP without mask: assume /32
            return `${trimmed}/32`;
        } else if (/^[0-9.]+\/\d{1,2}$/.test(trimmed)) {
            return trimmed;
        }
        return null;
    })
    .filter((cidr): cidr is string => cidr !== null);

// const invalidCidrs = rawBlocklist.cidrs.filter(cidr =>
//     !/^[0-9.]+$/.test(cidr.trim()) && !/^[0-9.]+\/\d{1,2}$/.test(cidr.trim())
// )

const matcher = new CidrMatcher(validCidrs);
export function isBlocked(ip: string): { isProxy: boolean, isVpn?: boolean, isTor?: boolean, matchedCidr?: string } {
    const vpnMatch = matcher.contains(ip);
    const torMatch = blockList.tor_exit_nodes.includes(ip);
    
    const proxyMap = {
        isProxy: false,
        isTor: false,
        isThreat:false,
    }

    if (torMatch) {
        proxyMap["isTor"] = true;
    }
    
    if (vpnMatch) {
        proxyMap["isProxy"] = true;
    }
    
    if (vpnMatch && torMatch) {
        proxyMap["isThreat"] = true;
    }

    return proxyMap;
}