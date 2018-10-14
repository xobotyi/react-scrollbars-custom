# USAGE

### Default
The `<Scrollbar />` component works out of the box, with only need of `width` and `height` to be set, inline or via CSS;
```javascript
import React, { Component }  from 'react';
import Scrollbar from 'react-scrollbars-custom';

class App extends Component
{
    render() {
        return (
                <Scrollbar style={ {width: 250, height: 250} }>
                    <p>Hello world!</p>
                </Scrollbar>
        );
    }
}
```
Component creates next structure:
```html
<div class="ScrollbarsCustom-holder">
    <div class="ScrollbarsCustom-wrapper">
        <div class="ScrollbarsCustom-content">
          !YOUR CONTENT IS HERE!
        </div>
    </div>
    <div class="ScrollbarsCustom-track ScrollbarsCustom-trackVertical">
      <div class="ScrollbarsCustom-thumb ScrollbarsCustom-thumbVertical"></div>
    </div>
    <div class="ScrollbarsCustom-track ScrollbarsCustom-trackHorizontal">
      <div class="ScrollbarsCustom-thumb ScrollbarsCustom-thumbHorizontal"></div>
    </div>
</div>
```

### Scroll disabling
The most common need is to disable scrolling fully or partially. You can do it simply adding `noScroll` to disable all scrolls and `noScrollY={true}`/`noScrollX={true}` to disable scrolls separately.  
Note, that if `scrollY={false}` and `scrollX={false}` will be set simultaneously, it will be treated like `noScroll={true}`.

### Default styles
To customize scrollbars as you wish - you may want to turn off default styles.
```javascript
import React, { Component }  from 'react';
import Scrollbar from 'react-scrollbars-custom';

class App extends Component
{
    render() {
        return (
                <Scrollbar defaultStyles={ false }/>
        );
    }
}
```
It will generate next structure:
```html
<div class="ScrollbarsCustom-holder">
    <div class="ScrollbarsCustom-wrapper" style="position: relative; overflow: hidden;">
      <div class="ScrollbarsCustom-content" style="position: absolute; top: 0px; bottom: 0px; right: 0px; left: 0px; overflow: scroll; margin-right: -{browsersScrollbarsWidth}px; margin-bottom: -{browsersScrollbarsWidth}px;"></div>
    </div>
    <div class="ScrollbarsCustom-track ScrollbarsCustom-trackVertical" style="display: none;">
      <div class="ScrollbarsCustom-thumb ScrollbarsCustom-thumbVertical" style="transform: translateY({offset}px); height: {height}px;"></div>
    </div>
    <div class="ScrollbarsCustom-track ScrollbarsCustom-trackHorizontal" style="display: none;">
      <div class="ScrollbarsCustom-thumb ScrollbarsCustom-thumbHorizontal" style="transform: translateX({offset}px); width: {width}px;"></div>
    </div>
</div>
```
Styles presented in markup above are not removable and needed to proper component work. 

### Events handling
There are three events you can add callbacks to (read more in [API docs](https://github.com/xobotyi/react-scrollbars-custom/blob/master/docs/API.md)).
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
