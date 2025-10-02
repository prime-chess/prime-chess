use crate::game::{GamesMap, host_game, join_game_ws};
use axum::{
    Router,
    routing::{get, post},
};
use std::{
    collections::HashMap,
    net::SocketAddr,
    sync::{Arc, Mutex},
};
use tower_http::cors::{Any, CorsLayer};

mod game;

#[tokio::main]
async fn main() {
    let games: GamesMap = Arc::new(Mutex::new(HashMap::new()));

    let cors = CorsLayer::new().allow_origin(Any);

    let app = Router::new()
        .route("/games/", post(host_game))
        .route("/games/ws/:code", get(join_game_ws))
        .layer(cors)
        .with_state(games);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
