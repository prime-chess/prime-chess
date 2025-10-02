use rand::Rng;
use rocket::State;

use crate::game::{Game, GameState, GamesMap};

#[post("/")]
pub fn host_game(games: &State<GamesMap>) -> String {
    let mut rng = rand::rng();

    let code = rng.random_range(1000..9999);
    let code_string = code.to_string();

    let game = Game {
        code: code_string.clone(),
        state: GameState::Waiting,
    };

    games.lock().unwrap().insert(code_string.clone(), game);

    code_string
}

#[get("/connect/<code>")]
async fn connect(code: u32, ws: rocket_ws::WebSocket) {}
