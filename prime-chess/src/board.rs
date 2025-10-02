use crate::{Color, piece::Piece, square::Square};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CastlingRight {
    King,
    Queen,
}

pub type CastlingRights = [[Option<CastlingRight>; 2]; 2];

pub struct Board {
    pub pieces: Vec<(Piece, Color, Square)>,
    pub side_to_move: Color,
    pub castling_rights: CastlingRights,
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

        let side_to_move = Color::try_from_fen(parts[1].chars().collect::<Vec<char>>()[0])
            .or(Err(format!("Invalid side to move part: {}!", parts[1])))?;

        let mut castling_rights: CastlingRights = [[None, None], [None, None]];
        if parts[2] != "-" {
            for c in parts[2].chars() {
                match c {
                    'K' => castling_rights[0][0] = Some(CastlingRight::King),
                    'Q' => castling_rights[0][1] = Some(CastlingRight::Queen),
                    'k' => castling_rights[1][0] = Some(CastlingRight::King),
                    'q' => castling_rights[1][1] = Some(CastlingRight::Queen),
                    _ => return Err(format!("Invalid castling char: {}", c)),
                }
            }
        }

        Ok(Self {
            pieces,
            side_to_move,
            castling_rights,
        })
    }

    type Error = String;
}
