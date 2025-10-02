pub mod board;
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
