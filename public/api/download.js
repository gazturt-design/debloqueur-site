// api/download.js — Vercel serverless, code fixe, binaire lu depuis private/

const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "méthode non autorisée" });
  }

  const { code } = req.body || {};
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
