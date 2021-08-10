/** @jsx h */
import { Component, h, tw } from "../deps.ts";

export class SpecifierForm extends Component {
  render() {
    return (
      <form
        action="/graph"
        method="post"
        class={tw`w-full bg-white rounded-lg`}
      >
        <div class={tw`w-full my-2 px-12 pt-12 space-y-6`}>
          <p>
            Deno Graph utilizes the <code>deno_graph</code>{" "}
            crate as a Web Assembly library under Deno Deploy. The{" "}
            <code>deno_graph</code>{" "}
            crate contains the module resolution logic from Deno CLI and will be
            used to replace the current logic in the near future.
          </p>
          <p>
            You can take it for a test spin by supplying a URL module specifier
            below (e.g.{" "}
            <code>https://deno.land/std/examples/chat/server.ts</code>), which
            will be fetched by the Deploy worker and analyzed, returning a
            representation of the dependency graph to your browser.
          </p>
        </div>
        <div class={tw`px-12 py-10`}>
          <label for="url">Root Module Specifier:</label>
          <div class={tw`relative w-full my-2`}>
            <span
              class={tw
                `absolute inset-y-0 left-0 flex items-center pl-2 text-gray-600`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class={tw`h-5 w-5`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="URL"
              name="url"
              id="url"
              class={tw
                `px-10 w-full border rounded py-2 text-gray-700 focus:outline-none`}
            />
          </div>
          <button
            type="submit"
            class={tw
              `w-full py-2 rounded-full bg-green-600 text-gray-100 focus:outline-none`}
          >
            Graph...
          </button>
        </div>
      </form>
    );
  }
}
