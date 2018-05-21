<div align="center">
   <img alt="subatomic" src="https://i.imgur.com/XrZUfMV.png" />
</div>

<div align="center">
  Inline style props for Emotion and Styled Components.<br/>
  Spend less time naming things. <i>Iterate faster</i> ⚡️
</div>

<br/>

---

<br/>

Subatomic allows you to style your React components inline so that you can spend more time writing styles and less time thinking of new component names. It integrates with Emotion and Styled Components so that you have the best of both worlds: The power of your favorite css-in-js library plus an inline style system to help you move fast and try out new ideas.

## 💁 Basic Usage

```
npm install --save subatomic
```

Supercharge any component by making `subatomic('element')` the root element.

```jsx
import styled from 'emotion';
import subatomic from 'subatomic/emotion';

const Box = subatomic('div');
const Button = styled(subatomic('button'))`
  color: blue;
  ... other default styles
`

// Now you have style props. Any css property works!
<Box padding="20px" backgroundColor="#efefef" textAlign="center">
  <Button color="#374047" fontSize="16px" padding="8px">Hello</Button>
</Box>
```

> If you use Emotion make sure to also install [Emotion Theming](https://www.npmjs.com/package/emotion-theming)<br/>
> If you use Styled Components import from `subatomic/styled-components`

## 🚀 Advanced

### Responsive Style Props

Add some breakpoints to your theme and all your style props become responsive.

```jsx
// theme.js
export default {
  breakpoints: ['576px', '768px', '992px', '1200px']
}

// App.js
<Button color="#374047" fontSize={['14px', '16px']} padding={['4px', '8px']}>Hello</Button>
```

Resulting css:

```css
.e1q9bg2 {
  font-size: 14px;
  padding: 4px;
}

@media screen and (min-width: 576px) {
  .e1q9bg2 {
    font-size: 16px;
    padding: 8px;
  }
}
```

> ThemeProvider required so subatomic can read `theme.breakpoints` (see docs for [emotion](https://emotion.sh/docs/theming) or [styled components](https://www.styled-components.com/docs/advanced#theming))

### Custom Style Props

Want to change your style prop names or hook them into your design system? We make it easy with just a few tweaks to your theme. In this example it gets color from `theme.colors.grays[2]`, font size from `theme.fontSizes[1]` and padding from `theme.space[2]`.

```jsx
<Button color="grays.2" f={1} p={2}>
  Hello
</Button>
```

> See the [configuration section](#-configuration) below to see how props are mapped to values in your theme.

### Psuedo-classes

Use any psuedo-class or pseudo-element by prepending it to the prop name.

```jsx
<Button hoverColor="grays.3" disabledOpacity={0.5} disabledCursor="not-allowed">Hello</Button>
// You can even chain multiple pseudo-classes together
<Input type="text" hoverPlaceholderColor="blue" />
```

### Dynamic Elements

Sometimes you want to change the underlying element. You can do that with the "is" prop.

```jsx
<Heading is="h2">Hello</Heading>
<Button is="a" href="/">Hello</Button>
<Button is={RouterLink} to="/">Hello</Button> // You can pass a component too
```

## 🤖 Configuration

<b>Basic usage requires no special configuration</b>. To take advantage of responsive props, custom prop names, and design system mapping all you need to do is extend your existing website theme or add one via ThemeProvider if you haven't already (see ThemeProvider docs for [emotion](https://emotion.sh/docs/theming) or [styled components](https://www.styled-components.com/docs/advanced#theming)). Here's a theme that allows for the examples above.

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

## 🤹‍♀️ Tips and Tricks

### Composition Is Your Friend

If you decide you want to turn a chunk of code into a named component you can of course re-write using Emotion or Styled Components syntax, but consider using composition instead and pass along style props using spread syntax.

```jsx
<Button p={3} bg="blues.medium" color="white" />

⬇

const PrimaryButton = props => <Button p={3} bg="blues.medium" color="white" {...props} />;
```

```jsx
<Box mx="auto">
  <Heading f={[5, 6]} fontWeight="700">
    My Awesome Website
  </Heading>
  <Heading is="h2" f={[2, 3]} mt={3} fontWeight="300">
    All other websites are significantly less awesome
  </Heading>
</Box>

⬇

const PageHeading ({ title, subtitle, ...props }) => (
  <Box mx="auto" {...props}>
    <Heading f={[5, 6]} fontWeight="700">
      {title}
    </Heading>
    <Heading is="h2" f={[2, 3]} mt={3} fontWeight="300">
      {subtitle}
    </Heading>
  </Box>
);
```

### Fall Back to Styled When Needed

Subatomic builds on Emotion and Styled Components so that you always have their styling syntax to fall back on when needed. The goal is to help you work faster, not completely change your workflow. Here are some cases where you might want to just create a normal `styled()` component (or use Emotion's `css` prop).

* You need to do do css animations with `@keyframes`
* Component has a lot of hover styles and props like `hoverPlaceholderColor` are getting unwieldy
* Cases where you need more advanced media queries (such as using both min and max width in one rule)
* You'd rather just use Subatomic for spacing and layout components

## 💡 Inspiration

Subatomic was inspired by these excellent projects:

* [jsxstyle](https://github.com/smyte/jsxstyle)
* [styled-system](https://github.com/jxnblk/styled-system)
