#!/bin/bash

if [ $# != 1 ]; then
  echo "Please use like \n> sh set-aws-token.sh <current MFA token>"
  exit 1
fi

PROFILE="default"
serial="arn:aws:iam::808106573293:mfa/shintaro.okada"
token=$1

echo $PROFILE
echo $serial
echo $token

CREDJSON="$(aws sts get-session-token --duration 129600 --serial-number $serial --profile $PROFILE --token-code $token)"
echo $CREDJSON

ACCESSKEY="$(echo $CREDJSON | jq '.Credentials.AccessKeyId' | sed 's/"//g')"
SECRETKEY="$(echo $CREDJSON | jq '.Credentials.SecretAccessKey' | sed 's/"//g')"
SESSIONTOKEN="$(echo $CREDJSON | jq '.Credentials.SessionToken' | sed 's/"//g')"
PROFILENAME=${PROFILE}-session

echo "Profile $PROFILENAME"
echo "AccessKey $ACCESSKEY"
echo "SecretKey $SECRETKEY"
echo "SessionToken $SESSIONTOKEN"

aws configure set aws_access_key_id $ACCESSKEY --profile $PROFILENAME
aws configure set aws_secret_access_key $SECRETKEY --profile $PROFILENAME
aws configure set aws_session_token $SESSIONTOKEN --profile $PROFILENAME
