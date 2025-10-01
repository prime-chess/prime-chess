FROM rust:1-slim-bookworm AS build
WORKDIR /server
COPY Cargo.toml Cargo.lock ./
COPY src ./src

RUN cargo build --release

FROM debian:bookworm-slim

COPY --from=build /server/target/release/server /usr/local/bin/server

ENV ROCKET_ADDRESS=0.0.0.0
ENV ROCKET_PORT=8080

EXPOSE 8080

CMD ["/usr/local/bin/server"]