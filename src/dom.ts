import { Observer, subscribe } from "./observer";
import type { WritableKeys } from "./types";

export type HTMLElementAttribute = {
  [K in WritableKeys<HTMLElement>]?: HTMLElement[K] | Observer<HTMLElement[K]>;
};

// This is a mess and is only really meant to test threads.ts
// I would like to test some ideas with it though like compiling templates at some point

/*
// Afternote: I think this template pattern is similar to what mikado does.
// And I'm unsure if this is what Vue does, but template format and dataset tags remind me of Vue
// hooks could work similar to react, although I'd like to explore those ideas a bit more.

// detect value being destructured
template(
  ({ value }) => 
    html`
      <button data-template-add onclick=${ () => value += 1 }>+</button>
      <span data-template-value>${value ?? 0}</span>
      <button data-template-sub onclick=${ () => value -= 1 }>-</button>
    `
)

<template>
  <button data-template-add>+</button>
  <span data-template-value></span>
  <button data-template-sub>-</button>
</template>

templateData = {
  // Inherit state
  add: ({ value }) => ({
    attributes: {
      onclick: (event) => value += 1
    }
  }),
  value({ value }): {
    hooks: [
      [[value], () => selectedElements.value.innerText = value ?? 0]
    ]
  },
  sub: ({ value }) => ({
    attributes: {
      onclick: (event) => value -= 1
    }
  }),
}

state = { value: proxy(0) }
el = clone template deep: true
selectedElements = { ... }
for each template item in templateData
  for each name, attr in item
    el.setAttribute name, attr

  for each hook in item
    subscribe.call(null, hook)
*/

const h = <T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  attrs: HTMLElementAttribute,
  ...children: (unknown | Observer<unknown>)[]
) => {
  const el = document.createElement(tagName);

  if (attrs) {
    for (const name in attrs) {
      let value = attrs[name as keyof typeof attrs];
      if (el.hasAttribute(name) && typeof value === "string") {
        el.setAttribute(name, value);
      } else {
        // fix this
        subscribe(value as Observer<typeof value>, (val) => {
          Reflect.set(el, name, val);
        });
      }
    }
  }

  children.map((child, i) => {
    let node: Node;
    if (typeof child === "string") node = document.createTextNode(child);
    subscribe(child, (val) => {
      if (!(val instanceof Node)) {
        // If the value is not a Node then toString
        (node ??= document.createTextNode("")).nodeValue = `${val}`;
      } else {
        if (node) {
          el.replaceChild(node, val);
        }
        node ??= val;
      }
      // If the node is already in the other node, append will not do anything
      el.append(node);
    });
  });

  return el;
};

export { h };

// I wanted to see how simple I could make much of the JSX declarations here
declare namespace h {
  export namespace JSX {
    type Element = HTMLElement | SVGElement | DocumentFragment;

    type ElementAttributesProperty = {};
    type ElementChildrenAttribute = {};
    type IntrinsicAttributes = {};

    type IntrinsicElements = {
      [K in keyof HTMLElementTagNameMap]: HTMLElementAttribute;
    };
  }
}
