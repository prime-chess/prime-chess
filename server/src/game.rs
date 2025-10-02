use axum::{
    extract::{
        Path, State,
        ws::{Message, WebSocket, WebSocketUpgrade},
    },
    http::StatusCode,
    response::Response,
};
use prime_chess::board::Board;
use rand::Rng;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

pub struct Player {
    pub username: String,
    pub ws: WebSocket,
}

#[derive(Clone, Debug)]
pub enum GameState {
    Waiting,
    Playing,
    Finished,
}

pub struct Game {
    pub code: String,
    pub state: GameState,
    pub players: Vec<Player>, // This will hold Player structs eventually
    pub board: Board,
}

pub type GamesMap = Arc<Mutex<HashMap<String, Game>>>;

pub async fn host_game(State(games): State<GamesMap>) -> String {
    let mut rng = rand::thread_rng();
    let code = rng.gen_range(1000..=9999).to_string();

    let game = Game {
        code: code.clone(),
        state: GameState::Waiting,
        players: Vec::new(),
        board: Board::default(),
    };

    games.lock().unwrap().insert(code.clone(), game);

    println!("New game requested, code returned {code}");

    code
}

pub async fn join_game_ws(
    ws: WebSocketUpgrade,
    State(games): State<GamesMap>,
    Path(code): Path<String>,
) -> Response {
    if !games.lock().unwrap().contains_key(&code) {
        return Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body("Game not found".into())
            .unwrap();
    }

    println!("Player attempting to join game: {}", code);

    ws.on_upgrade(move |socket| handle_socket(socket, State(games), code))
}

async fn handle_socket(mut socket: WebSocket, State(games): State<GamesMap>, code: String) {
    println!("New WebSocket connection for game: {}", code);

    while let Some(Ok(msg)) = socket.recv().await {
        match msg {
            Message::Text(t) => {
                println!("<- Received text from client: {}", t);
                if socket
                    .send(Message::Text(format!("You said: {}", t)))
                    .await
                    .is_err()
                {
                    break;
                }
            }
            Message::Binary(_) => {
                println!("<- Received binary data (unsupported)");
            }
            Message::Ping(_) => {
                println!("<- Received ping");
            }
            Message::Pong(_) => {
                println!("<- Received pong");
            }
            Message::Close(_) => {
                println!("-> Client disconnected.");
                break;
            }
        }
    }

    println!("Player disconnected from game: {}", code);
}
