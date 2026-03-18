
const fs = require("fs");
let content = fs.readFileSync("components/calculator/project-build/CompareModal.tsx", "utf-8");

// Fix imports first
if (!content.includes("Lightbulb")) {
  content = content.replace(
    `import { X, Download } from "lucide-react";`,
    `import { X, Download, Lightbulb, Info, Check } from "lucide-react";`
  );
}

// Fix bullet points (they were probably mangled again due to UTF-8 BOM issues in PowerShell)
// The screenshot shows question mark in a diamond (replacement character).
// Let us replace it with standard HTML entity or a simple dot
content = content.replace(/<span className="text-primary mt-0\.5">.*?<\/span>/g, `<span className="text-primary mt-0.5">&bull;</span>`);
content = content.replace(/<span className={inMvp \? "text-primary mt-0\.5".*?<\/span>/g, `<span className={inMvp ? "text-primary mt-0.5" : "text-muted-foreground mt-0.5"}>&bull;</span>`);
content = content.replace(/<span className="text-muted-foreground\\smt-0\.5">.*?<\/span>/g, `<span className="text-muted-foreground mt-0.5">&bull;</span>`);

// In case the direct dots were used in add-ons
const addOnBullet = `<span className="text-muted-foreground mt-0.5"></span>`;
content = content.replace(addOnBullet, `<span className="text-muted-foreground mt-0.5">&bull;</span>`);
content = content.replace(/<span className="text-muted-foreground\\smt-0.5">.*?<\/span>/g, `<span className="text-muted-foreground mt-0.5">&bull;</span>`);


// Replace emojis with Lucide Icons
content = content.replace(
  `<span className="text-xl leading-none">??</span>`,
  `<Lightbulb className="w-5 h-5 text-primary" />`
);
content = content.replace(
  `<span className="text-xl leading-none">??</span>`,
  `<Info className="w-5 h-5 text-primary" />`
);
content = content.replace(
  `<span className="text-xl leading-none">??</span>`,
  `<Lightbulb className="w-5 h-5 text-primary" />`
);
content = content.replace(
  `<span className="text-xl leading-none">??</span>`,
  `<Info className="w-5 h-5 text-primary" />`
);

let lines = content.split("\\n");
for (let i = 0; i < lines.length; i++) {
   if (lines[i].includes("\uFFFD")) {
       lines[i] = lines[i].replace(/\uFFFD/g, "&bull;");
   }
}
content = lines.join("\\n");

fs.writeFileSync("components/calculator/project-build/CompareModal.tsx", content);
console.log("Done");

