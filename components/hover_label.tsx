/** @jsx h */
import { Component, h, tw } from "../deps.ts";

interface HoverLabelProps {
  children?: unknown;
  tooltip: unknown;
}

export class HoverLabel extends Component<HoverLabelProps> {
  render() {
    return (
      <div
        class={tw
          `group cursor-pointer relative inline-block border-b border-gray-400 text-right w-52 font-medium mr-4`}
      >
        {this.props.children}
        <div
          class={tw
            `opacity-0 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 w-52 group-hover:opacity-100 bottom-full -left-1/2 ml-14 px-3 pointer-events-none`}
        >
          {this.props.tooltip}
          <svg
            class={tw`absolute text-black h-2 w-full left-0 top-full`}
            x="0px"
            y="0px"
            viewBox="0 0 255 255"
            xml:space="preserve"
          >
            <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
          </svg>
        </div>
      </div>
    );
  }
}
