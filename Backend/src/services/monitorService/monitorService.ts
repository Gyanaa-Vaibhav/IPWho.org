import * as client from 'prom-client';
import {Counter, Gauge, Histogram, Summary, Pushgateway } from "prom-client";
import dotenv from 'dotenv';
dotenv.config();

/**
 * Enum representing supported Prometheus metric types.
 */
enum metrics {
    counter="Counter",
    gauge="Gauge",
    histogram="Histogram",
    summary="Summary"
}

/**
 * Input configuration for initiating a Prometheus metric.
 */
type metricInitiator = {
    metric:metrics,
    name:string
    help:string,
    registry?: client.Registry,
    buckets?:number[],
    labelNames?:string[],
    metric_custom_name?:string,
}

/**
 * Internal structure for storing created Prometheus metrics.
 */
type metricsHolderType = {
    [name:string]: client.Counter<string> | client.Gauge<string> | client.Summary<string> | client.Histogram<string> | undefined
}

/**
 * Service class for managing Prometheus metrics.
 */
class MonitorService{
    private serviceInstance:client.Registry | null = null;
    private metricsHolder:metricsHolderType = {}

    /**
     * Creates a new MonitorService instance with a given Prometheus registry.
     * @param instance - A Prometheus `Registry` instance for registering metrics.
     */
    constructor(instance: client.Registry){
        this.serviceInstance = instance;
    }

    /**
     * Initializes and registers a new Prometheus metric of the given type.
     *
     * @param {metricInitiator} param0 - Configuration object for the metric.
     * @param {metrics} param0.metric - The type of metric to create (e.g., Counter, Gauge).
     * @param {string} param0.name - The actual Prometheus metric name.
     * @param {string} param0.help - Description of the metric's purpose (shown in Prometheus UI).
     * @param {client.Registry} [param0.registry] - Optional custom registry. Defaults to the service's internal registry.
     * @param {number[]} [param0.buckets] - Required for histograms. Bucket boundaries.
     * @param {string[]} [param0.labelNames] - List of label names to associate with the metric.
     * @param {string} [param0.metric_custom_name] - Optional custom key for referencing the metric in code.
     *   ⚠️ **Recommended:** If using labels, include them in the custom name (e.g., `'http_requests[method,status]'`)
     *   to avoid confusion and to make label context obvious when retrieving or incrementing metrics.
     *
     * @throws Error will throw an error if a histogram is initiated without `buckets`.
     * @example
     * monitoringService.initiateMetric({
     *   metric: metrics.counter,
     *   name: "http_requests_total",
     *   help: "Total number of HTTP requests",
     *   labelNames: ["method", "statusCode"],
     *   metric_custom_name: "httpCounter[Met,StC]" || "httpCounterWithLabel"
     * });
     */

    public initiateMetric
    ({
         metric,
         name,
         help,
         registry = this.serviceInstance!,
         buckets,
         metric_custom_name = metric,labelNames = []
    }:metricInitiator) {
        if (this.metricsHolder[metric_custom_name]) {
            throw new Error(`Metric with key "${metric_custom_name}" already exists.`);
        }
        let newMetric;

        if(metric === metrics.counter) newMetric = new Counter({name, help, labelNames, registers:[registry]})
        else if(metric === metrics.gauge) newMetric = new Gauge({name, help, labelNames, registers:[registry]})
        else if(metric === metrics.summary) newMetric = new Summary({name, help, labelNames, registers:[registry]})
        else if(!buckets) throw new Error("Bucket not defined")
        else if(metric === metrics.histogram){newMetric = new Histogram({ name, help, buckets, labelNames, registers:[registry]})}

        this.metricsHolder[metric_custom_name] = newMetric;
    }

    /**
     * Retrieves a metric by its custom name.
     * @param {string} metric_custom_name - The key used when registering the metric.
     * @returns The corresponding metric instance.
     * @throws Error will throw an error if the metric is not found.
     */
    public getMetric(metric_custom_name:string) {
        if(this.metricsHolder[metric_custom_name]){
            return this.metricsHolder[metric_custom_name];
        }
        throw new Error("Metric not found for metric " + metric_custom_name);
    }

    /**
     * Gets a {@link Counter} metric by name.
     * @param {string} name - The metric key.
     * @returns A `Counter` instance if found and of the correct type.
     * @throws Error If the metric is not a `Counter`.
     */
    public getCounter(name: string): Counter<string> | undefined {
        const metric = this.getMetric(name);
        if (!(metric instanceof Counter)) {
            throw new Error(`${name} is not a Counter`);
        }
        return metric;
    }

    /**
     * Gets a {@link Gauge} metric by name.
     * @param {string} name - The metric key.
     * @returns A `Gauge` instance if found and of the correct type.
     * @throws Error If the metric is not a `Gauge`.
     */
    public getGauge(name: string): Gauge<string> | undefined {
        const metric = this.getMetric(name);
        if (!(metric instanceof Gauge)) {
            throw new Error(`${name} is not a Gauge`);
        }
        return metric;
    }

