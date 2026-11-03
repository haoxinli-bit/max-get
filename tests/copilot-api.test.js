import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/copilot.js";

function mockResponse() {
  return {
    headers: {},
    statusCode: 200,
    payload: undefined,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

test("Copilot API rejects unsupported methods", async () => {
  const response = mockResponse();
  await handler({ method: "GET", headers: {} }, response);
  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.Allow, "POST");
});

test("Copilot API rejects requests from missing or foreign origins", async () => {
  const response = mockResponse();
  await handler({ method: "POST", headers: { host: "maxget.test", "content-type": "application/json" } }, response);
  assert.equal(response.statusCode, 403);

  const foreignResponse = mockResponse();
  await handler({
    method: "POST",
    headers: { host: "maxget.test", origin: "https://attacker.example", "content-type": "application/json" },
  }, foreignResponse);
  assert.equal(foreignResponse.statusCode, 403);
});

test("Copilot API requires a supported bearer token before processing requests", async () => {
  const response = mockResponse();
  await handler({
    method: "POST",
    headers: {
      host: "maxget.test",
      origin: "https://maxget.test",
      authorization: "Bearer ghp_classic-token",
      "content-type": "application/json",
    },
    async *[Symbol.asyncIterator]() { yield Buffer.from('{"action":"models"}'); },
  }, response);
  assert.equal(response.statusCode, 401);
});

test("Copilot API rejects unsupported content types without starting a model runtime", async () => {
  const response = mockResponse();
  await handler({
    method: "POST",
    headers: {
      host: "maxget.test",
      origin: "https://maxget.test",
      authorization: `Bearer gho_${"a".repeat(32)}`,
      "content-type": "text/plain",
    },
    async *[Symbol.asyncIterator]() {},
  }, response);
  assert.equal(response.statusCode, 415);
});
