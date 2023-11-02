import { WorkerTest } from "@flare-city/test";
import { expect, test, describe } from "vitest";
import type { GetAllPostsApiResponse } from "./post.crud";

describe("GET /post", () => {
  let worker: WorkerTest;

  test("Should response with 2 entries", async () => {
    worker = new WorkerTest(global.worker);
    const res = await worker.get<GetAllPostsApiResponse>({
      endpoint: "/post",
    });
    expect(res.json.data).toHaveLength(2);
  });
});
