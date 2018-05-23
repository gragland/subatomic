// TODO:
// - Add style system for some props (borderRadius, borderWidth, etc)

export default {
  props: {
    // .aspect-ratio .aspect-ratio--16x9
    aspectRatio: {
      style: value => ({
        height: 0,
        position: "relative",
        paddingBottom: 100 / value + "%"
      })
    },

    // .aspect-ratio--object
    aspectRatioObject: {
      style: () => ({
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 100
      })
    },

    // .cover
    cover: {
      style: () => ({
        backgroundSize: "cover"
      })
    },

    // .contain
    contain: {
      style: () => ({
        backgroundSize: "contain"
      })
    },

    // .bg-center
    // note: we don't do bg="center" because bg prop is for background-color
    bgCenter: {
      style: () => ({
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center"
      })
    },

    // .bg-top
    bgTop: {
      style: () => ({
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center"
      })
    },

    // .bg-right
    bgRight: {
      style: () => ({
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center right"
      })
    },

    // .bg-bottom
    bgBottom: {
      style: () => ({
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom center"
      })
    },

    // .bg-left
    bgLeft: {
      style: () => ({
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center left"
      })
    },

    // .outline, .outline-transparent, .outline-0
    outline: {
      style: value => {
        let output;
        if (value === 0) {
          output = 0;
        } else if (value) {
          output = `1px solid ${value}`;
        } else {
          output = "1px solid";
        }
        return {
          outline: output
        };
      }
    },

    // .ba (borders)
    // TODO: Come back to this one

    // .b--black
    b: {
      themeKey: "colors",
      style: "borderColor"
    },

    // .br0, .br1, etc
    br: {
      style: value => {
        let output;
        if (value === "pill") {
          output = "9999px";
        } else {
          output = radii[value] || value;
        }
        return {
          borderRadius: output
        };
      }
    },

    // .br--bottom
    // note: border radius value should be set with above prop ...
    // ... and this is used to set opposite side's radius to 0 ...
    // ... because this is more in line with how tachyons classes work
    brBottom: {
      style: () => ({
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0
      })
    },

    brTop: {
      style: () => ({
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
      })
    },

    brRight: {
      style: () => ({
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      })
    },

    brLeft: {
      style: () => ({
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
      })
    },

    // .b--dotted (borderStyle)
    // TODO: This conflicts with existing borderColor prop
    // Change one of the prop names

    bw: {
      themeKey: "spacing",
      style: "borderWidth"
    }
  }
};
