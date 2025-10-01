FROM rust:latest AS build
WORKDIR /server

COPY Cargo.toml Cargo.lock ./

COPY src ./src

RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /usr/local/bin/
COPY --from=build /server/target/release/server . 
CMD ["./server"]