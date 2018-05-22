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

## 🖥 Responsive Style Props

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
Once your theme is made available via `ThemeProvider` subatomic will automatically use those values instead.
> See ThemeProvider docs for [emotion](https://emotion.sh/docs/theming) or [styled components](https://www.styled-components.com/docs/advanced#theming)

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

Sometimes you want to change the underlying element. You can do that with the `is` prop. Here we use the component name `Heading` instead of `H1` and make the subheading an `h2` element using the `is` prop. We also make `Button` an `a` element because we want it to be a link that looks like a button.

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
> You can even pass a component. Example: `<Button is={RouterLink} to="/intro">Get Started</Button>`

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

<b>Basic usage requires no special configuration</b>. To take advantage of responsive props, custom prop names, and design system mapping all you need to do is extend your existing website theme or [add one via ThemeProvider](#-responsive-style-props) if you haven't already. Here's a theme that allows for the custom style props we use in our code example above.

```js
export default {
  breakpoints: ['576px', '768px', '992px', '1200px'],
  colors: { grays: ['#ebedee', '#acb4b9', '#374047'] },
  fontSizes: [14, 16, 20, 24, 32, 48, 64 ],
  space: [ 0, 4, 8, 16, 32, 64]
  props: {
    // Custom style prop
    f: {
      // Read values from theme.fontSizes
      themeKey: 'fontSizes',
      // Default unit if not specified
      defaultUnit: 'px',
      // Actual css property
      style: 'fontSize'
    },
    color: {
      themeKey: 'colors',
      style: 'color'
    },
    bg: {
      themeKey: 'colors',
      style: 'backgroundColor'
    },
    p: {
      themeKey: 'space',
      defaultUnit: 'px',
      style: 'padding',
      // Add directional variations
      variations: {
        pt: 'paddingTop',
        pr: 'paddingRight',
        pb: 'paddingBottom',
        pl: 'paddingLeft',
        px: ['paddingLeft', 'paddingRight'],
        py: ['paddingTop', 'paddingBottom']
      }
    },
    // Example of an advanced width prop
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

To make things easier we provide a [default theme with some custom props](https://github.com/gragland/subatomic/blob/master/themes/default.js) that you can use or build on.

```js
import defaultTheme from "subatomic/themes/default";

export default {
  breakpoints: defaultTheme.breakpoints,
  space: defaultTheme.space,
  fontSizes: defaultTheme.fontSizes,
  colors: {
    grays: ["#ebedee", "#acb4b9", "#374047"]
  },
  props: {
    ...defaultTheme.props,
    // And then add any new ones you want
    center: {
      style: () => ({
        textAlign: "center"
      })
    }
  }
};
```

> Feel free to submit your own theme in a pull request if you think it could be useful to others. I'm particularly interested in adding some themes that reproduce design and utility classes of existing ui libraries like tachyons, bulma, etc.

## 💡 Inspiration

Subatomic was inspired by these excellent projects:

* [jsxstyle](https://github.com/smyte/jsxstyle)
* [styled-system](https://github.com/jxnblk/styled-system)
