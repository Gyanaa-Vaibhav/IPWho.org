import * as fs from 'node:fs';
import * as path from 'node:path';
import url from "node:url";

const FIREHOL_URL = 'https://iplists.firehol.org/files/firehol_level2.netset';
const TOR_URL = 'https://check.torproject.org/torbulkexitlist';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fireholFile = path.resolve(__dirname, 'firehol_level2.netset');
const torFile = path.resolve(__dirname, 'tor_exit_nodes.txt');
const outputFile = path.resolve(__dirname, '..', '..', 'mainFiles', 'json' ,'blockList.json');

async function downloadFile(url: string, outputPath: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const data = await res.text();
    fs.writeFileSync(outputPath, data);
    console.log(`✅ Downloaded ${url}`);
}

function parseCIDRs(filePath: string): string[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
}

function parseIPs(filePath: string): string[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && /^[0-9.]+$/.test(line));
}

async function main() {
    await downloadFile(FIREHOL_URL, fireholFile);
    await downloadFile(TOR_URL, torFile);

    const cidrs = parseCIDRs(fireholFile);
    const torIps = parseIPs(torFile);

    const blocklist = {
        cidrs,
        tor_exit_nodes: torIps,
        version: new Date().toISOString().split('T')[0]
    };

    fs.writeFileSync(outputFile, JSON.stringify(blocklist, null, 2));
    console.log(`✅ blocklist.json created: ${cidrs.length} CIDRs, ${torIps.length} TOR IPs`);

    fs.unlinkSync(fireholFile)
    fs.unlinkSync(torFile)
}

main().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});