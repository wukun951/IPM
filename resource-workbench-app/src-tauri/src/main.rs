#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::engine::general_purpose::STANDARD as BASE64_STANDARD;
use base64::Engine;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::time::UNIX_EPOCH;
use tauri::{AppHandle, Manager};
use tauri_plugin_dialog::DialogExt;
use url::Url;

const SETTINGS_FILE_NAME: &str = "file-storage-settings.json";
const DEFAULT_STORAGE_DIR_NAME: &str = "managed-files";

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct FileStorageSettings {
    current_dir: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct FileStorageSettingsPayload {
    available: bool,
    current_dir: String,
    default_dir: String,
    changed: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredFilePayload {
    stored_file_path: String,
    file_url: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ManagedResourceRecord {
    id: String,
    stored_file_path: String,
    file_name: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct ManagedResourceUpdate {
    id: String,
    stored_file_path: String,
    file_url: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct ManagedFileMigrationPayload {
    moved_count: usize,
    skipped_count: usize,
    failed_count: usize,
    updated_resources: Vec<ManagedResourceUpdate>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct DroppedFilePayload {
    path: String,
    file_name: String,
    data_base64: String,
    mime_type: String,
    file_size: u64,
    last_modified_ms: u64,
}

fn app_storage_root(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app.path().app_data_dir().map_err(|error| error.to_string())?;
    fs::create_dir_all(&dir).map_err(|error| error.to_string())?;
    Ok(dir)
}

fn settings_file_path(app: &AppHandle) -> Result<PathBuf, String> {
    Ok(app_storage_root(app)?.join(SETTINGS_FILE_NAME))
}

fn default_storage_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app_storage_root(app)?.join(DEFAULT_STORAGE_DIR_NAME);
    fs::create_dir_all(&dir).map_err(|error| error.to_string())?;
    Ok(dir)
}

fn load_settings(app: &AppHandle) -> Result<FileStorageSettings, String> {
    let path = settings_file_path(app)?;
    if !path.exists() {
        return Ok(FileStorageSettings::default());
    }
    let raw = fs::read_to_string(path).map_err(|error| error.to_string())?;
    serde_json::from_str(&raw).map_err(|error| error.to_string())
}

fn save_settings(app: &AppHandle, settings: &FileStorageSettings) -> Result<(), String> {
    let path = settings_file_path(app)?;
    let raw = serde_json::to_string_pretty(settings).map_err(|error| error.to_string())?;
    fs::write(path, raw).map_err(|error| error.to_string())
}

fn ensure_directory(path: &Path) -> Result<(), String> {
    fs::create_dir_all(path).map_err(|error| error.to_string())
}

fn normalize_string_path(path: PathBuf) -> String {
    path.to_string_lossy().into_owned()
}

fn path_to_file_url(path: &Path) -> Result<String, String> {
    Url::from_file_path(path)
        .map(|url| url.to_string())
        .map_err(|_| "Failed to build a local file URL.".to_string())
}

fn resolve_selected_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let settings = load_settings(app)?;
    match settings.current_dir {
        Some(dir) if !dir.trim().is_empty() => {
            let path = PathBuf::from(dir);
            ensure_directory(&path)?;
            Ok(path)
        }
        _ => default_storage_dir(app),
    }
}

fn same_directory(left: &Path, right: &Path) -> bool {
    let left_canonical = fs::canonicalize(left).unwrap_or_else(|_| left.to_path_buf());
    let right_canonical = fs::canonicalize(right).unwrap_or_else(|_| right.to_path_buf());
    left_canonical == right_canonical
}

fn sanitize_filename(value: &str) -> String {
    let cleaned = value
        .chars()
        .map(|character| match character {
            '<' | '>' | ':' | '"' | '/' | '\\' | '|' | '?' | '*' => '-',
            control if control.is_control() => '-',
            other => other,
        })
        .collect::<String>()
        .trim()
        .trim_matches('.')
        .to_string();

    if cleaned.is_empty() {
        "card-file".to_string()
    } else {
        cleaned
    }
}

fn split_name_parts(name: &str) -> (String, String) {
    let path = Path::new(name);
    let stem = path
        .file_stem()
        .and_then(|value| value.to_str())
        .filter(|value| !value.is_empty())
        .unwrap_or("card-file")
        .to_string();
    let extension = path
        .extension()
        .and_then(|value| value.to_str())
        .filter(|value| !value.is_empty())
        .map(|value| format!(".{value}"))
        .unwrap_or_default();
    (stem, extension)
}

fn unique_target_path(target_dir: &Path, preferred_name: &str) -> PathBuf {
    let safe_name = sanitize_filename(preferred_name);
    let (stem, extension) = split_name_parts(&safe_name);
    let mut candidate = target_dir.join(format!("{stem}{extension}"));
    let mut index = 2usize;

    while candidate.exists() {
        candidate = target_dir.join(format!("{stem}-{index}{extension}"));
        index += 1;
    }

    candidate
}

fn store_file_bytes(app: &AppHandle, file_name: &str, bytes: &[u8]) -> Result<StoredFilePayload, String> {
    let storage_dir = resolve_selected_dir(app)?;
    ensure_directory(&storage_dir)?;
    let target_path = unique_target_path(&storage_dir, file_name);
    fs::write(&target_path, bytes).map_err(|error| error.to_string())?;

    Ok(StoredFilePayload {
        stored_file_path: normalize_string_path(target_path.clone()),
        file_url: path_to_file_url(&target_path)?,
    })
}

fn move_file_with_fallback(source: &Path, target: &Path) -> Result<(), String> {
    match fs::rename(source, target) {
        Ok(_) => Ok(()),
        Err(_) => {
            fs::copy(source, target).map_err(|error| error.to_string())?;
            fs::remove_file(source).map_err(|error| error.to_string())
        }
    }
}

fn build_storage_payload(app: &AppHandle, changed: bool) -> Result<FileStorageSettingsPayload, String> {
    let current_dir = resolve_selected_dir(app)?;
    let default_dir = default_storage_dir(app)?;

    Ok(FileStorageSettingsPayload {
        available: true,
        current_dir: normalize_string_path(current_dir),
        default_dir: normalize_string_path(default_dir),
        changed,
    })
}

fn infer_mime_type_from_path(path: &Path) -> String {
    let normalized = path.to_string_lossy().to_lowercase();
    if normalized.ends_with(".md")
        || normalized.ends_with(".markdown")
        || normalized.ends_with(".mdown")
        || normalized.ends_with(".mkd")
        || normalized.ends_with(".mkdn")
    {
        "text/markdown".to_string()
    } else if normalized.ends_with(".txt") {
        "text/plain".to_string()
    } else if normalized.ends_with(".pdf") {
        "application/pdf".to_string()
    } else if normalized.ends_with(".docx") {
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document".to_string()
    } else if normalized.ends_with(".png") {
        "image/png".to_string()
    } else if normalized.ends_with(".jpg") || normalized.ends_with(".jpeg") {
        "image/jpeg".to_string()
    } else if normalized.ends_with(".gif") {
        "image/gif".to_string()
    } else if normalized.ends_with(".webp") {
        "image/webp".to_string()
    } else if normalized.ends_with(".bmp") {
        "image/bmp".to_string()
    } else if normalized.ends_with(".svg") {
        "image/svg+xml".to_string()
    } else {
        String::new()
    }
}

#[tauri::command]
fn get_file_storage_settings(app: AppHandle) -> Result<FileStorageSettingsPayload, String> {
    build_storage_payload(&app, false)
}

#[tauri::command]
async fn pick_file_storage_directory(app: AppHandle) -> Result<FileStorageSettingsPayload, String> {
    let previous_dir = resolve_selected_dir(&app)?;
    let (sender, receiver) = std::sync::mpsc::channel();

    app.dialog()
        .file()
        .set_directory(&previous_dir)
        .pick_folder(move |folder| {
            let selected = folder.and_then(|value| value.into_path().ok());
            let _ = sender.send(selected);
        });

    let selected_dir = match receiver.recv() {
        Ok(Some(path)) => path,
        Ok(None) => return build_storage_payload(&app, false),
        Err(error) => return Err(error.to_string()),
    };

    ensure_directory(&selected_dir)?;

    if same_directory(&previous_dir, &selected_dir) {
        return build_storage_payload(&app, false);
    }

    let mut settings = load_settings(&app)?;
    settings.current_dir = Some(normalize_string_path(selected_dir));
    save_settings(&app, &settings)?;

    build_storage_payload(&app, true)
}

#[tauri::command]
fn store_imported_file(app: AppHandle, file_name: String, data_base64: String) -> Result<StoredFilePayload, String> {
    let bytes = BASE64_STANDARD
        .decode(data_base64)
        .map_err(|error| error.to_string())?;
    store_file_bytes(&app, &file_name, &bytes)
}

#[tauri::command]
fn read_dropped_files(paths: Vec<String>) -> Result<Vec<DroppedFilePayload>, String> {
    let mut dropped_files = Vec::new();

    for raw_path in paths {
        let path = PathBuf::from(&raw_path);
        if !path.exists() || path.is_dir() {
            continue;
        }

        let bytes = match fs::read(&path) {
            Ok(bytes) => bytes,
            Err(_) => continue,
        };
        let metadata = match fs::metadata(&path) {
            Ok(metadata) => metadata,
            Err(_) => continue,
        };

        let file_name = path
            .file_name()
            .and_then(|value| value.to_str())
            .filter(|value| !value.is_empty())
            .unwrap_or("dropped-file")
            .to_string();

        let last_modified_ms = metadata
            .modified()
            .ok()
            .and_then(|value| value.duration_since(UNIX_EPOCH).ok())
            .map(|value| value.as_millis() as u64)
            .unwrap_or(0);

        dropped_files.push(DroppedFilePayload {
            path: normalize_string_path(path),
            file_name,
            data_base64: BASE64_STANDARD.encode(&bytes),
            mime_type: infer_mime_type_from_path(&PathBuf::from(&raw_path)),
            file_size: metadata.len(),
            last_modified_ms,
        });
    }

    Ok(dropped_files)
}

#[tauri::command]
fn migrate_managed_files(
    app: AppHandle,
    resources: Vec<ManagedResourceRecord>,
) -> Result<ManagedFileMigrationPayload, String> {
    let target_dir = resolve_selected_dir(&app)?;
    ensure_directory(&target_dir)?;

    let mut moved_count = 0usize;
    let mut skipped_count = 0usize;
    let mut failed_count = 0usize;
    let mut updated_resources = Vec::new();

    for resource in resources {
        if resource.stored_file_path.trim().is_empty() {
            skipped_count += 1;
            continue;
        }

        let source_path = PathBuf::from(&resource.stored_file_path);
        if !source_path.exists() {
            skipped_count += 1;
            continue;
        }

        if source_path
            .parent()
            .map(|parent| same_directory(parent, &target_dir))
            .unwrap_or(false)
        {
            updated_resources.push(ManagedResourceUpdate {
                id: resource.id,
                stored_file_path: normalize_string_path(source_path.clone()),
                file_url: path_to_file_url(&source_path)?,
            });
            skipped_count += 1;
            continue;
        }

        let preferred_name = resource
            .file_name
            .as_deref()
            .filter(|value| !value.trim().is_empty())
            .map(sanitize_filename)
            .or_else(|| {
                source_path
                    .file_name()
                    .and_then(|value| value.to_str())
                    .map(sanitize_filename)
            })
            .unwrap_or_else(|| "card-file".to_string());

        let target_path = unique_target_path(&target_dir, &preferred_name);
        match move_file_with_fallback(&source_path, &target_path) {
            Ok(_) => {
                moved_count += 1;
                updated_resources.push(ManagedResourceUpdate {
                    id: resource.id,
                    stored_file_path: normalize_string_path(target_path.clone()),
                    file_url: path_to_file_url(&target_path)?,
                });
            }
            Err(_) => {
                failed_count += 1;
            }
        }
    }

    Ok(ManagedFileMigrationPayload {
        moved_count,
        skipped_count,
        failed_count,
        updated_resources,
    })
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_file_storage_settings,
            pick_file_storage_directory,
            store_imported_file,
            read_dropped_files,
            migrate_managed_files
        ])
        .run(tauri::generate_context!())
        .expect("error while running resource workbench desktop");
}
