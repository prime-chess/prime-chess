#[macro_use]
extern crate rocket;

mod routes;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/games/", routes![routes::games::host_game])
}
