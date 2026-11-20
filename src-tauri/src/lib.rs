pub mod utils;

use serde::Serialize;
use std::net::{TcpStream, ToSocketAddrs};
use std::path::PathBuf;
use std::process::Command;
use std::time::Duration;
use utils::config::{BACKEND_URL, FORTNITE_SEASON};

#[derive(Serialize)]
struct AppConfig {
    backend_url: String,
    season: i32,
}

#[tauri::command]
fn app_config() -> AppConfig {
    AppConfig {
        backend_url: BACKEND_URL.to_string(),
        season: FORTNITE_SEASON,
    }
}

/// True when the backend accepts a TCP connection.
#[tauri::command]
async fn backend_status() -> bool {
    let url = BACKEND_URL.as_str();
    let host = url
        .trim_start_matches("http://")
        .trim_start_matches("https://")
        .split('/')
        .next()
        .unwrap_or("");
    host.to_socket_addrs()
        .ok()
        .and_then(|mut a| a.next())
        .map(|addr| TcpStream::connect_timeout(&addr, Duration::from_millis(1500)).is_ok())
        .unwrap_or(false)
}

/// Starts the build's game executable. Extend this (or call into utils::game)
/// to add your own launch arguments.
#[tauri::command]
async fn launch_game(path: String) -> Result<(), String> {
    let win64 = PathBuf::from(&path).join("FortniteGame/Binaries/Win64");
    let exe = win64.join("FortniteClient-Win64-Shipping.exe");
    if !exe.exists() {
        return Err(format!("Couldn't find {}", exe.display()));
    }
    Command::new(&exe)
        .current_dir(&win64)
        .args(["-epicapp=Fortnite", "-epicenv=Prod", "-epiclocale=en-us", "-skippatchcheck"])
        .spawn()
        .map(|_| ())
        .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![app_config, backend_status, launch_game])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
