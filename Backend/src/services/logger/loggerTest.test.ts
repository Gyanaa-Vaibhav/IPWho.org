import {describe,it,expect} from "vitest";
import {logError,logWarn,logVerbose,logSilly,logInfo,logHttp,logDebug} from './loggerService.js'
import url from "node:url";
import path from "node:path";
import fs from "node:fs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const logPath = path.join(__dirname,'..','..','..','..','logs')

describe("Logger File Test",()=>{
    it("Should Log files with no errors", async () => {
        const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique sagittis sem ullamcorper ultrices. Maecenas fermentum, ante nec tempor porta, elit risus scelerisque ligula, sed sollicitudin turpis diam in lacus. Morbi ullamcorper pellentesque purus, non convallis sapien placerat a. Vestibulum placerat, lorem et dictum condimentum, dui ipsum suscipit erat, ac sagittis lorem ante quis augue. Nunc eu justo a nunc faucibus rhoncus vel id ipsum. Suspendisse nec luctus tellus, eu blandit felis. Integer placerat sodales ante, sed dapibus tellus viverra eu. Fusce aliquam elit vel quam egestas, at eleifend nulla ultrices. Donec iaculis justo at felis dictum, vel condimentum libero efficitur. Pellentesque eget enim in lectus luctus facilisis. Nam malesuada turpis quis orci viverra sodales. Suspendisse ac nulla neque. Fusce iaculis id ante vitae facilisis. Praesent at arcu lacinia orci varius fringilla nec eu diam."
        logVerbose(`Verbose ${text}`)
        logInfo(`Info ${text}`)
        logWarn(`Warn ${text}`)
        logDebug(`Debug ${text}`)
        logSilly(`Silly ${text}`)
        logHttp(`Http ${text}`)
        logError(new Error(`Error ${text}`))
        type LogLevel = 'debug' | 'error' | 'http' | 'info' | 'silly' | 'verbose' | 'warn';
        const files: LogLevel[] =  ['debug', 'error', 'http',  'info', 'silly', 'verbose', 'warn']
        const map:{
            debug: string[],
            error: string[][],
            http: string[],
            info: string[],
            silly: string[],
            verbose: string[],
            warn: string[]
        }  = {
            'debug':[],
            'error':[],
            'http': [],
            'info': [],
            'silly': [],
            'verbose': [],
            'warn': []
        }

        await (async () => {
            for (let file of files) {
                const dirPath = `${logPath}/${file}`;
                try {
                    const entries = fs.readdirSync(dirPath, {encoding: "utf8"});
                    const lastFile = entries[entries.length - 1];
                    const content = fs.readFileSync(`${dirPath}/${lastFile}`, {encoding: "utf-8"});
                    const tempData:string[] = [];

                    content.trim().split('\n').forEach(line => {
                        if (line) tempData.push(line);
                    });

                    file !== "error" ? map[file].push(tempData[tempData.length - 1]) : map[file].push(tempData);
                } catch (err) {
                    console.error(`Error reading ${file}:`, (err as {message:string}).message);
                }
            }

        })();

        let ans = true;
        for(let file of files) {
            const lines = map[file][0]
            if(typeof lines === "string"){
                if(!ans) break
                if(!lines.includes(`${file.slice(0,1).toUpperCase()}${file.slice(1)} ${text}`)){
                    ans = false;
                }
            }
            if(typeof lines === "object"){
                const ansLines = (lines.reduce((acc,curr)=>curr += acc,""));
                if(!ansLines.includes(`${file.slice(0,1).toUpperCase()}${file.slice(1)} ${text}`)){
                    ans = false;
                }
            }
        }

        expect(ans).toBe(true);
    })
})
