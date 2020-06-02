use serde::Deserialize;

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  // your custom commands
  // multiple arguments are allowed
  // note that rename_all = "camelCase": you need to use "performRequest" on JS
  PerformRequest {
    endpoint: String,
    body: Vec<String>,
    callback: String,
    error: String,
  },
}
