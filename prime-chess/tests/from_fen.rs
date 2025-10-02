#[cfg(test)]
mod from_fen_test {
    use prime_chess::{Color, board::Board, piece::Piece, square::Square};

    #[test]
    fn starting_pos() {
        let pos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        let board = Board::try_from(pos.to_string()).expect("Expected parse to succeed!");

        let expected = vec![
            (Piece::Rook, Color::Black, Square::A8),
            (Piece::Knight, Color::Black, Square::B8),
            (Piece::Bishop, Color::Black, Square::C8),
            (Piece::Queen, Color::Black, Square::D8),
            (Piece::King, Color::Black, Square::E8),
            (Piece::Bishop, Color::Black, Square::F8),
            (Piece::Knight, Color::Black, Square::G8),
            (Piece::Rook, Color::Black, Square::H8),
            (Piece::Pawn, Color::Black, Square::A7),
            (Piece::Pawn, Color::Black, Square::B7),
            (Piece::Pawn, Color::Black, Square::C7),
            (Piece::Pawn, Color::Black, Square::D7),
            (Piece::Pawn, Color::Black, Square::E7),
            (Piece::Pawn, Color::Black, Square::F7),
            (Piece::Pawn, Color::Black, Square::G7),
            (Piece::Pawn, Color::Black, Square::H7),
            (Piece::Pawn, Color::White, Square::A2),
            (Piece::Pawn, Color::White, Square::B2),
            (Piece::Pawn, Color::White, Square::C2),
            (Piece::Pawn, Color::White, Square::D2),
            (Piece::Pawn, Color::White, Square::E2),
            (Piece::Pawn, Color::White, Square::F2),
            (Piece::Pawn, Color::White, Square::G2),
            (Piece::Pawn, Color::White, Square::H2),
            (Piece::Rook, Color::White, Square::A1),
            (Piece::Knight, Color::White, Square::B1),
            (Piece::Bishop, Color::White, Square::C1),
            (Piece::Queen, Color::White, Square::D1),
            (Piece::King, Color::White, Square::E1),
            (Piece::Bishop, Color::White, Square::F1),
            (Piece::Knight, Color::White, Square::G1),
            (Piece::Rook, Color::White, Square::H1),
        ];

        dbg!(&board.pieces);
        assert_eq!(board.pieces.len(), expected.len());
        for e in expected {
            assert!(
                board.pieces.contains(&e),
                "Expected piece {:?} not found in board",
                e
            );
        }
    }
}
