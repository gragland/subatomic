import React from 'react';
import blacklistedStyleProps from './blacklisted-style-props.js';
import pseudoclasses from './pseudoclasses.js';
import defaultTheme from './../themes/default.js';

const isBlacklistedStyleProp = prop => blacklistedStyleProps.indexOf(prop) >= 0;

let customPropsCached;

// Cache for styled components (so we're not creating new ones on each render)
const Cache = createCache();

export const createSubatomic = (tag, getComponent, isValidAttribute) => {
  const defaultOptions = {
    themeBreakpointsKey: 'breakpoints',
    tagProp: 'is'
  };

  const options = defaultOptions;

  // TODO: Let consumer pass in custom options to createSubatomic
  /*if (options) {
    options = Object.assign(defaultOptions, options);
  } else {
    options = defaultOptions;
  }*/

  // The returned stateless functional component
  const Subatomic = ({ ...allProps }) => {
    // Destructure tagProp from props and assign value to "is" variable
    let { [options.tagProp]: is, ...props } = allProps;

    // "is" prop overrides tag so we can change element
    if (is) {
      tag = is;
    }

    // Will be the returned react component
    let Component = getComponentWithCache(
      tag,
      options,
      getComponent,
      isValidAttribute
    );

    // Save Component to cache
    Cache.put(tag, Component);

    return <Component {...props} />;
  };

  return Subatomic;
};

function getComponentWithCache(tag, options, getComponent, isValidAttribute) {
  // Get component from cache by its tag (tag can be string or function reference)
  const CachedComponent = Cache.get(tag);
  if (CachedComponent) {
    return CachedComponent;
  }

  const styleBuilder = createStyleBuilder(options, isValidAttribute);

  // Get the cache index Component will have once it's added to cache
  // Used to create a deterministic hash for className (since will be same across server and client)
  // If tag is a string then value will be null (not needed)
  let referenceCacheIndex = null;
  if (typeof tag === 'object') {
    const cache = Cache.get();
    referenceCacheIndex = cache.byReference.keys.length;
  }

  let Component = getComponent(tag, styleBuilder, referenceCacheIndex);

  // Save Component to cache
  Cache.put(tag, Component);

  return Component;
}

function createStyleBuilder(options, isValidAttribute) {
  const styleBuilder = allProps => {
    // If theme passed via ThemeProvider then use it!
    // If not then allProps.theme will be an empty object
    let theme;
    if (isEmptyObject(allProps.theme) === false) {
      theme = allProps.theme;
    } else if (!theme) {
      // Otherwise use our basic default theme
      theme = defaultTheme;
    }

    let customProps;
    if (customPropsCached) {
      customProps = customPropsCached;
    } else {
      customProps = createPropVariations(theme.props);
      customPropsCached = customProps;
    }

    // TODO: memoize?
    const breakpoints = getBreakpoints(theme, options);

    const buildStyleFromObject = (props, fromPseudoClassObject = false) => {
      let allStyles = {};

      // Iterate through the component's props
      for (var propName in props) {
        const prop = props[propName];
        const propType = typeof prop;

        // Skip this style prop if blacklisted (not a style prop)
        // Or if not a custom style prop and it is a valid attribute
        if (
          isBlacklistedStyleProp(propName) ||
          (!customProps[propName] && isValidAttribute(propName))
        ) {
          continue;
        }

        // Get the prop's config
        let config = customProps[propName] || propName;

        // Make config an object if string
        // Could be string if using shorthand or values in pseudoClass style
        if (typeof config === 'string') {
          config = {
            style: config
          };
        }

        // See if prop is a pseudoclass (hoverColor, hoverPlaceholderColor)
        // Skip if custom style prop in config
        if (!customProps[propName]) {
          let wasPseudoclass = false;
          // Iterate through pseudoclasses (also contains pseudoelements)
          for (let key in pseudoclasses) {
            const pseudo = key;
            // Check if string starts with pseudoclass
            if (propName.startsWith(pseudo)) {
              // Get the portion after the pseudoclass
              let remainder = propName.slice(pseudo.length);
              remainder =
                remainder.charAt(0).toLowerCase() + remainder.slice(1);
              // Prefix with : or :: depending on whether class or element
              const pseudoPrefixed =
                (pseudoclasses[key] === 'class' ? ':' : '::') + pseudo;
              // Recursively call build style on remaining portion as a prop
              const result = buildStyleFromObject({ [remainder]: prop }, true);
              // Add to allStyles (or merge if already populated by another prop with same psuedoclass)
              if (allStyles[pseudoPrefixed]) {
                allStyles[pseudoPrefixed] = Object.assign(
                  allStyles[pseudoPrefixed],
                  result
                );
              } else {
                allStyles[pseudoPrefixed] = result;
              }

              wasPseudoclass = true;
              continue;
            }
          }

          // Continue because pseudoclass style already generated from recursive call
          if (wasPseudoclass) continue;
        }

        // No longer doing pseudoclass object syntax
        /*
        if (config.pseudoClass) {
          allStyles[config.pseudoClass] = buildStyleFromObject(prop, true);
          continue;
        }
        */

        // Function that looks up prop value in theme
        const getFromTheme = value => {
          // Convert value to positive if a negative number
          const posValue = isNegative(value) ? value * -1 : value;
          // Construct dot notation key to actual value in theme
          const fullKey = `${config.themeKey}.${posValue}`;
          // Get value from theme
          let themeValue = get(theme, fullKey);
          // If value from theme is a number and input value was negative ...
          // ... then make the theme value negative
          if (isNegative(value) && isNumber(themeValue)) {
            themeValue = themeValue * -1;
          }
          return themeValue;
        };

        // Make props value an array if it's not
        const propValues = Array.isArray(prop) ? prop : [prop];

        // Iteration through props value array
        for (let i = 0; i < propValues.length; i++) {
          let propValue = propValues[i];

          // If no prop value is boolean true (example: <Flex wrap>)
          // Then set it to defaultValue if specified
          if (config.defaultValue && propValue === true) {
            propValue = config.defaultValue;
          }

          // Prop value might be a key for actual value in theme
          propValue = (config.themeKey && getFromTheme(propValue)) || propValue;

          // Append unit to propValue if number and defaultUnit specified
          if (config.defaultUnit && isNumber(propValue)) {
            propValue = `${propValue}${config.defaultUnit}`;
          }

          let styleObj;
          if (typeof config === 'string') {
            styleObj = makeStyle(propValue, config);
          } else if (typeof config.style === 'function') {
            styleObj = config.style(propValue, propName);
          } else {
            // Otherwise assume config.style is string or array
            styleObj = makeStyle(propValue, config.style);
          }

          if (i === 0) {
            // Merge with rest of component's styles
            Object.assign(allStyles, styleObj);
          } else {
            // Any prop values after the first get wrapped in media query
            const bp = breakpoints[i - 1];
            if (!allStyles[bp]) allStyles[bp] = {};
            Object.assign(allStyles[bp], styleObj);
          }
        }
      }

      return allStyles;
    };

    return buildStyleFromObject(allProps);
  };

  return styleBuilder;
}

