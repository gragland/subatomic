//prettier-ignore
export default {
  breakpoints: ['576px', '768px', '992px', '1200px'],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512 ],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
  props: {
    // Use custom props if you want:
    // - Shorthand prop names
    // - To hook into theme values
    // - Advanced logic (see width prop below)

    d: 'display',

    m: {
      themeKey: 'space',
      defaultUnit: 'px',
      style: 'margin',
      variations: {
        mt: 'marginTop',
        mr: 'marginRight',
        mb: 'marginBottom',
        ml: 'marginLeft',
        mx: ['marginLeft', 'marginRight'],
        my: ['marginTop', 'marginBottom']
      }
    },

    p: {
      themeKey: 'space',
      defaultUnit: 'px',
      style: 'padding',
      variations: {
        pt: 'paddingTop',
        pr: 'paddingRight',
        pb: 'paddingBottom',
        pl: 'paddingLeft',
        px: ['paddingLeft', 'paddingRight'],
        py: ['paddingTop', 'paddingBottom']
      }
    },

    w: {
      style: value => {
        let width = value;
        // Make 1 = 100%, 1/2 = 50%, 1/3 = 33.33...%
        // Helpful for setting column widths
        if (isNumber(width) && width <= 1) {
          width = `${width * 100}%`;
        }
        return {
          width: width
        };
      }
    },

    h: 'height',

    color: {
      // To use add a colors object to your theme
      themeKey: 'colors',
      style: 'color'
    },

    bg: {
      themeKey: 'colors',
      style: 'backgroundColor'
    },

    borderColor: {
      themeKey: 'colors',
      style: 'borderColor'
    },

    f: {
      themeKey: 'fontSizes',
      defaultUnit: 'px',
      style: 'fontSize'
    },

    fontFamily: {
      // To use add a fonts object to your theme
      themeKey: 'fonts',
      style: 'fontFamily'
    },

    fontWeight: {
      // To use add a fontWeights object to your theme
      themeKey: 'fontWeights',
      style: 'fontWeight'
    }
  }
};

const isNumber = n => typeof n === 'number' && !isNaN(n);
