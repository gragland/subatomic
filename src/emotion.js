import React from "react";
import styled, { cx } from "react-emotion";
import { createSubatomic as createSubatomicBase } from "./subatomic.js";
import emotionIsPropValid from "@emotion/is-prop-valid";
import blacklistedAttributes from "./blacklisted-attributes.js";

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
    // Pass in so we can re-use emotion whitelist for lower bundle size
    isValidAttribute
  );
}

function getComponent(
  tag, // string or component
  styleBuilder
) {
  let createStyled;

  if (typeof tag === "string") {
    // We now filter using isValidAttribute()
    //const Root = styled(tag); // So whitelist filters out invalid element attributes

    const Filter = ({ parentClassName, ...props }) => {
      // Only pass props to DOM element if they are valid html attributes
      let next = {};
      for (let key in props) {
        if (isValidAttribute(key)) {
          next[key] = props[key];
        }
      }

      const { className, ...passProps } = next;

      return React.createElement(tag, {
        // This seems to work fine, but for now merging
        //className: `${parentClassName} ${className}`,
        // Merge to avoid any possible ordering issues
        className: cx(parentClassName, className),
        ...passProps
      });

      // No longer created a root element wrapped with styled() because we do filtering above
      //return <Root {...passProps} className={cx(parentClassName, className)} />;
    };

    createStyled = styled(Filter);
  } else {
    //createStyled = styled(tag);
    // This seems to work (at least with emotion)
    // I think with styled components there was some style ordering issue with just returning the tag
    // NOTE: If component (tag) doesn't have a subatomic element at its root then style props will have no effect
    return tag;
  }

  const Component = createStyled`
    ${styleBuilder}
  `;

  if (typeof tag === "string") {
    // Wrap with function so we can split off className
    const ComponentWrapper = props => {
      // Pass className as parentClassName so emotion doesn't merge styles
      // Then within Filter we use cx() to merge classNames with order reversed ...
      // ... so that the className from style props takes precedence
      const { className, ...passProps } = props;
      return React.createElement(Component, {
        parentClassName: className,
        ...passProps
      });
    };
    return ComponentWrapper;
  } else {
    return Component;
  }
}

function isValidAttribute(attribute) {
  return (
    emotionIsPropValid(attribute) &&
    blacklistedAttributes.indexOf(attribute) === -1
  );
}