// Accepts a single css property (string) or multiple (array)
// Returns a style object with
function makeStyle(value, cssProperty) {
  let styleObj = {};
  // Ensure we have an array of css properties
  let cssProperties = Array.isArray(cssProperty) ? cssProperty : [cssProperty];
  // Iterate through cssProperties and build styleObj
  cssProperties.forEach(p => (styleObj[p] = value));
  return styleObj;
}

function createPropVariations(props) {
  for (var key in props) {
    const prop = props[key];
    if (prop.variations) {
      for (var vKey in prop.variations) {
        var { style, variations, ...newProp } = prop;
        newProp.style = variations[vKey];
        props[vKey] = newProp;
      }
    }
  }
  return props;
}

function getBreakpoints(theme, options) {
  return theme[options.themeBreakpointsKey].map(bp => {
    return `@media screen and (min-width: ${bp})`;
  });
}

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

function isNegative(value) {
  return isNumber(value) && value < 0;
}

// Returns a cache object where key can be string or object/function reference
function createCache() {
  let cache = {
    byString: {},
    byReference: {
      keys: [],
      values: []
    }
  };
  return {
    put: function(key, value) {
      if (typeof key === 'object') {
        const index = cache.byReference.keys.indexOf(key);
        if (index === -1) {
          cache.byReference.keys.push(key);
          cache.byReference.values.push(value);
        } else {
          cache.byReference.values[index] = value;
        }
      } else {
        cache.byString[key] = value;
      }
    },
    get: function(key) {
      if (!key) {
        return cache;
      } else if (typeof key === 'object') {
        const index = cache.byReference.keys.indexOf(key);
        return cache.byReference.values[index];
      } else {
        return cache.byString[key];
      }
    }
  };
}

// lodash.get alternative (much smaller file size)
// From https://gist.github.com/jeneg/9767afdcca45601ea44930ea03e0febf
function get(obj, path, def) {
  var fullPath = path
    .replace(/\[/g, '.')
    .replace(/]/g, '')
    .split('.')
    .filter(Boolean);

  return fullPath.every(everyFunc) ? obj : def;

  function everyFunc(step) {
    return !(step && (obj = obj[step]) === undefined);
  }
}

const isEmptyObject = obj =>
  Object.keys(obj).length === 0 && obj.constructor === Object;
