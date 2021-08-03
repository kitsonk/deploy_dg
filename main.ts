import { Application, Router } from "https://deno.land/x/oak@v8.0.0/mod.ts";
import { createGraph } from "https://raw.githubusercontent.com/kitsonk/deno_graph/main/mod.ts";

const router = new Router();

router.get("/", async (ctx) => {
  const graph = await createGraph("https://deno.land/x/oak@v8.0.0/mod.ts", {
    load(specifier) {
      return Promise.resolve({
        specifier,
        headers: {
          "conent-type": "application/typescript",
        },
        content: `console.log("hello deploy");`,
      });
    },
  });
  ctx.response.body = `<!DOCTYPE html><html>
  <body>
    <h1>Graph</h1>
    <pre>${graph}</pre>
  <body>
  </html>`;
  ctx.response.type = "html";
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

addEventListener("fetch", app.fetchEventHandler());
