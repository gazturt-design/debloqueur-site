// api/download.js — Vercel serverless, code fixe 1234, binaire lu depuis private/

const fs = require("fs");
const path = require("path");

function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return {};
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "méthode non autorisée" });
  }

  const body = parseBody(req);
  const code = body.code;

  if (typeof code !== "string" || code.trim() !== "1234")
    return res.status(403).json({ error: "code invalide" });

  const filePath = path.join(process.cwd(), "private", "debloqueur.exe");
  let buf;
  try { buf = fs.readFileSync(filePath); }
  catch { return res.status(500).json({ error: "binaire indisponible" }); }

  res.setHeader("content-type", "application/octet-stream");
  res.setHeader("content-disposition", 'attachment; filename="debloqueur.exe"');
  res.setHeader("content-length", buf.length);
  res.setHeader("cache-control", "no-store");
  return res.send(buf);
};
