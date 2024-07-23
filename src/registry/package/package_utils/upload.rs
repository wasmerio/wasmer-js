use bytes::Bytes;
use std::collections::BTreeMap;
use tokio::io::AsyncBufReadExt as _;

// Upload a package to a signed url.
pub async fn upload(bytes: Bytes, signed_url: &str) -> anyhow::Result<String> {
    let client = reqwest::Client::builder()
        .default_headers(reqwest::header::HeaderMap::default())
        .build()
        .unwrap();

    let res = client
        .request(reqwest::Method::POST, signed_url)
        .header(reqwest::header::CONTENT_LENGTH, "0")
        .header(reqwest::header::CONTENT_TYPE, "application/octet-stream")
        .header("x-goog-resumable", "start")
        .header(reqwest::header::ACCEPT, "*/*")
        .header(reqwest::header::ACCESS_CONTROL_ALLOW_HEADERS, "*")
        .header(reqwest::header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
        .header(reqwest::header::ACCESS_CONTROL_ALLOW_METHODS, "*")
        .header(reqwest::header::ACCESS_CONTROL_MAX_AGE, "43200");

    let result = res.send().await?;

    if result.status() != reqwest::StatusCode::from_u16(201).unwrap() {
        return Err(anyhow::anyhow!(
            "Uploading package failed: got HTTP {:?} when uploading",
            result.status()
        ));
    }

    let headers = result
        .headers()
        .into_iter()
        .filter_map(|(k, v)| {
            let k = k.to_string();
            let v = v.to_str().ok()?.to_string();
            Some((k.to_lowercase(), v))
        })
        .collect::<BTreeMap<_, _>>();

    let session_uri = headers
        .get("location")
        .ok_or_else(|| {
            anyhow::anyhow!("The upload server did not provide the upload URL correctly")
        })?
        .clone();

    //* XXX: If the package is large this line may result in
    // * a surge in memory use.
    // *
    // * In the future, we might want a way to stream bytes
    // * from the webc instead of a complete in-memory
    // * representation.
    // */
    let total_bytes = bytes.len();

    let chunk_size = 2_097_152; // 2MB

    let mut reader = tokio::io::BufReader::with_capacity(chunk_size, &bytes[..]);
    let mut cursor = 0;

    while let Some(chunk) = reader.fill_buf().await.ok().map(|s| s.to_vec()) {
        let n = chunk.len();

        if chunk.is_empty() {
            break;
        }

        let start = cursor;
        let end = cursor + chunk.len().saturating_sub(1);
        let content_range = format!("bytes {start}-{end}/{total_bytes}");

        let res = client
            .put(&session_uri)
            .header(reqwest::header::CONTENT_TYPE, "application/octet-stream")
            .header(reqwest::header::CONTENT_LENGTH, format!("{}", chunk.len()))
            .header("Content-Range".to_string(), content_range)
            .body(chunk.to_vec());

        let res = res.send().await;
        res.map(|response| response.error_for_status())
            .map_err(|e| {
                anyhow::anyhow!(
                    "cannot send request to {session_uri} (chunk {}..{}): {e}",
                    cursor,
                    cursor + chunk_size
                )
            })??;

        if n < chunk_size {
            break;
        }

        reader.consume(n);
        cursor += n;
    }
    Ok(signed_url.to_string())
}
