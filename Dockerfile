FROM node:16 as builder

WORKDIR /build
COPY ./web .
RUN npm install
RUN npm run build

FROM golang AS builder2
ENV GO111MODULE=on \
    CGO_ENABLED=1 \
    GOOS=linux \
    GOARCH=amd64

WORKDIR /build
COPY . .
COPY --from=builder /build/build ./web/build
RUN go mod download
RUN go build -ldflags "-s -w -extldflags '-static'" -o gin-react-template

FROM scratch

ENV PORT=3000
COPY --from=builder2 /build/gin-react-template /
EXPOSE 3000
ENTRYPOINT ["/gin-react-template"]
