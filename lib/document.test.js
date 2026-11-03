import test from "node:test";
import assert from "node:assert/strict";
import { extractDocumentText, MAX_DOCUMENT_BYTES } from "./document.js";

test("extracts UTF-8 text from a DingTalk-exported text file", async () => {
  const result = await extractDocumentText("需求说明.md", Buffer.from("# 新需求\n优化产品首次使用体验。", "utf8"));
  assert.equal(result.text, "# 新需求\n优化产品首次使用体验。");
  assert.equal(result.truncated, false);
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
