/**
 * Creates a sample Excel file for quiz question upload.
 * Run from project root: node scripts/create-sample-quiz-excel.cjs
 * Output: public/assets/files/Sample_Quiz_Upload.xlsx
 */

const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const headers = [
  "questionNumber",
  "date",
  "question",
  "option1",
  "option2",
  "option3",
  "correctAnswer",
];

const sampleRows = [
  [
    "1",
    new Date("2026-02-18"),
    "ރަމަޟާން މުޅިން ކުރީ ކިޔާ އެއް އިސްލާމް ކުރުމެއް ކީހެވެ؟",
    "އިސްލާމް",
    "އިއްތިޔާރު",
    "މުސްލިމުން",
    "އިސްލާމް",
  ],
  [
    "2",
    new Date("2026-02-19"),
    "އަލްގުރުއާން އަބުލައްލައިސް އަލަށް ދިނި އުމުރު ކިތަ؟",
    "23",
    "24",
    "25",
    "23",
  ],
  [
    "3",
    new Date("2026-02-20"),
    "ސަލާމް ބަޔާން ލިޔުމުގެ ގޮތް ރަނގަޅު ކޮބައިން ކީހެވެ؟",
    "އަސްސަލާމު އަލައިކުމް",
    "އަސްސަލާމުއަލައިކުމް",
    "ސަލާމު އަލައިކުމް",
    "އަސްސަލާމު އަލައިކުމް",
  ],
];

const data = [headers, ...sampleRows];
const ws = XLSX.utils.aoa_to_sheet(data);

// Set column widths for readability
ws["!cols"] = [
  { wch: 16 },
  { wch: 12 },
  { wch: 40 },
  { wch: 25 },
  { wch: 25 },
  { wch: 25 },
  { wch: 25 },
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Quiz Questions");

const outDir = path.join(__dirname, "..", "public", "assets", "files");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const outPath = path.join(outDir, "Sample_Quiz_Upload.xlsx");
XLSX.writeFile(wb, outPath);

console.log("Sample quiz Excel created:", outPath);
