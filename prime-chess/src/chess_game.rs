use crate::{board::Board, chess_move::ChessMove};

pub struct ChessGame {
    pub board: Board,
    pub chess_moves: Vec<ChessMove>,
}

impl Default for ChessGame {
    fn default() -> Self {
        Self {
            board: Board::try_from(
                "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1".to_string(),
            )
            .expect("Default FEN should succeed"),
            chess_moves: vec![],
        }
    }
}
