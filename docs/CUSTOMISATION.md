# CUSTOMISATION
`react-scrollbars-custom` made fully customizable and in some cases you may want to change the default markup.  
By default component generates next structure: 
* `holder` Holds content and scrollbars
    * `wrapper` Wraps the content in order to hide browser's scrollbars
        * `content` The element your content rendered in
    * `trackY` Vertical scrollbar track
        * `thumbY`  Vertical scrollbar thumb
    * `trackX` Horizontal scrollbar track
        * `thumbX` Horizontal scrollbar thumb

Each of them (excepting holder) can be replaced by passing renderer function.  
4ex: if you want to change the default className or tagName of elements or add extra markup.
>**IMPORTANT:**
Renderer will receive **elementRef** function that expect the element ref as first parameter.  
Furthermore you have to pass the styles, cause they needed to proper component work.

```javascript
<Scrollbar
    wrapperRenderer={
        props =>{
        const {elementRef, ...restProps} = props;
        return <span {...restProps}
                    className="MyAwesomeWrapper"
                    ref={elementRef}/>
    }
    }
    contentRenderer={
        props =>{
        const {elementRef, ...restProps} = props;
        return <span {...restProps} 
                    className="MyAwesomeContent" 
                    ref={elementRef}/>
        }
    }
    trackXRenderer={
        props => {
        const {elementRef, ...restProps} = props;
        return <span {...restProps} 
                    className="MyAwesomeTrackVertical"
                    ref={elementRef}/>
        }
    }
    trackYRenderer={
        props => {
        const {elementRef, ...restProps} = props;
        return <span {...restProps}
                    className="MyAwesomeTrackHorizontal"
                    ref={elementRef}/>
        }
    }
    thumbXRenderer={
        props => {
        const {elementRef, ...restProps} = props;
        return <span {...restProps} 
                    className="MyAwesomeThumbVertical" 
                    ref={elementRef}/>
        }
    }
    thumbYRenderer={
        props => {
        const {elementRef, ...restProps} = props;
        return <span {...restProps} 
                    className="MyAwesomeThumbHorizontal" 
                    ref={elementRef}/>
        }
    }/>
``` 

### Component controls
Component provides scrolling control methods, a list of which you can find in the [API Documentation](./../API.md)  
To call them you have to make a reference to `<Scrollbar/>` component. Below you can see how to access component's methods and it's general DOM elements:  
```javascript
class App extends React.Component
{
    domElementsRefsExample(){
        this.refs.scrollbar.holderEl;
        this.refs.scrollbar.wrapperEl;
        this.refs.scrollbar.contentEl;
        this.refs.scrollbar.trackYEl;
        this.refs.scrollbar.trackXEl;
        this.refs.scrollbar.thumbYEl;
        this.refs.scrollbar.thumbXEl;
    }
    
    randomScrollTop(){
        this.refs.scrollbar.scrollTop = Math.floor(Math.random() * (this.refs.scrollbar.scrollHeight + 1));
    }
    
    render() {
        return <Scrollbar ref="scrollbar"/>;
    }
}
```
