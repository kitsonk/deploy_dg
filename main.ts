import {
  Application,
  HttpError,
  Router,
  Status,
} from "https://deno.land/x/oak@v8.0.0/mod.ts";
import * as colors from "https://deno.land/std@0.102.0/fmt/colors.ts";
import {
  createGraph,
  load,
} from "https://raw.githubusercontent.com/kitsonk/deno_graph/03c9947ee9df4bdf06a3ec9923270bdecf8cbde6/mod.ts";

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = `<!DOCTYPE html><html>
  <head>
    <title>deno_graph demo</title>
  </head>
  <body>
    <h1>deno_graph demo</h1>
    <form action="/graph" method="post">
      <div>
        <label for="url">Root Specifier:</label>
        <input type="text" id="url" name="url" placeholder="https://deno.land/std/examples/chat/server.ts" required>
      </div>
      <div>
        <button type="submit">Get Graph!</button>
      </div>
    </form>
  <body>
  </html>`;
  ctx.response.type = "html";
});

router.post("/graph", async (ctx) => {
  if (!ctx.request.hasBody) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = "Bad Request";
    return;
  }
  const body = ctx.request.body();
  let rootSpecifier: string;
  switch (body.type) {
    case "form": {
      const bodyValue = await body.value;
      const rs = bodyValue.get("url");
      if (!rs) {
        ctx.response.status = Status.BadRequest;
        ctx.response.body = "Bad Request";
        return;
      }
      rootSpecifier = rs;
      break;
    }
    case "form-data": {
      const bodyValue = await body.value.read();
      rootSpecifier = bodyValue.fields["url"];
      break;
    }
    default:
      ctx.response.status = Status.BadRequest;
      ctx.response.body = "Bad Request";
      return;
  }
  ctx.response.body = () => createGraph(rootSpecifier, { load });
  ctx.response.type = "json";
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
