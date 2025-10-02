#[cfg(test)]
mod squares_test {
    use prime_chess::square::Square;

    #[test]
    fn corners_test() {
        assert_eq!(Square::try_from((0, 0)).expect("Expected valid square"), Square::A1);
        assert_eq!(Square::try_from((7, 7)).expect("Expected valid square"), Square::H8);
    }
}
