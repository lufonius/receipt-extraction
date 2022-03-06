## Setting up a kubernetes cluster / infrastructure with this app
### Required infrastructure
- Container registry
- Blob storage
- Form recognizer API
- Kubernetes cluster
  - Load balancer and storage should be created automatically by Kubernetes 

### Cloud-specific adjustments to kubernetes deployments
- Node affinity
- Image pull secrets
- Storage class


### Manual, imperative adjustments to the kubernetes cluster and other infrastructure
- Adding the container registry secret to the cluster
- Installing nginx-ingress controller to support the Ingress object
- Installing cert-manager for managing certificates
- Installing metrics-server, Grafana and Prometeus for cluster insights
- Setting up the required secrets for your app
- Getting the letsencrypt certificates so that the ingress can prove a SSL connection
- Adjust the DNS record to point to the load balancers IP address

### Needed resources by this app
- Backend needs in idle mode about 300MB of RAM
- Frontend?
- DB?

### Costs
Here is what drives the costs of your cloud provider. This might vary for each cloud provider
- The amount of nodes
- Load Balancer
- Storage

