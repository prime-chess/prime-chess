#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Piece {
    Pawn,
    Knight,
    Bishop,
    Rook,
    PRook,
    Queen,
    King,
}

impl TryFrom<char> for Piece {
    fn try_from(value: char) -> Result<Self, Self::Error> {
        match value.to_lowercase().collect::<Vec<char>>()[0] {
            'p' => Ok(Piece::Pawn),
            'n' => Ok(Piece::Knight),
            'b' => Ok(Piece::Bishop),
            'r' => Ok(Piece::Rook),
            'f' => Ok(Piece::PRook),
            'q' => Ok(Piece::Queen),
            'k' => Ok(Piece::King),
            c => Err(format!("Invalid piece char: {}!", c)),
        }
    }

    type Error = String;
}
