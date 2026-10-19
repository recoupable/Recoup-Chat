import { expect, it } from "vitest";
import { parseSurfaceStream } from "../parseSurfaceStream";

it("observes cancellation while suspended at an unterminated final event", async () => {
  const event = { type: "surface.complete", surfaceId: "example", revision: 0 };
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(JSON.stringify(event)));
      controller.close();
    },
  });
  const controller = new AbortController();
  const iterator = parseSurfaceStream(stream, { signal: controller.signal });
  expect((await iterator.next()).value).toEqual(event);
  controller.abort();
  await expect(iterator.next()).rejects.toMatchObject({ name: "AbortError" });
  expect(stream.locked).toBe(false);
});
