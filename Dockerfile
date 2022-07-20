FROM golang:alpine

RUN apk add --update --no-cache git
RUN git clone https://github.com/shogo82148/go-webntp
RUN cd go-webntp && go build -o app cmd/webntp/main.go

EXPOSE 80

CMD ["/go/go-webntp/app", "-serve", "0.0.0.0:80", "-allow-cross-origin"]
