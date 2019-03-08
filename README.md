<div align="center">
    <h1>react-scrollbars-custom</h1>
    <p>
        <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/badge/npm-react--scrollbars--custom-brightgreen.svg" /></a>
        <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/npm/v/react-scrollbars-custom.svg" /></a>
        <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/npm/dt/react-scrollbars-custom.svg" /></a>
        <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/travis/xobotyi/react-scrollbars-custom.svg" /></a>
        <a href="https://www.codacy.com/app/xobotyi/react-scrollbars-custom"><img src="https://api.codacy.com/project/badge/Grade/f0875490cea1497a9eca9c25f3f7774e"/></a>
        <a href="https://www.codacy.com/app/xobotyi/react-scrollbars-custom"><img src="https://api.codacy.com/project/badge/Coverage/f0875490cea1497a9eca9c25f3f7774e"/></a>
        <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/npm/l/react-scrollbars-custom.svg" /></a>
    </p>
    × <strong><a href="https://xobotyi.github.io/react-scrollbars-custom/">DEMO</a></strong> ×
</div>
----
  
  
- Native browser scroll behavior - it don't emulate scrolling, only showing custom scrollbars, scrolling itself still native
- Cross-browser and cross-platform - does not matter where and how, scrollbars looks the same everywhere
- Ultimate performance - 60 FPS (using RAF) and highly optimised code
- No extra stylesheets required - minimum inline styles out of the box or you can style it yourself however you want
- Fully customizable - want a hippo as a scrollbar thumb? Well.. I don't judge you, you're free to do it!
- Scrollbars nesting
- Total tests coverage
- Momentum scrolling for iOS
- RTL support ([read more](#rtl-support))

### INSTALLATION

```bash
npm install react-scrollbars-custom
# or via yarn
yarn add react-scrollbars-custom
```

### USAGE

Underneath `react-scrollbars-custom` uses `requestAnimationFrame` loop, which check and update each known scrollbar, and as result - scrollbars updates synchronised with browser's render flow.
The `<Scrollbar />` component works out of the box, with only need of `width` and `height` to be set, inline or via CSS;

```typescript jsx
<Scrollbar style={{ width: 250, height: 250 }}>
  <p>Hello world!</p>
</Scrollbar>
```

#### Generated HTML

```html
<div class="ScrollbarsCustom trackYVisible trackXVisible">
  // scrollbar.holderElement
  <div class="ScrollbarWrapper">
    // scrollbar.wrapperElement
    <div class="ScrollbarContent">
      // scrollbar.contentElement // YOUR CONTENT IS HERE
    </div>
  </div>
  <div class="ScrollbarTrack ScrollbarTrack-Y">
    // scrollbar.trackYElement
    <div class="ScrollbarThumb ScrollbarThumb-Y" />
    // scrollbar.thumbYElement
  </div>
  <div class="ScrollbarTrack ScrollbarTrack-X">
    // scrollbar.trackXElement
    <div class="ScrollbarThumb ScrollbarThumb-X" />
    // scrollbar.thumbXElement
  </div>
</div>
```

- If scrolling is possible or tracks are shown die to `permanentScrollbar*` prop - `trackYVisible`/`trackXVisible` classnames are applied to the holder element.
- When thumb is dragged it'll have `dragging` classname.
- If direction is RTL - `rtl` classname will be added to the holder element.
- By default whole structure described above is rendered in spite of tracks visibility, but it can be changed by passing `removeTrackXWhenNotUsed`/`removeTrackYWhenNotUsed`/`removeTracksWhenNotUsed` props to the component. Respective tracks will not be rendered if it is unnecessary.

#### Default styles

Probably you'll wish to customize your scrollbars on your own way via CSS - then simply pass `noDefaultStyles` prop - it will prevent all inline styling from appear.  
But some of styles will remain due to their need for proper component work.

#### Native mode

One more pretty common need is to disable custom scrollbars and fallback to native ones, it can be done by passing `native` prop.
It'll change the generated markup:

```html
<div class="ScrollbarsCustom native trackYVisible trackXVisible">
  // scrollbar.contentElement // YOUR CONTENT IS HERE
</div>
```

#### RTL support

`react-scrollbars-custom` supports RTL direction out of the box, you don't have to pass extra parameters to make it work, it'll be detected automatically on first component's render. But you still able to override it through the prop.
There are several things you have to know about:

- Due to performance reasons direction autodetect happens is 3 cases:
  - On component mount;
  - On rtl property change;
  - On state `isRtl` set to non-boolean value;
- `rtl` property has priority over the `style` or CSS properties;
- If `rtl` prop has not been set (undefined) - direction will be detected automatically according to content element's CSS;
- If `rtl` prop is `true` - `direction: rtl;` style will be applied to hte content element;
- If `rtl` prop is `false` - no style will be applied to holder;

### API

#### PROPS

You can pass any HTMLElement props to the component - they'll be respectfully passed to the element/renderer.

**`createContext`** _:boolean_ = false

**`rtl`** _:boolean_ = undefined

**`native`** _:boolean_ = false

**`momentum`** _:boolean_ = true

**`noDefaultStyles`** _:boolean_ = false

**`minimalThumbSize`** _:number_ = 30

**`maximalThumbSize`** _:number_ = undefined

**`minimalThumbXSize`** _:number_ = undefined

**`maximalThumbXSize`** _:number_ = undefined

**`minimalThumbYSize`** _:number_ = undefined

**`maximalThumbYSize`** _:number_ = undefined

**`noScrollX`** _:boolean_ = false

**`noScrollY`** _:boolean_ = false

**`noScroll`** _:boolean_ = false

**`permanentTrackX`** _:boolean_ = false

**`permanentTrackY`** _:boolean_ = false

**`permanentTracks`** _:boolean_ = false

**`removeTracksWhenNotUsed`** _:boolean_ = false

**`removeTrackYWhenNotUsed`** _:boolean_ = false

**`removeTrackXWhenNotUsed`** _:boolean_ = false

**`trackClickBehavior`** _:string_ = "jump"

**`scrollbarWidth`** _:number_ = undefined

**`fallbackScrollbarWidth`** _:number_ = 20

**`scrollTop`** _:number_ = undefined

**`scrollLeft`** _:number_ = undefined

**`elementRef`** _:function_ = undefined

**`renderer`** _:SFC_ = undefined

**`wrapperProps`** _:object_ = {}

**`contentProps`** _:object_ = {}

**`trackXProps`** _:object_ = {}

**`trackYProps`** _:object_ = {}

**`thumbXProps`** _:object_ = {}

**`thumbYProps`** _:object_ = {}

#### INSTANCE PROPERTIES

**`holderElement`** _:HTMLElement | null_

**`wrapperElement`** _:HTMLElement | null_

**`contentElement`** _:HTMLElement | null_

**`trackXElement`** _:HTMLElement | null_

**`trackYElement`** _:HTMLElement | null_

**`thumbXElement`** _:HTMLElement | null_

**`thumbYElement`** _:HTMLElement | null_

(get|set) **`scrollTop`** _:number_

(get|set) **`scrollLeft`** _:number_

(get) **`scrollHeight`** _:number_

(get) **`scrollWidth`** _:number_

(get) **`clientHeight`** _:number_

(get) **`clientWidth`** _:number_

#### INSTANCE METHODS

**`getScrollValues()`** _:this_

**`scrollToTop()`** _:this_

**`scrollToLeft()`** _:this_

**`scrollToBottom()`** _:this_

**`scrollToRight()`** _:this_

**`scrollTo(x?: number, y?: number)`** _:this_

**`centerAt(x?: number, y?: number)`** _:this_

### CUSTOMISATION
