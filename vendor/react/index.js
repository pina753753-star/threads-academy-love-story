export const StrictMode = ({ children }) => children;

export function createElement(type, props, ...children) {
  return { type, props: props ?? {}, children: children.flat(Infinity) };
}

export default { StrictMode, createElement };
