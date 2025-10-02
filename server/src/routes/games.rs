use rocket::Request;

#[post("/")]
fn host_game() -> &'static str {
    "0000"
}