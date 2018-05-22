<div align="center">
   <img alt="subatomic" src="https://i.imgur.com/XrZUfMV.png" />
</div>

<div align="center">
  Inline style props for emotion and styled-components.<br/>
  Spend less time naming things. <i>Iterate faster</i> ⚡️
</div>

<br/>

---

<br/>

Subatomic allows you to style your React components inline so that you can spend more time writing styles and less time thinking of new component names. It integrates with emotion and styled-components so that you have the best of both worlds: The power of your favorite css-in-js library plus an inline style system to help you move fast and try out new ideas.

## 💁 Basic Usage

```
npm install --save subatomic
```

Supercharge any component by making `subatomic('element')` the root element.

```jsx
import styled from 'emotion';
import subatomic from 'subatomic/emotion';

// Our components
const Box = subatomic('div');
const H1 = subatomic('h1');
const Button = styled(subatomic('button'))`
  color: white;
  background-color: blue;
  &:hover {
   background-color: lightblue;
  }
`

// Now we have style props! Tweak any style inline.
<Box padding="20px" backgroundColor="white">
  <H1 fontSize="48px" fontWeight="700">
    My Awesome Website
  </H1>
  <Box fontSize="32px" fontWeight="300">
    All other websites are significantly less awesome
  </Box>
  <Button backgroundColor="green">
    Get Started
  </Button>
</Box>
```

> If you use styled-components import from `subatomic/styled-components` instead.

While that's all you need to know to get started, we also support [responsive styles](#-responsive-style-props), [custom prop logic](#-custom-style-props), [pseudo-classes](#-psuedo-classes) and [dynamic elements](#-dynamic-elements). Read on to see how each of these features would affect the code example above.

## 📲 Responsive Style Props

So let's say you're happy with the awesome website header but everything is way too big on mobile. With just a few tweaks to our example above we can decrease padding and font size on smaller screens.
```jsx
<Box padding={["10px", "20px"]} backgroundColor="white">
  <H1 fontSize={["32px", "48px"]} fontWeight="700">
    My Awesome Website
  </H1>
  <Box fontSize={["24px", "32px"]} fontWeight="300">
    All other websites are significantly less awesome
  </Box>
  <Button backgroundColor="green">
    Get Started
  </Button>
</Box>
```
As you can see we're now passing an array of values to the `padding` and `fontSize` props. These map to an array of screen widths (or "responsive breakpoints"). Subatomic uses a default set of breakpoints, so the above example works without any extra configuration, but you can also override them right in your website theme.

