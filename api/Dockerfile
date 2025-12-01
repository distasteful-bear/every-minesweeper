# Multi-stage build for Go API suitable for Google Cloud Run

# Build stage
FROM golang:1.25 AS builder
WORKDIR /app

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the source
COPY . .

# Build statically linked binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o /server ./

# Final image
FROM gcr.io/distroless/static-debian11
COPY --from=builder /server /server

# Cloud Run expects the service to listen on the port provided in $PORT
EXPOSE 8080
ENV PORT 8080

CMD ["/server"]
