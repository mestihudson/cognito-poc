#!/bin/sh
comando=$1
if [ $comando = "signUp" ]; then
  curl -q --header "Content-Type: application/json" --request POST --data "{ \"username\": \"$2\", \"password\": \"$3\" }" http://localhost:3000/auth/signUp
fi
if [ $comando = "verify" ]; then
  curl -q --header "Content-Type: application/json" --request POST --data "{ \"username\": \"$2\", \"code\": \"$3\" }" http://localhost:3000/auth/verify
fi
if [ $comando = "signIn" ]; then
  curl -q --header "Content-Type: application/json" --request POST --data "{ \"username\": \"$2\", \"password\": \"$3\" }" http://localhost:3000/auth/signIn
fi
if [ $comando = "refresh" ]; then
  curl -q --header "Content-Type: application/json" --request POST --data "{ \"token\": \"$(cat REFRESH_TOKEN)\" }" http://localhost:3000/auth/refresh
fi
if [ $comando = "revoke" ]; then
  curl -q --header "Content-Type: application/json" --request POST --data "{ \"token\": \"$(cat REFRESH_TOKEN)\" }" http://localhost:3000/auth/revoke
fi
if [ $comando = "signOut" ]; then
  curl -q --header "Content-Type: application/json" --request POST --data "{ \"token\": \"$(cat ACCESS_TOKEN)\" }" http://localhost:3000/auth/signOut
fi
if [ $comando = "protected" ]; then
  curl -q --header "Content-Type: application/json" --header "Auth: $(cat ACCESS_TOKEN)" --request GET http://localhost:3000/protected/secret
fi
