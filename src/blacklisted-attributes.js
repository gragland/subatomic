// These are valid attributes but we consider them style props instead
// TODO: Allow them to be passed to html element by doing attrColor
// TODO (?): Replace attribute whitelist with react-html-attributes so that attributes ...
// ... are considered invalid (and thus style props) if not valid for that element
// Then we could remove any of these where attribute has same effect as css property for the given element
// See how Glamorous does it: https://github.com/paypal/glamorous/blob/6d806889e9991065f1243d4abdce9c0b6cd3a2ae/src/should-forward-property.js
export default [
  'color', // link, svg
  'cursor', // svg
  'display', // svg
  'fontFamily', // svg
  'fontSize', // svg
  'fontStyle', // svg
  'fontWeight', // svg
  'height', // applet, canvas, embed, iframe, img, input, object, td, th, video
  'width', // applet, canvas, col, colgroup, embed, hr, iframe, img, input, object, pre, table, td, th, video
  'letterSpacing', // svg
  'opacity', // svg
  'order', // svg
  'overflow', // svg
  'size', // basefont, font, hr, input, select
  'scale', // svg
  'textDecoration', // svg
  'transform' // svg
];
