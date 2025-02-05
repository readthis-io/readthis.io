#!/bin/bash
aws s3 sync ./dist/webpage s3://readthisio --exclude "static/*" --cache-control "no-store, private, no-cache, max-age=0, must-revalidate" --delete
aws s3 sync ./dist/webpage/static s3://readthisio/static --cache-control "immutable, max-age=31536000" --delete