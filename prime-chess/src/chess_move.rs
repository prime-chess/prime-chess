use crate::square::Square;

pub enum ChessMoveFlags {
    EnPassant(Square),
    Promotion(Square)
}

pub struct ChessMove {
    pub flags: ChessMoveFlags,
    pub origin: Square,
    pub destination: Square,
}