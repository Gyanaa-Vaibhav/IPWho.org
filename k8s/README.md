# IPWho K8s Test Deployment

### Contents

- [Overview](#ipwho--test-deployment-kubernetes)
- [What’s Deployed](#whats-deployed)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Secrets](#secrets)
- [Deploy](#deploy)
- [Validate / Smoke Tests](#validate--smoke-tests)

## ipwho — Test Deployment (Kubernetes)

This README documents the **test deployment** of the `ipwho` application on Kubernetes.

It provides details about:
- The components deployed (backend, database, cache, monitoring).
- Configuration that must be updated before applying.
- How to deploy, test, and troubleshoot the setup.

> ⚠️ **Important:**
> - Replace all placeholder values (`XXXX` for database settings, `YOUR IMAGE HERE` for images) with your actual configuration.
> - This setup uses Kubernetes `Deployment`, `Service`, and `PersistentVolumeClaim` objects.
> - The included manifests demonstrate one way to run the test environment. You may adapt storage (e.g., NFS, local PV, cloud provider volumes) to your own infrastructure.

## What’s Deployed

The test environment spins up the following components inside the `ipwho-test` namespace:

| Component              | Kind(s)                                  | Purpose                          | Image (tag)                                              |
|------------------------|------------------------------------------|----------------------------------|----------------------------------------------------------|
| **Redis**              | Deployment + Service                     | In-memory cache / queue          | `redis:8.0-alpine`                                       |
| **Postgres**           | Deployment + Service                     | Application database             | `postgres:15-alpine`                                     |
| **Pushgateway**        | Deployment + Service                     | Metrics push endpoint            | `prom/pushgateway`                                       |
| **Backend**            | Deployment + Service (NodePort)          | Core API + serves frontend build | `YOUR IMAGE HERE` → replace with tagged image            |
| **Status Monitor**     | Deployment                               | Simple health / dependency check | `YOUR IMAGE HERE` → replace with tagged image            |
| **Persistent Storage** | PersistentVolume + PersistentVolumeClaim | Holds main application files     | Replace NFS `server` and `path` with your storage choice |

> ⚠️ Notes:
> - Replace **`YOUR IMAGE HERE`** with the correct image + version tag from your registry.
> - Replace all **`XXXX`** values in Postgres and backend environment variables with real credentials and DB settings.
> - The manifests show an example with NFS, but you can adapt the PersistentVolume to any supported storage backend in your cluster.

## Prerequisites

Before applying the manifests, make sure you have:

- A running **Kubernetes cluster** (v1.21+ recommended).
- `kubectl` installed and configured to point to the correct cluster.
- Access to a **container registry** where your custom images are stored.
- Database credentials (user, password, db name, timezone) to replace the `XXXX` placeholders.
- A storage backend configured for the `PersistentVolume` —  
  the sample manifests use NFS, but you can switch this to any supported storage class in your cluster (EBS, GCE PD, local-path, etc.).

> 📝 Tip: Ensure you have permissions to create `Namespace`, `Deployment`, `Service`, `PersistentVolume`, and `PersistentVolumeClaim` resources in your cluster.

## Configuration

### Replace placeholders

Before deploying, update the following placeholders in the YAML:

- **Images**
  - Backend (`ipwho-test`): replace `YOUR IMAGE HERE` with your backend image and tag.
  - Frontend build init container: replace `YOUR IMAGE HERE` with your frontend image that includes `/app/build`.
  - Status monitor (`ipwho-status-mointor-test`): replace `YOUR IMAGE HERE` with your monitoring image.

- **Database environment variables**
  - `POSTGRES_USER: XXXX` → your DB username
  - `POSTGRES_PASSWORD: XXXX` → your DB password
  - `POSTGRES_DB: XXXX` → your DB name
  - `TZ: XXXX` → timezone (e.g., `UTC`)
  - In backend and monitor: update `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOSTNAME` if needed.

- **Storage**
  - The `PersistentVolume` manifest uses `nfs.server` and `nfs.path` set to `XXXX`.  
    Replace these with values matching your storage setup, or adjust the manifest to use another storage backend (e.g., dynamic provisioned volumes).

### Environment variables summary

| Component       | Variable                              | Required | Notes                                |
|-----------------|---------------------------------------|:--------:|--------------------------------------|
| Postgres        | `POSTGRES_USER`                       |    ✔︎    | DB username                          |
| Postgres        | `POSTGRES_PASSWORD`                   |    ✔︎    | DB password                          |
| Postgres        | `POSTGRES_DB`                         |    ✔︎    | Database name                        |
| Postgres        | `TZ`                                  |    ◻︎    | Container timezone                   |
| Backend         | `PUSHGATEWAYURL`                      |    ✔︎    | Defaults to `ipwho-pushgateway`      |
| Backend         | `DB_HOSTNAME`                         |    ✔︎    | Defaults to `ipwho-postgres-service` |
| Backend         | `DB_USER` / `DB_PASSWORD` / `DB_NAME` |    ✔︎    | Must match Postgres                  |
| Backend         | `DB_PORT`                             |    ✔︎    | Defaults to `5432`                   |
| Monitor         | `SERVICE_NAME`                        |    ✔︎    | Defaults to `ipwho-backend`          |
| Monitor         | `DB_*`                                |    ✔︎    | Same as backend                      |

> ✅ For security, consider storing database credentials in a Kubernetes `Secret` and referencing them in the deployments instead of hardcoding values.

## Secrets

For simplicity, the provided manifests hardcode database credentials (`XXXX`).  
It’s strongly recommended to use **Kubernetes Secrets** instead.

### Example: creating a Secret for database credentials

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ipwho-db-creds
  namespace: ipwho-test
type: Opaque
stringData:
  POSTGRES_USER: youruser
  POSTGRES_PASSWORD: yourpassword
  POSTGRES_DB: yourdb
```

### Using the Secret in a Deployment

Update the container environment section to reference the secret:
```
env:
  - name: POSTGRES_USER
    valueFrom:
    secretKeyRef:
    name: ipwho-db-creds
    key: POSTGRES_USER
  - name: POSTGRES_PASSWORD
    valueFrom:
    secretKeyRef:
    name: ipwho-db-creds
    key: POSTGRES_PASSWORD
  - name: POSTGRES_DB
    valueFrom:
    secretKeyRef:
    name: ipwho-db-creds
    key: POSTGRES_DB
```
> Apply the same pattern for the backend and status monitor deployments so they consume DB credentials securely.

## Deploy

After updating the manifests with your images, database values, and storage settings, you can deploy the resources.

### Apply all manifests

```bash
kubectl apply -f ./k8s/   # adjust the path to your manifest files
```

### Verify namespace and resources
```bash
kubectl get ns ipwho-test
kubectl -n ipwho-test get all
kubectl -n ipwho-test get pv,pvc
```

### Wait for pods to be ready
```bash
kubectl -n ipwho-test get pods -w
```
The backend and status monitor deployments use postStart lifecycle hooks to wait until their dependencies (Postgres, Redis, Pushgateway, and backend itself) are available. This helps ensure the services come up in the right order.

## Validate / Smoke Tests

Once all pods are running, you can perform quick checks to ensure the deployment is functional.

### 1. Check pods and services

```bash
kubectl -n ipwho-test get pods -o wide
kubectl -n ipwho-test get svc
```

You should see:
- Pods for Redis, Postgres, Pushgateway, Backend, and Status Monitor.
- Services including redis, ipwho-postgres-service, ipwho-pushgateway, and ipwho-backend.

### 2. Test backend externally (NodePort)

The backend service is exposed via a NodePort (30007).

```bash
# Replace $NODE_IP with the IP address of any cluster node
curl -i http://$NODE_IP:30007/
curl -i http://$NODE_IP:30007/health
```

### 3. Test connectivity inside the cluster

Run a temporary debug pod:
```bash
kubectl -n ipwho-test run tmp --image=busybox:1.36 --restart=Never -it -- sh
```

Inside the pod:
```bash
# Check Postgres
nc -zv ipwho-postgres-service 5432

# Check Redis
nc -zv redis 6379

# Check Pushgateway
nc -zv ipwho-pushgateway 9091

# Check backend
wget -qO- http://ipwho-backend:3000/ || true
exit
```

If all checks succeed, the deployment is healthy.