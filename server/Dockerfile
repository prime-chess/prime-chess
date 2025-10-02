FROM rust:1-slim-bookworm AS build
WORKDIR /usr/src/server 

COPY Cargo.toml Cargo.lock ./

COPY prime-chess ./prime-chess
COPY server ./server

RUN cargo build --release --package server

FROM debian:bookworm-slim

COPY --from=build /usr/src/server/target/release/server /usr/local/bin/server

EXPOSE 8080

CMD ["/usr/local/bin/server"]