```jsx
// theme.js
export default {
  // These are the default breakpoints
  breakpoints: ['576px', '768px', '992px', '1200px']
}

// App
import { ThemeProvider } from 'emotion-theming'
import theme from './theme.js'

const App = props => (
  <ThemeProvider theme={theme}>
    {/* ... */}
  </ThemeProvider>
)
```
Once your theme is made available via `ThemeProvider` subatomic will automatically use those values instead. For more info about theming see the ThemeProvider docs for [emotion](https://emotion.sh/docs/theming) or [styled-components](https://www.styled-components.com/docs/advanced#theming).

## 🌈 Custom Style Props

Want to use shorter prop names or hook them into your design system? We make that easy as well. In this example we're using some custom props with shorter names (because less typing is cool) and the prop values now map to these locations in our theme: `theme.spacing[i]`, `theme.fontSizes[i]`, `theme.colors.green[2]`.

```jsx
<Box p={[2, 3]} bg="white">
  <H1 f={[5, 6]} fontWeight="700">
    My Awesome Website
  </H1>
  <Box f={[4, 5]} fontWeight="300">
    All other websites are significantly less awesome
  </Box>
  <Button bg="greens.2">
    Get Started
  </Button>
</Box>
```
In the [configuration section](#-configuration) we'll show you how actually set this up, but the basic idea is that you can quickly define styles inline without giving the up the wonderful consistency of a design system.

## 👻 Psuedo-classes

Use any psuedo-class or pseudo-element by prepending it to the prop name. Here we modify `<Button>` so that its hover color fits better with its green background-color.

```jsx
<Button bg="greens.2" hoverBg="greens.1">
   Get Started
</Button>
```
> You can even chain multiple pseudo-classes together. For example: `hoverPlaceholderColor`

## 🎩 Dynamic Elements

Sometimes you want to change the underlying element. You can do that with the `is` prop. In the example below we've renamed `H1` to `Heading` and now use the `is` prop to make the subheading an `h2` element. We also made `Button` an `a` element because we want it to be a link that looks like a button.

```jsx
const Heading = subatomic('h1');

<Box p={[2, 3]} bg="white">
  <Heading f={[5, 6]} fontWeight="700">
    My Awesome Website
  </Heading>
  <Heading is="h2" f={[4, 5]} fontWeight="300">
    All other websites are significantly less awesome
  </Heading>
  <Button is="a" href="/start" bg="greens.2" hoverBg="greens.1">
    Get Started
  </Button>
</Box>
```
> You can even pass a component. Example: `<Button is={RouterLink} to="/start">Get Started</Button>`

## 🤹‍♀️ Tips and Tricks

### Composition Is Your Friend

If you decide you want to turn a chunk of code into a named component you can of course re-write using `styled()` syntax, but consider using composition instead and pass along props using `{...props}` (spread syntax).

```jsx
// Our example from above
<Box p={[2, 3]} bg="white">
  <Heading f={[5, 6]} fontWeight="700">
    My Awesome Website
  </Heading>
  <Heading is="h2" f={[4, 5]} fontWeight="300">
    All other websites are significantly less awesome
  </Heading>
  <Button is="a" href="/start" bg="greens.2" hoverBg="greens.1">
    Get Started
  </Button>
</Box>

// ⬇ Becomes a reusable component

const PageHeading ({ title, subtitle, ...props }) => (
  <Box p={[2, 3]} bg="white" {...props}>
    <Heading f={[5, 6]} fontWeight="700">
      {title}
    </Heading>
    <Heading is="h2" f={[4, 5]} fontWeight="300">
      {subtitle}
    </Heading>
  </Box>
);

// Lets also break the button out into its own component
const GreenButton = props => (
  <Button 
    bg="greens.2" 
    hoverBg="greens.1" 
    {...props} 
  />;
);

// ⬇ Which is rendered like so

<PageHeading
  title="My Awesome Website"
  subtitle="All other websites are significantly less awesome"
  // We can still pass in style props
  textAlign="center"
/>

<GreenButton is="a" href="/start">
  Get Started
</GreenButton>
```

### Fall Back to Styled When Needed

Subatomic builds on emotion and styled-components so that you always have their styling syntax to fall back on when needed. The goal is to help you work faster, not completely change your workflow. Here are some cases where you might want to just create a normal `styled()` component (or use emotion's `css` prop).

* You need to do do css animations with `@keyframes`
* Component has a lot of hover styles and props like `hoverPlaceholderColor` are getting unwieldy
* Cases where you need more advanced media queries (such as using both min and max width in one rule)
* You'd rather just use subatomic for spacing and layout components

## 🤖 Theme Configuration

Subatomic will automatically use the following [default theme](https://github.com/gragland/subatomic/blob/master/themes/default.js) which comes with a basic style system and some useful custom props. See the inline comments below for an explanation of each property and a code example at the bottom that shows how to extend this theme to add your own style system and props.

```js
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
```
### Extending the Default Theme
Here's how you'd extend the above theme to add your color system and extra props.

```js
import defaultTheme from "subatomic/themes/default";

export default {
  breakpoints: defaultTheme.breakpoints,
  space: defaultTheme.space,
  fontSizes: defaultTheme.fontSizes,
  fonts: {
    primary: 'avenir, -apple-system, BlinkMacSystemFont',
    monospace: '"SF Mono", "Roboto Mono", Menlo, monospace'
  },
  colors: { 
    greens: ['#84e47b', '#11cc00', '#0da200'] 
  },
  props: {
    ...defaultTheme.props,
    // And then add any other custom props you want
    fontFamily: {
      themeKey: 'fonts',
      style: 'fontFamily'
    },
  }
};

// App
import { ThemeProvider } from 'emotion-theming'
import theme from './theme.js'

const App = props => (
  <ThemeProvider theme={theme}>
    {/* ... */}
  </ThemeProvider>
)
```
Any theme you make available via `ThemeProvider` will override the default theme, so you can either extend (merge in the parts you want) or write your own custom theme.

> Interested in helping us add new themes that mimic the look and utility classes of various UI kits like tachyons, bulma, etc? Feel free to add to our themes directory in a pull request.



## 💡 Inspiration

Subatomic was inspired by these excellent projects:

* [jsxstyle](https://github.com/smyte/jsxstyle)
* [styled-system](https://github.com/jxnblk/styled-system)
