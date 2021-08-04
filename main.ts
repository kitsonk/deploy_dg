import {
  Application,
  HttpError,
  Router,
} from "https://deno.land/x/oak@v8.0.0/mod.ts";
import * as colors from "https://deno.land/std@0.102.0/fmt/colors.ts";
import {
  createGraph,
  load,
} from "https://raw.githubusercontent.com/kitsonk/deno_graph/03c9947ee9df4bdf06a3ec9923270bdecf8cbde6/mod.ts";

const router = new Router();

router.get("/", async (ctx) => {
  const graph = await createGraph(
    "https://raw.githubusercontent.com/kitsonk/deploy_dg/main/main.ts",
    {
      load,
    },
  );
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

app.addEventListener("error", (evt) => {
  let msg = `[${colors.red("error")}] `;
  if (evt.error instanceof Error) {
    msg += `${evt.error.name}: ${evt.error.message}`;
  } else {
    msg += Deno.inspect(evt.error);
  }
  if (
    (evt.error instanceof HttpError && evt.error.status >= 400 &&
      evt.error.status <= 499)
  ) {
    if (evt.context) {
      msg += `\n\nrequest:\n  url: ${evt.context.request.url}\n  headers: ${
        Deno.inspect([...evt.context.request.headers])
      }\n`;
    }
  }
  if (evt.error instanceof Error && evt.error.stack) {
    const stack = evt.error.stack.split("\n");
    stack.shift();
    msg += `\n\n${stack.join("\n")}\n`;
  }
  console.error(msg);
});

addEventListener("fetch", app.fetchEventHandler());
