import { all as properties } from "known-css-properties";
import camelCaseCSS from "camelcase-css";
import htmlElementAttributes from "react-html-attributes";
import validAttr from "./validAttr.js";

const cssObject = {};

const cssAndAttributes = [];

for (var i = 0; i < properties.length; i++) {
  const camelCased = camelCaseCSS(properties[i]);
  cssObject[camelCased] = camelCased;
  if (validAttr(camelCased)) {
    cssAndAttributes.push(camelCased);
  }
}

const cssAndAttributesSvg = [];
const cssAndAttributesNotSvg = [];

const cssAndAttributesTypes = {};
for (var i = 0; i < cssAndAttributes.length; i++) {
  for (let key in htmlElementAttributes) {
    if (key === "elements") continue;
    if (htmlElementAttributes[key].indexOf(cssAndAttributes[i]) >= 0) {
      if (!cssAndAttributesTypes[key]) cssAndAttributesTypes[key] = [];
      cssAndAttributesTypes[key].push(cssAndAttributes[i]);
    }
  }

  if (htmlElementAttributes.svg.indexOf(cssAndAttributes[i]) >= 0) {
    cssAndAttributesSvg.push(cssAndAttributes[i]);
  } else {
    cssAndAttributesNotSvg.push(cssAndAttributes[i]);
  }
}

// Things that are valid css properties and element attributes, organized by element type
// This should make it easy to see which ones should always be considered style props (color, width, height, etc) ...
// ... so long as there is a way to force it as an attribute (like "attrColor")
console.log("cssAndAttributesTypes", cssAndAttributesTypes);

// Things that are valid css properties and element attributes
//console.log('cssAndAttributes', cssAndAttributes);

// Things that are valid css properties and SVG attributes
//console.log('cssAndAttributesSvg', cssAndAttributesSvg);

// Things that are valid css properties but not on SVG (doesn't include one's on svg AND others)
// This is so we can get a sense of how much over overlap is SVG related.
//console.log('cssAndAttributesNotSvg', cssAndAttributesNotSvg);

export default cssObject;
