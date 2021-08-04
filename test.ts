import { createWorker } from "https://deno.land/x/dectyl@0.9.1/mod.ts";

Deno.test({
  name: "basic",
  async fn() {
    const denoGraph = await createWorker("./main.ts", {
      name: "denoGraph",
    });
    await denoGraph.run(async () => {
      const [response] = await denoGraph.fetch("/");
      console.log(await response.text());
    });
  },
});
