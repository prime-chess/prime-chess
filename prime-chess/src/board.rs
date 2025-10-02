use crate::{Color, piece::Piece, square::Square};

pub struct Board {
    pub pieces: Vec<(Piece, Color, Square)>,
}

impl TryFrom<String> for Board {
    fn try_from(value: String) -> Result<Self, Self::Error> {
        let parts = value.split_whitespace().collect::<Vec<&str>>();

        if parts.len() != 6 {
            return Err(format!("Expected 6 FEN parts, got {}!", parts.len()));
        }

        let placement_data = parts[0];
        let ranks = placement_data.split("/").collect::<Vec<&str>>();

        if ranks.len() != 8 {
            return Err(format!("Expected 8 FEN ranks, got {}!", ranks.len()));
        }

        let mut pieces: Vec<(Piece, Color, Square)> = Vec::new();

        for (i, r) in ranks.iter().enumerate() {
            let mut j: u8 = 0;
            let i = i as u8;
            for p in r.chars() {
                if !p.is_digit(10) {
                    let piece = Piece::try_from(p).map_err(|_| "Invalid piece in FEN!")?;
                    let color = Color::from(p);

                    pieces.push((
                        piece,
                        color,
                        Square::try_from((j, 7 - i))
                            .map_err(|e| format!("Failed to parse square: {}", e))?,
                    ));

                    j += 1;
                } else {
                    let empty_squares = p
                        .to_digit(10)
                        .ok_or_else(|| "Failed to parse number!".to_string())?
                        as u8;

                    j += empty_squares;
                }
            }

            if j != 8 {
                return Err(format!(
                    "Rank {} has an invalid number of squares ({})!",
                    i + 1,
                    j
                ));
            }
        }

        Ok(Self { pieces })
    }

    type Error = String;
}
