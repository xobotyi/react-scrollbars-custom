# USAGE

### Default
The `<Scrollbar />` component works out of the box, with only need of `width` and `height` to be set, inline or via CSS;
```javascript
import React, { Component }  from 'react';
import Scrollbar from 'react-scrollbar-custom';

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
<div class="CustomScrollbar">
    <div class="CustomScrollbar-wrapper">
        <div class="CustomScrollbar-content">
          !YOUR CONTENT IS HERE!
        </div>
    </div>
    <div class="CustomScrollbar-track CustomScrollbar-trackVertical">
      <div class="CustomScrollbar-thumb CustomScrollbar-thumbVertical"></div>
    </div>
    <div class="CustomScrollbar-track CustomScrollbar-trackHorizontal">
      <div class="CustomScrollbar-thumb CustomScrollbar-thumbHorizontal"></div>
    </div>
</div>
```

### Default styles
To customize scrollbars as you wish - you can turn off default styles.
```javascript
import React, { Component }  from 'react';
import Scrollbar from 'react-scrollbar-custom';

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
<div class="CustomScrollbar">
  <div class="CustomScrollbar-wrapper" style="position: relative; overflow: hidden;">
    <div class="CustomScrollbar-content" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; overflow: scroll; margin-right: -{browsersScrollbarsWidth}; margin-bottom: -{browsersScrollbarsWidth};"></div>
  </div>
  <div class="CustomScrollbar-track CustomScrollbar-trackVertical">
    <div class="CustomScrollbar-thumb CustomScrollbar-thumbVertical" style="transform: translateY({offset}px); height: {height}px;"></div>
  </div>
  <div class="CustomScrollbar-track CustomScrollbar-trackHorizontal">
    <div class="CustomScrollbar-thumb CustomScrollbar-thumbHorizontal" style="transform: translateX({offset}px); width: {width}px;"></div>
  </div>
</div>
```
Styles presented in markup above are not removable and needed to proper component work. 

### Events handling
There are several events you can listen to. Each listener will be called _inside the animation frame_.
```javascript
import React, { Component }  from 'react';
import Scrollbar from 'react-scrollbar-custom';

class App extends Component
{
    render() {
        return (
                <Scrollbar 
                onUpdate={this.handleUpdate}
                onScroll={this.handleScroll}
                onScrollStart={this.handleScrollStart}
                onScrollStop={this.handleScrollStop}/>
        );
    }
}
```

### Automatic size checks
It is possible that DOM will be changed not only with React: for these cases `<Scrollbar />` has automatic content checker.
```javascript
import React, { Component }  from 'react';
import Scrollbar from 'react-scrollbar-custom';

class App extends Component
{
    render() {
        return (
                <Scrollbar contentSizeTrack={true} contentSizeTrack={500}/>
        );
    }
}
```
Now `<Scrollbar/>` will check content's sizes every 500ms and trigger `Scrollbar.update()` if they're changed.