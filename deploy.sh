#!/usr/bin/env bash

npm run build
version=0.1
docker build -t cs-api-editor:${version} .
docker tag cs-api-editor:${version} d.lmjia.cn:5443/cs-api-editor:${version}
docker push d.lmjia.cn:5443/cs-api-editor:${version}
