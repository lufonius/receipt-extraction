#!/bin/bash

rm -rf build
./gradlew build -x test
docker build -f app.Dockerfile --no-cache -t registry.digitalocean.com/aign/drezipbackend:0.0.1-SNAPSHOT .
docker push registry.digitalocean.com/aign/drezipbackend:0.0.1-SNAPSHOT

cd ..

helm upgrade --set environment=test drezip-backend ./infrastructure/drezip-backend -n test --install --wait

kubectl scale deployment drezip-backend --replicas=0
kubectl scale deployment drezip-backend --replicas=1
kubectl get pods --watch
