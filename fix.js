const fs = require("fs");
const path = require("path");

const filePath = path.join("C:\\Users\\INTEL\\Desktop\\Bilwashree jewels\\app\\page.js");

// Backup first
fs.copyFileSync(filePath, filePath + ".bak_" + Date.now());
console.log("✅ Backup created");

const lines = fs.readFileSync(filePath, "utf8").split("\n");
let depth = 0;
const toRemove = new Set();

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const opens  = (line.match(/<div[\s\/>]/g)||[]).length + (line.match(/<div>$/)||[]).length;
  const closes = (line.match(/<\/div>/g)||[]).length;
  depth += opens - closes;
  if (depth < 0) {
    console.log(`🗑️  Orphan </div> at line ${i+1}: "${line.trim()}"`);
    toRemove.add(i);
    depth = 0;
  }
}

if (toRemove.size === 0) {
  console.log("✅ No orphan </div> found! Checking other issues...");
} else {
  console.log(`\n🔧 Removing ${toRemove.size} orphan line(s)...`);
  const fixed = lines.filter((_, i) => !toRemove.has(i));
  fs.writeFileSync(filePath, fixed.join("\n"), "utf8");

  // Re-verify
  const result = fixed.join("\n");
  const openCount  = (result.match(/<div[\s\/>]|<div>/g)||[]).length;
  const closeCount = (result.match(/<\/div>/g)||[]).length;
  console.log(`\n📊 Final: Open=${openCount} Close=${closeCount} Diff=${openCount-closeCount}`);

  if (openCount === closeCount) {
    console.log("✅ JSX is BALANCED! Run: npm run build");
  } else {
    console.log("⚠️  Still unbalanced. Run the script again.");
  }
}