const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT || 5500);
const ROOT = __dirname;
const DRIVE_FILE_IDS = {
  dim_municipio: "139YOCJHN29Bjm1rlc5zd9jdCNNLRqT9d",
  fato_soja: "1-pwDlBEJMBZ6k5GsAnMek89ZaXalFv-4",
  fato_clima: "1IPCCLYvk6LMjigP1iw5zxcl7v57ltFoP",
  fato_cobertura: "16FWvNeHarzOWgqoWD_Z2ZI5KcoMRGyuE",
  fato_emissao_soja: "1GDjOovnierCNvRm_gr7jOtiYI5mt7uk-",
  fato_emissao_estado: "1xBFRbe9f0p0TZKCFwzsqddmxK_3_msvx"
};

const mimeTypes = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".png": "image/png", ".jfif": "image/jpeg" };

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (requestUrl.pathname.startsWith("/api/csv/")) {
    const table = decodeURIComponent(requestUrl.pathname.slice("/api/csv/".length));
    const fileId = DRIVE_FILE_IDS[table];
    if (!fileId) return sendText(response, 404, "CSV não configurado");
    try {
      const driveResponse = await fetch(`https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=download&confirm=t`);
      if (!driveResponse.ok) return sendText(response, driveResponse.status, "Falha ao obter CSV do Drive");
      response.writeHead(200, { "Content-Type": "text/csv; charset=utf-8", "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" });
      return response.end(await driveResponse.text());
    } catch (error) {
      return sendText(response, 502, "Proxy do Drive indisponível");
    }
  }

  const filePath = path.resolve(ROOT, `.${requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname}`);
  if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return sendText(response, 404, "Arquivo não encontrado");
  response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
  return fs.createReadStream(filePath).pipe(response);
});

server.listen(PORT, () => console.log(`EcoRaiz 360 disponível em http://localhost:${PORT}`));

function sendText(response, status, text) {
  response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(text);
}