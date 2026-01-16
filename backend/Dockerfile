# 构建 it-tools 后端服务镜像（Go + MySQL）。
FROM golang:1.21-alpine AS build

WORKDIR /app
COPY go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o /out/server ./cmd/server

FROM alpine:3.19
WORKDIR /app
COPY --from=build /out/server /app/server

EXPOSE 8080
CMD ["/app/server"]

