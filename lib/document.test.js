import test from "node:test";
import assert from "node:assert/strict";
import { extractDocumentText, MAX_DOCUMENT_BYTES } from "./document.js";

function createPdf(content) {
  const stream = `BT /F1 18 Tf 20 100 Td (${content}) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }
  const crossReferenceOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${crossReferenceOffset}\n%%EOF\n`;
  return Buffer.from(pdf);
}

test("extracts UTF-8 text from a DingTalk-exported text file", async () => {
  const result = await extractDocumentText("需求说明.md", Buffer.from("# 新需求\n优化产品首次使用体验。", "utf8"));
  assert.equal(result.text, "# 新需求\n优化产品首次使用体验。");
  assert.equal(result.truncated, false);
});

test("extracts text from a PDF in a Node.js runtime without DOM APIs", async () => {
  const result = await extractDocumentText("需求说明.pdf", createPdf("DingTalk request"));
  assert.match(result.text, /DingTalk request/);
});

test("rejects unsupported, empty, and oversized uploads", async () => {
  await assert.rejects(extractDocumentText("需求.doc", Buffer.from("data")), /暂支持 DOCX/);
  await assert.rejects(extractDocumentText("empty.txt", Buffer.alloc(0)), /为空/);
  await assert.rejects(extractDocumentText("large.txt", Buffer.alloc(MAX_DOCUMENT_BYTES + 1)), /超过 4 MB/);
});

test("caps extracted document text sent to Copilot", async () => {
  const result = await extractDocumentText("long.txt", Buffer.from("a".repeat(15_000)));
  assert.equal(result.text.length, 12_000);
  assert.equal(result.truncated, true);
});
