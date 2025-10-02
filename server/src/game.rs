use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

#[derive(Clone)]
pub enum GameState {
    Waiting,
    InProgress,
    Completed,
}

#[derive(Clone)]
pub struct Game {
    pub code: String,
    pub state: GameState,
}

pub type GamesMap = Arc<Mutex<HashMap<String, Game>>>;
