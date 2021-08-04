import { createWorker } from "https://deno.land/x/dectyl@0.9.1/mod.ts";

await Deno.permissions.request({ name: "read" });
await Deno.permissions.request({ name: "net" });

const denoGraph = await createWorker("./main.ts", {
  name: "denoGraph",
  bundle: false,
});

(async () => {
  for await (const log of denoGraph.logs) {
    console.log(`[${denoGraph.name}]: ${log}`);
  }
})();

const listenOptions = { hostname: "localhost", port: 8080 };
await denoGraph.listen(listenOptions);
console.log(
  `Listening on: http://${listenOptions.hostname}:${listenOptions.port}/`,
);
