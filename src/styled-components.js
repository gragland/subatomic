import React from 'react';
import { createSubatomic as createSubatomicBase } from './subatomic.js';
import styled from 'styled-components';
// We can't import directly from styled-components/src because ...
// ... we'd want webpack to treat as external (not bundle with lib), but consuming project ...
// ... won't be able to parse depending on their babel/webpack. Also it breaks our lib if sc changes.
//import isHtmlAttribute from "styled-components/src/utils/validAttr";
import isHtmlAttribute from './validAttr.js'; // Exact copy of file above (minus flow types)
// We could wrap final element in styled() to filter out attributes (but performance hit?)
// Or we could use @emotion/is-prop-valid and bundle with lib since we're taking a file size hit anyway
// That way we at least use the same attribute filtering logic across style libs
// If we do that than move isValidAttribute() logic to subatomic.js
//import isHtmlAttribute from "@emotion/is-prop-valid";
import blacklistedAttributes from './blacklisted-attributes.js';

export default tag => {
  return props => {
    const Subatomic = createSubatomic(tag);
    return React.createElement(Subatomic, props);
  };
};

function createSubatomic(tag) {
  return createSubatomicBase(
    tag,
    getComponent,
    // We pass this in so that we can re-use emotion/sc whitelist for lower bundle size
    isValidAttribute
  );
}

function getComponent(
  tag, // string or component
  styleBuilder,
  componentNumber
) {
  let createStyled;

  if (typeof tag === 'string') {
    // We now filter using isValidAttribute()
    //const Root = styled(tag)``; // So whitelist filters out invalid element attributes

    const Filter = props => {
      // Only pass props to DOM element if they are valid html attributes
      let next = {};
      for (let key in props) {
        if (isValidAttribute(key)) {
          next[key] = props[key];
        }
      }

      // RECENT EXPERIMENT
      //const Root = styled(tag).attrs(next)``;
      //return React.createElement(Root);

      return React.createElement(tag, next);

      // No longer created a root element wrapped with styled() because we do filtering above
      //return React.createElement(Root, next);
    };

    // Manually setting displayName based on tag is necessary otherwise displayName will always be ...
    // ... hashed version of "createStyled" and may already have a "sc-component-id" comment marker in <head> ...
    // ... causing styled generated from props to be inserted above interpolated style ...
    // ... resulting in prop style being overriden.
    // NOTE: createStyled`${styleBuilder}` needs to be on its own line (like it is currently) ...
    // ... as opposed to doing styled(Filter).withConfig()`${styleBuilder}` otherwise there are ...
    // ... issues with style inheritance. Probably a bug with babel plugin.
    createStyled = styled(Filter)
      .attrs({ suppressClassNameWarning: true })
      .withConfig({
        displayName: `Tag-${tag}`
      });
  } else {
    // This appears to work but to be safe sticking with original code for now
    // Pretty sure we ran into style inheritance issues that were solved by generating classname now ...
    // ... rather then in root subatomic element.
    //return tag;

    // Since we can't rely on tag (a function) to have a displayName ...
    // ... we use componentNumber (its future index in the component cache, same on both server and client)
    // This ensures that the same className hash is generated on both server and client
    // NOTE: Ideally we could just `return tag` here since prop style get regenerated at root anyway ...
    // ... but this caused css ordering issues
    createStyled = styled(tag)
      .attrs({ suppressClassNameWarning: true })
      .withConfig({
        //displayName: `Tag()-${tag.displayName || 'unknown'}`
        displayName: `Tag()-${componentNumber}`
      });
  }

  return createStyled`
    ${styleBuilder};
  `;
}

function isValidAttribute(attribute) {
  return (
    isHtmlAttribute(attribute) &&
    blacklistedAttributes.indexOf(attribute) === -1
  );
}
