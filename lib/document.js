import mammoth from "mammoth";

export const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;
export const MAX_DOCUMENT_TEXT_LENGTH = 12_000;

const SUPPORTED_EXTENSIONS = new Set([".docx", ".pdf", ".txt", ".md", ".csv"]);

function getExtension(fileName) {
  const match = String(fileName || "").toLowerCase().match(/\.[a-z0-9]+$/);
  return match?.[0] || "";
}

function cleanText(text) {
  return text.replace(/\u0000/g, "").replace(/\r\n?/g, "\n").trim();
}

async function extractPdfText(buffer) {
  const canvas = await import("@napi-rs/canvas");
  globalThis.DOMMatrix ??= canvas.DOMMatrix;
  globalThis.ImageData ??= canvas.ImageData;
  globalThis.Path2D ??= canvas.Path2D;

  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

export async function extractDocumentText(fileName, buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error("文件内容为空，请重新导出并上传。");
  }
  if (buffer.length > MAX_DOCUMENT_BYTES) {
    throw new Error("文件超过 4 MB，请压缩文件或导出较短版本。");
  }
  const extension = getExtension(fileName);
  if (!SUPPORTED_EXTENSIONS.has(extension)) {
    throw new Error("暂支持 DOCX、PDF、TXT、Markdown 和 CSV；请从钉钉文档导出为 DOCX 或 PDF。");
  }

  let text;
  if (extension === ".docx") {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else if (extension === ".pdf") {
    text = await extractPdfText(buffer);
  } else {
    text = new TextDecoder("utf-8").decode(buffer);
  }

  const cleanedText = cleanText(text);
  if (!cleanedText) {
    throw new Error(extension === ".pdf"
      ? "PDF 未提取到可读文字，可能是扫描件；请先通过 OCR 转为可搜索文本。"
      : "文件中没有可分析的文字内容。");
  }
  return {
    text: cleanedText.slice(0, MAX_DOCUMENT_TEXT_LENGTH),
    truncated: cleanedText.length > MAX_DOCUMENT_TEXT_LENGTH,
  };
}
