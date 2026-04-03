/**
 * ローカル開発用HTTPサーバ
 * 使用方法: node Server.js
 */
const Http = require("http");
const Https = require("https");
const Fs = require("fs");
const Path = require("path");
const Url = require("url");

const PORT = 3000;

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

/**
 * APIプロキシ（CORS回避用）
 */
function ProxyRequest(TargetUrl, Headers, Res) {
    Https.get(TargetUrl, { headers: Headers }, (ProxyRes) => {
        let Body = "";
        ProxyRes.on("data", (Chunk) => { Body += Chunk; });
        ProxyRes.on("end", () => {
            Res.writeHead(ProxyRes.statusCode, { "Content-Type": "application/json; charset=utf-8" });
            Res.end(Body);
        });
    }).on("error", (Err) => {
        Res.writeHead(502, { "Content-Type": "text/plain" });
        Res.end("Proxy error: " + Err.message);
    });
}

const Server = Http.createServer((Req, Res) => {
    const Parsed = Url.parse(Req.url, true);
    const Pathname = Parsed.pathname;

    // 国土交通DPF APIプロキシ
    if (Pathname === "/api/mlit") {
        const Query = new URLSearchParams(Parsed.query).toString();
        const TargetUrl = "https://www.reinfolib.mlit.go.jp/ex-api/external/XIT001?" + Query;
        ProxyRequest(TargetUrl, { "Ocp-Apim-Subscription-Key": Parsed.query.apikey || "" }, Res);
        return;
    }

    // ホットペッパーグルメAPIプロキシ
    if (Pathname === "/api/hotpepper/gourmet") {
        const Query = new URLSearchParams(Parsed.query).toString();
        const TargetUrl = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?" + Query + "&format=json";
        ProxyRequest(TargetUrl, {}, Res);
        return;
    }

    // ホットペッパージャンルAPIプロキシ
    if (Pathname === "/api/hotpepper/genre") {
        const Query = new URLSearchParams(Parsed.query).toString();
        const TargetUrl = "https://webservice.recruit.co.jp/hotpepper/genre/v1/?" + Query + "&format=json";
        ProxyRequest(TargetUrl, {}, Res);
        return;
    }

    // 静的ファイル配信
    let FilePath = "." + Pathname;

    if (FilePath === "./") {
        FilePath = "./index.html";
    }

    const Ext = Path.extname(FilePath).toLowerCase();
    const ContentType = MIME_TYPES[Ext] || "application/octet-stream";

    Fs.readFile(FilePath, (Err, Content) => {
        if (Err) {
            if (Err.code === "ENOENT") {
                Res.writeHead(404, { "Content-Type": "text/plain" });
                Res.end("404 Not Found");
            } else {
                Res.writeHead(500, { "Content-Type": "text/plain" });
                Res.end("500 Internal Server Error");
            }
            return;
        }

        Res.writeHead(200, { "Content-Type": ContentType });
        Res.end(Content);
    });
});

Server.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
});
