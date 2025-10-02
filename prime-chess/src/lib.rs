pub mod board;
pub mod chess_game;
pub mod chess_move;
pub mod piece;
pub mod square;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Color {
    White,
    Black,
}

impl From<char> for Color {
    fn from(value: char) -> Self {
        return match value.is_uppercase() {
            true => Color::White,
            false => Color::Black,
        };
    }
}

impl Color {
    fn try_from_fen(value: char) -> Result<Self, String> {
        return match value {
            'w' => Ok(Color::White),
            'b' => Ok(Color::Black),
            _ => Err(format!("Invalid color char: {value}!")),
        };
    }
}
