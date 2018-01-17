#!/usr/bin/env bash

npm run build
version=1.4-SNAPSHOT
docker build -t cs-api-editor:${version} .
docker tag cs-api-editor:${version} d.lmjia.cn:5443/cs-api-editor:${version}
docker push d.lmjia.cn:5443/cs-api-editor:${version}
