const fs = require("fs")
const path = require("path")

const root = path.join(__dirname, "..", "node_modules")
const needle = "var SlowBuffer = require('buffer').SlowBuffer;"
const patched = "var SlowBuffer = require('buffer').SlowBuffer || require('buffer').Buffer;"

function walk(dir) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (!entry.isDirectory()) continue
    if (entry.name === "buffer-equal-constant-time") {
      const file = path.join(full, "index.js")
      if (!fs.existsSync(file)) continue
      const source = fs.readFileSync(file, "utf8")
      if (source.includes(patched)) continue
      if (!source.includes(needle)) continue
      fs.writeFileSync(file, source.replace(needle, patched))
      console.log("Patched", path.relative(root, file))
      continue
    }
    if (entry.name === ".git") continue
    walk(full)
  }
}

walk(root)
