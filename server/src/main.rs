use std::{collections::HashMap, sync::{Arc, Mutex}};

use crate::game::GamesMap;

#[macro_use]
extern crate rocket;

mod game;
mod routes;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[launch]
fn rocket() -> _ {
    let games: GamesMap = Arc::new(Mutex::new(HashMap::new()));

    rocket::build()
        .manage(games)
        .mount("/games/", routes![routes::games::host_game])
}
