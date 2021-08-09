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
        <div class={tw`px-12 py-10`}>
          <label for="url">Root Module Specifier:</label>
          <div class={tw`w-full my-2`}>
            <i
              class={tw`ml-3 fill-current text-gray-400 text-xs z-10` +
                " fas fa-link"}
            >
            </i>
            <input
              type="text"
              placeholder="URL"
              name="url"
              id="url"
              class={tw
                `-mx-6 px-8 w-full border rounded py-2 text-gray-700 focus:outline-none`}
            />
          </div>
          <button
            type="submit"
            class={tw
              `w-full py-2 rounded-full bg-green-600 text-gray-100 focus:outline-none`}
          >
            Graph
          </button>
        </div>
      </form>
    );
  }
}
