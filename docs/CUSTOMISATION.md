# CUSTOMISATION
`react-scrollbar-custom` is a fully customizable component, it consist of the following elements:
* `holder` Holds content and scrollbars
* `wrapper` Wraps the content in order to hide browser's scrollbars
* `content` The element your content rendered in
* `trackVertical` Vertical scrollbar track
* `trackHorizontal` Horizontal scrollbar track
* `thumbVertical`  Vertical scrollbar thumb
* `thumbHorizontal` Horizontal scrollbar thumb

Each of them (excepting holder) can be replaced and rendered with a function which you pass to the component.  
4ex: if you want to change the className of elements.
```javascript
import React, { Component }  from 'react';
import Scrollbar from 'react-scrollbar-custom';

class App extends Component
{
    render() {
        return (
                <Scrollbar
                    renderWrapper={props=> <div {...props} className="MyAwesomeWrapper"/>}
                    renderContent={props=> <div {...props} className="MyAwesomeContent"/>}
                    renderTrackVertical={props=> <div {...props} className="MyAwesomeTrackVertical"/>}
                    renderTrackHorizontal={props=> <div {...props} className="MyAwesomeTrackHorizontal"/>}
                    renderThumbVertical={props=> <div {...props} className="MyAwesomeThumbVertical"/>}
                    renderThumbHorizontal={props=> <div {...props} className="MyAwesomeThumbHorizontal"/>}
                />
        );
    }
}
``` 
>**IMPORTANT:** _You always have to pass through the given props for the respective element_. Because component need some styles to be passed down to element in order to make it work.

### Component controls
Component provides scroll controlling methods, a list of which you can find in the [API Documentation](https://github.com/xobotyi/react-scrollbars-custom/tree/master/docs/API.md)  
To call them you have to make a reference to `<Scrollbar/>` component. Below you can see how to access component's methods and it's DOM elements:  
```javascript
import React, { Component }  from 'react';
import Scrollbar from 'react-scrollbar-custom';

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