# declaration-block-no-redundant-longhand-properties

Disallow longhand properties that can be combined into one.

```css
a { padding-top: 1px; padding-right: 1px; padding-bottom: 1px; padding-left: 1px }
/**                                     ↑
 *                            This longhand properties */
```

## Options

### `true`

The following patterns are considered warnings:

```css
a {
  margin-top: 1px;
  margin-bottom: 2px;
  margin-left: 3px;
  margin-right: 4px;
}
```

```css
a {
  font-style: italic;
  font-variant: normal;
  font-weight: bold;
  font-size: .8em;
  font-family: Arial;
  line-height: 1.2; font-stretch: normal;
}
```

```css
a {
  -webkit-transition-delay: 0.5s;
  -webkit-transition-duration: 2s;
  -webkit-transition-property: top;
  -webkit-transition-timing-function: ease;
}
```

The following patterns are *not* considered warnings:

```css
a {
  margin-top: 1px;
  margin-right: 2px;
}
```

```css
a {
  margin-top: 1px;
  margin-right: 2px;
  margin-bottom: 3px;
}
```

```css
a {
  margin-top: 1px;
  margin-right: 2px;
  margin-bottom: 3px;
  padding-left: 4px;
}
```

## Optional options

### `ignoreProperties: ["/regex/", "string"]`

Given:

```js
["/^font-/", "padding-top"]
```

The following patterns are *not* considered warnings:

```css
a {
  font-style: italic;
  font-variant: normal;
  font-weight: bold;
  font-size: .8em;
  font-family: Arial;
  line-height: 1.2; font-stretch: normal;
}
```

```css
a { 
  padding-top: 20px;
  padding-right: 10px;
  padding-bottom: 30px;
  padding-left: 10px;
}
```
