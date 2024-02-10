FROM golang:1.21-alpine

WORKDIR /app

COPY backend/. .

RUN apk update \
  && apk upgrade \
  && apk add --no-cache git make build-base sqlite

RUN go mod download \
  && CGO_ENABLED=1 go build -o backend   

EXPOSE 3000

ENTRYPOINT ./backend 