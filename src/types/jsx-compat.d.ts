// Bridge for libraries that reference the global JSX namespace (removed in React 19 types)
// This restores the global JSX namespace needed by @ark-ui/react (used by Chakra UI v3)

declare namespace JSX {
  type Element = React.JSX.Element;
  type ElementClass = React.JSX.ElementClass;
  type IntrinsicElements = React.JSX.IntrinsicElements;
  type IntrinsicAttributes = React.JSX.IntrinsicAttributes;
  type IntrinsicClassAttributes<T> = React.JSX.IntrinsicClassAttributes<T>;
  type ElementAttributesProperty = React.JSX.ElementAttributesProperty;
  type ElementChildrenAttribute = React.JSX.ElementChildrenAttribute;
}
