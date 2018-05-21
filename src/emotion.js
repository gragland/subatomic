import React from "react";
import styled, { cx } from "react-emotion";
import { withTheme } from "emotion-theming";
import { createSubatomic as createSubatomicBase } from "./subatomic.js";
import emotionIsPropValid from "@emotion/is-prop-valid";
import blacklistedAttributes from "./blacklisted-attributes.js";

// If no theme then we use the defaultTheme
import defaultTheme from "./../themes/default.js";

export default tag => {
  const receiveTheme = ({ theme = defaultTheme, ...props }) => {
    const Subatomic = createSubatomic(tag, theme, theme.props, theme.options);
    return React.createElement(Subatomic, props);
  };
  return withTheme(receiveTheme);
};

export function createSubatomic(tag, theme, props, options) {
  return createSubatomicBase(
    tag,
    theme,
    props,
    options,
    getComponent,
    // We pass this in so that we can re-use emotion/sc whitelist for lower bundle size
    isValidAttribute
  );
}

function getComponent(
  tag, // string or component
  theme,
  customProps,
  subatomicOptions,
  styleBuilder
) {
  let createStyled;

  if (typeof tag === "string") {
    const propsToFilter = Object.keys(customProps);

    //const Root = styled(tag);

    const Filter = ({ parentClassName, ...props }) => {
      // Only pass props to DOM element if they are valid html attributes and are not a custom prop
      let next = {};
      for (let key in props) {
        if (!customProps[key] && isValidAttribute(key)) {
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
