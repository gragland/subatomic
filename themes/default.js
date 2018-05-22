//prettier-ignore
export default {
  breakpoints: ['576px', '768px', '992px', '1200px'],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512 ],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
  // Custom style props go in the props object
  props: {
    f: {
      // Where to find values in theme
      themeKey: 'fontSizes',
      // Default unit if none specified
      defaultUnit: 'px',
      // Resulting css property
      style: 'fontSize'
    },
    color: {
      // Extend theme and add colors object
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
    d: {
      style: 'display'
    },
    p: {
      themeKey: 'space',
      defaultUnit: 'px',
      style: 'padding',
      // Directional variations
      variations: {
        pt: 'paddingTop',
        pr: 'paddingRight',
        pb: 'paddingBottom',
        pl: 'paddingLeft',
        px: ['paddingLeft', 'paddingRight'],
        py: ['paddingTop', 'paddingBottom']
      }
    },
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
    h: {
      style: 'height'
    },
    // Advanced width prop
    w: {
      // Style is a function instead of a string
      style: value => {
        let width = value;
        // If less than 1 make it a fraction of 100% (1/3 = 33.33...%, etc)
        // Nice for column widths (<Row><Col w={1/3}><Col w={2/3}></Row>)
        if (isNumber(width) && width <= 1) {
          width = `${width * 100}%`;
        }
        return {
          width: width
        };
      }
    }
  }
}

const isNumber = n => typeof n === "number" && !isNaN(n);
