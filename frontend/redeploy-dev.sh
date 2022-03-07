#!/bin/bash

rm -rf www
npm run build:prod:www
docker build -f app.Dockerfile --no-cache -t registry.digitalocean.com/aign/drezipfrontend:0.0.9-SNAPSHOT .
docker push registry.digitalocean.com/aign/drezipfrontend:0.0.9-SNAPSHOT

cd ..

helm upgrade --set environment=test drezip-frontend ./infrastructure/drezip-frontend -n test --install --wait

kubectl scale deployment drezip-frontend --replicas=0
kubectl scale deployment drezip-frontend --replicas=1
kubectl get pods --watch
