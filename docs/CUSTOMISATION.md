# CUSTOMISATION
`react-scrollbars-custom` made fully customizable and in some cases you may want to change the default markup.  
By default component generates next structure: 
* `holder` Holds content and scrollbars
    * `wrapper` Wraps the content in order to hide browser's scrollbars
        * `content` The element your content rendered in
    * `trackVertical` Vertical scrollbar track
        * `trackHorizontal` Vertical scrollbar track
    * `thumbVertical`  Horizontal scrollbar thumb
        * `thumbHorizontal` Horizontal scrollbar thumb

Each of them (excepting holder) can be replaced by passing renderer function.  
4ex: if you want to change the default className or tagName of elements or add extra markup.
```javascript
import React, { Component }  from 'react';
import Scrollbar from 'react-scrollbars-custom';

class App extends Component
{
    render() {
        return (
                <Scrollbar
                    renderWrapper={props=> <span {...props} className="MyAwesomeWrapper"/>}
                    renderContent={props=> <span {...props} className="MyAwesomeContent"/>}
                    renderTrackVertical={props=> <span {...props} className="MyAwesomeTrackVertical"/>}
                    renderTrackHorizontal={props=> <span {...props} className="MyAwesomeTrackHorizontal"/>}
                    renderThumbVertical={props=> <span {...props} className="MyAwesomeThumbVertical"/>}
                    renderThumbHorizontal={props=> <span {...props} className="MyAwesomeThumbHorizontal"/>}
                />
        );
    }
}
``` 
>**IMPORTANT:** _You always have to pass through the given props for the respective element_. Because component need some styles to be passed down to the elements in order to make it work.

### Component controls
Component provides scrolling control methods, a list of which you can find in the [API Documentation](https://github.com/xobotyi/react-scrollbars-custom/tree/master/docs/API.md)  
To call them you have to make a reference to `<Scrollbar/>` component. Below you can see how to access component's methods and it's DOM elements:  
```javascript
import React, { Component }  from 'react';
import Scrollbar from 'react-scrollbars-custom';

class App extends Component
{
    domElementsRefsExample(){
        this.refs.scrollbar.holder;
        this.refs.scrollbar.wrapper;
        this.refs.scrollbar.content;
        this.refs.scrollbar.trackVertical;
        this.refs.scrollbar.trackHorizontal;
        this.refs.scrollbar.thumbVertical;
        this.refs.scrollbar.thumbHorizontal;
    }
    
    randomScrollTop(){
        this.refs.scrollbar.scrollTop = Math.floor(Math.random() * (this.refs.scrollbar.scrollHeight + 1));
    }
    
    render() {
        return <Scrollbar ref="scrollbar"/>;
    }
}
```