    /**
     * Gets a {@link Histogram} metric by name.
     * @param {string} name - The metric key.
     * @returns A `Histogram` instance if found and of the correct type.
     * @throws Error If the metric is not a `Histogram`.
     */
    public getHistogram(name: string): Histogram<string> | undefined {
        const metric = this.getMetric(name);
        if (!(metric instanceof Histogram)) {
            throw new Error(`${name} is not a Histogram`);
        }
        return metric;
    }

    /**
     * Gets a {@link Summary} metric by name.
     * @param {string} name - The metric key.
     * @returns A `Summary` instance if found and of the correct type.
     * @throws Error If the metric is not a `Summary`.
     */
    public getSummary(name: string): Summary<string> | undefined {
        const metric = this.getMetric(name);
        if (!(metric instanceof Summary)) {
            throw new Error(`${name} is not a Summary`);
        }
        return metric;
    }

    /**
     * Returns all active metrics stored in the holder.
     * @returns An object containing all stored metrics keyed by their custom names.
     */
    public getActiveMetrics(){
        return this.metricsHolder;
    }

    /**
     * Collects and returns all metrics in the registry in Prometheus exposition format.
     * @returns A string of Prometheus-formatted metrics.
     */
    public async getMetricsData(){
        return this.serviceInstance?.metrics();
    }

    public resetAllMetrics() {
        this.metricsHolder = {};
        this.serviceInstance?.resetMetrics();
    }

    public getContentType(){
        return this.serviceInstance?.contentType
    }
}

export const monitoringService = new MonitorService(client.register);
client.collectDefaultMetrics()
// HTTP Metrics
monitoringService.initiateMetric({metric:metrics.counter, name:"ipWho_http_total_request", help:"Total Http Requests", metric_custom_name:"httpTotalCounter"})
monitoringService.initiateMetric({metric:metrics.counter, name:"ipWho_http_request", help:"Http Requests", metric_custom_name:"httpReqCounter[MRS]",labelNames:['method','route','status']})
monitoringService.initiateMetric({metric:metrics.counter, name:"ipWho_http_errors_total", help:"Total Http Errors", metric_custom_name:"httpErrorCounter[MRS]",labelNames:['method','route','status']})
monitoringService.initiateMetric({metric:metrics.gauge, name:"ipWho_http_active_requests", help:"Total Active Requests", metric_custom_name:"httpActiveReqGauge[R]",labelNames:['route']})
monitoringService.initiateMetric({metric:metrics.histogram, name:"ipWho_http_request_duration_sec", help:"Tracks Https Latency", metric_custom_name:"httpDuration[MRS]",labelNames:['method','route','status'],buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5]})

// Cache Metrics
monitoringService.initiateMetric({metric:metrics.counter, name:"ipWho_cache_hits_total", help:"Total Cache Hits", metric_custom_name:"cacheHitsCounter[K]",labelNames:['key']})
monitoringService.initiateMetric({metric:metrics.counter, name:"ipWho_cache_misses_total", help:"Total Cache Misses", metric_custom_name:"cacheMissCounter[K]",labelNames:['key']})
monitoringService.initiateMetric({metric:metrics.histogram, name:"ipWho_cache_latency_sec", help:"Tracks Cache Latency", metric_custom_name:"cacheDuration[KH]",labelNames:['key','hit'],buckets:[0.001, 0.005, 0.01, 0.05, 0.1, 0.3]})

// Custom Metrics
monitoringService.initiateMetric({metric:metrics.counter, name:"ipWho_ip_service_users", help:"Tracks hits for /ip route tracking the requestor's IP", metric_custom_name:"ipServiceCounter[ip?]",labelNames:['ip']})
monitoringService.initiateMetric({metric:metrics.counter, name:"ipWho_non_repeating_visitors", help:"Tracks unique users with /me route", metric_custom_name:"uniqueVisitorsCounter[ip?]",labelNames:['ip']})
monitoringService.initiateMetric({metric:metrics.counter, name:"ipWho_user_demographic_tracker", help:"Tracks users Demopraphic", metric_custom_name:"userDemographic[LDO]",labelNames:['location','device','os']})
monitoringService.initiateMetric({metric:metrics.gauge, name:"ipWho_active_session", help:"Tracks Active users on web", metric_custom_name:"activeUsersGauge[ip?]",labelNames:['ip']})

const PUSHGATEWAYURL = process.env.PUSHGATEWAYURL
if(!PUSHGATEWAYURL) throw new Error("PUSHGATEWAYURL not defined")
const gateway = new Pushgateway(`http://${PUSHGATEWAYURL}:9091`);
const instanceLabel = process.env.POD_NAME;

if(!instanceLabel) {
    throw Error("instanceLabel not set in ENV")
}

setInterval(() => {
    gateway.pushAdd({
        jobName: "ipwho",
        groupings: { instance: instanceLabel },
    }).catch((err: Error) => {
        console.error("Push to gateway failed:", err);
    });
}, 10000);