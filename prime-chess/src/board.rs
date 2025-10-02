use crate::{
    Color,
    piece::{self, Piece},
    square::Square,
};

pub struct Board {
    pub pieces: Vec<(Piece, Color, Square)>,
}

impl TryFrom<String> for Board {
    fn try_from(value: String) -> Result<Self, Self::Error> {
        let parts = value.split(" ").collect::<Vec<&str>>();

        if parts.len() != 6 {
            return Err(format!("Expected 6 FEN parts, got {}!", parts.len()));
        }

        let placement_data = parts[0];
        let ranks = placement_data.split("/").collect::<Vec<&str>>();

        if ranks.len() != 8 {
            return Err(format!("Expected 8 FEN ranks, got {}!", ranks.len()));
        }

        let mut pieces = Vec::new();

        ranks.iter().for_each(|r| {
            r.chars().into_iter().for_each(|p| {
                if !p.is_digit(10) {
                    pieces.push(value);
                }
            });
        });

        Ok(Self { pieces })
    }

    type Error = String;
}
