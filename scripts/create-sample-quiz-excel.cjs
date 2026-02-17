const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Quiz upload format: questionNumber, date, question, option1, option2, option3, correctAnswer
const headerRow = [
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
    "2026-02-18",
    "ރަމަޟާން މިއަދު ކިޔާލުމުގެ އަދަހަށް ކޯޓަކަށް އޮތް ސުވާލު ކޮންބޯނީ؟",
    "އިސްލާމް",
    "އިއްތިޔާރު",
    "މުސްލިމުން",
    "އިސްލާމް",
  ],
  [
    "2",
    "2026-02-19",
    "ޤުރުއާން ކުރިމަތީ އަހަރު ކިތިކޮން؟",
    "23",
    "24",
    "25",
    "23",
  ],
  [
    "3",
    "2026-02-20",
    "ސަލާމް ކިޔާލުމުގެ އަދަހު ކޮން ބަހެއްތަކުން ލިޔެވޭނީ؟",
    "އަސްސަލާމު އަލައިކުމް",
    "އަސްސަލާމު އަލައިކުމް ވަރަށްހުރިހާއެއް",
    "އަލައިކުމް ސަލާމް",
    "އަސްސަލާމު އަލައިކުމް ވަރަށްހުރިހާއެއް",
  ],
];

const data = [headerRow, ...sampleRows];
const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Quiz");

const outDir = path.join(__dirname, "..", "public", "assets", "files");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outPath = path.join(outDir, "Sample_Quiz_Upload.xlsx");
XLSX.writeFile(wb, outPath);

console.log("Created:", outPath);
