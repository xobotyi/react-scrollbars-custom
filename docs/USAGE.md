# USAGE

### Default
The `<Scrollbar />` component works out of the box, with only need of `width` and `height` to be set, inline or via CSS;
```javascript
<Scrollbar style={ {width: 250, height: 250} }>
    <p>Hello world!</p>
</Scrollbar>
```
Or you can configure sizes translation with defining `maxWidth`/`maxHeight` style. It can be helpful for example in case of dropdown that that from the certain sizes should have the custom scrollbars.  
The need of sizes translation caused by content's element absolute positioning - it is needed to hide native scrollbars, but for that reason it cant stretch wrapper and holder. Sizes translation solves that problem.
```javascript
<Scrollbar style={ {maxWidth: 250, maxHeight: 250} } translateContentSizesToHolder>
    <p>Hello world!</p>
</Scrollbar>
```

### Generated structure
```html
<div class="ScrollbarsCustom"> <-- scrollbar.holderEl
    <div class="wrapper"> <-- scrollbar.wrapperEl
        <div class="content"> <-- scrollbar.contentEl
          !YOUR CONTENT IS HERE!
        </div>
    </div>
    <div class="track trackY"> <-- scrollbar.trackYEl
      <div class="thumb thumbY" /> <-- scrollbar.thumbYEl
    </div>
    <div class="track trackX"> <-- scrollbar.trackXEl
      <div class="thumb thumbX" /> <-- scrollbar.thumbXEl
    </div>
</div>
```
When scrolling is possible or tracks are shown because of `permanentScrollbars` property - the `trackYVisible`/`trackXVisible` classnames are applied to holder;  
By default, if any direction scrolling is not possible and `permanentScrollbars` is not set - respective track **will NOT** be rendered. You can change that behaviour by setting `removeTrackXWhenNotUsed`/`removeTrackYWhenNotUsed`/`removeTracksWhenNotUsed` prop to `false`. 

### Scroll disabling
The most common need is to disable scrolling fully or partially. You can do it simply adding `noScroll` to disable all scrolls or `noScrollY={true}`/`noScrollX={true}` to disable scrolls separately.
```javascript
<Scrollbar noScrollX noScrollY/>
```

### Default styles
To customize scrollbars as you wish - you may want to turn off default styles.
```javascript
<Scrollbar noDefaultStyles/>
```
It will generate next structure:
```html
<div class="ScrollbarsCustom">
    <div class="wrapper" style="position: relative; overflow: hidden;">
      <div class="content" style="position: absolute; top: 0px; bottom: 0px; right: 0px; left: 0px; overflowY: {overflowYPossible}; overflowX: {overflowXPossible}; margin-right: -{browsersScrollbarsWidth}px; margin-bottom: -{browsersScrollbarsWidth}px;"></div>
    </div>
    <div class="track trackY" style="display: none;">
      <div class="thumb thumbY" style="transform: translateY({offset}px); height: {height}px;"></div>
    </div>
    <div class="track trackX" style="display: none;">
      <div class="thumb thumbX" style="transform: translateX({offset}px); width: {width}px;"></div>
    </div>
</div>
```
Styles presented in markup above are not removable and needed to proper component work.

### Native mode
One more pretty common need is to disable custom scrollbars and fallback to native ones, it can be done by passing `native` props.
```html
<div class="ScrollbarsCustom native"> <-- scrollbar.contentEl
  !YOUR CONTENT IS HERE!
</div>
```
The major difference comparing to default mode - now content will have the only wrapper, which will have the `scrollbar.contentEl` ref. Plus the only irreplaceable styles will be `overflowX`, `overflowY` and `direction`.  
Other functionality and props still the same. 

### Events handling
There are three events you can add callbacks to (read more in [API docs](./../API.md)).
```javascript
import React, { Component }  from 'react';
import Scrollbar from 'react-scrollbars-custom';

class App extends Component
{
    render() {
        return (
                <Scrollbar 
                onScroll={this.handleScroll}
                onScrollStart={this.handleScrollStart}
                onScrollStop={this.handleScrollStop}/>
        );
    }
}
```

### RTL support
`react-scrollbars-custom` supports right-to-left direction out of the box, you don't have to pass extra properties to make it work, everything is automated, but you can override it.  
But it has several nuances you should know: 
* Due to performance reasons, direction detection happens in 3 situations:
    * On component mount;
    * On rtl property change;
    * On state `isRtl` set to non-boolean value
* When rtl direction detected - `rtl` classname will be added to the holder;
* If `rtl` property has not set at all (undefined) - direction will be determined according to CSS;
* If `rtl` property has `true` - `direction: rtl;` style will be applied to holder;
* If `rtl` property has `false` - no style will be applied to holder;
* `rtl` property has priority over the `style` property.  
```javascript
<Scrollbar style={{direction: 'ltr'}} rtl /> // will have RTL direction
```
