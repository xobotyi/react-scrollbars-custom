# API

### `<Scrollbar>`
#### Properties
* **Setups**
    * `defaultStyles`: _(boolean)_ Apply default inline styles _(default: false)_
    * `thumbSizeMin`: _(number)_ Minimal size of thumb in pixels _(default: 30)_
    * `scrollDetectionThreshold`: _(number)_ Scroll process check interval in milliseconds _(default: 100)_
    * `permanentScrollbars`: _(boolean)_ Display both, vertical and horizontal scrollbars permanently, in spite of scrolling possibility _(default: false)_
    * `permanentScrollbarVertical`: _(boolean)_ Display vertical scrollbar permanently, in spite of scrolling possibility  _(default: false)_
    * `permanentScrollbarHorizontal`: _(boolean)_ Display horizontal scrollbar permanently, in spite of scrolling possibility  _(default: false)_
    * `contentSizeTrack`: _(boolean)_ Automatically check content's sizes to actualize the scrollbars. Useful when dom is changed not only by react. _(default: false)_
    * `contentSizeTrackInterval`: _(number)_ Interval between content's size check, in milliseconds _(default: 200)_
* **Rendering**
    * `renderWrapper`: _(function)_ The element that wraps the content in order to hide browser's scrollbars
    * `renderContent`: _(function)_ The element where content will be rendered
    * `renderTrackVertical`: _(function)_ Vertical track element
    * `renderTrackHorizontal`: _(function)_ Horizontal track element
    * `renderThumbVertical`: _(function)_ Vertical thumb element
    * `renderThumbHorizontal`: _(function)_ Horizontal thumb element
* **Events handling**  
All of these event handlers will be called inside the animation frame  
    * `onScroll ({event, ...values})`: _(function)_ Scroll event handler
        * `event`: Native scroll event
        * `values`: _(object)_ Values representing current scrolling position
            * `values.top`: _(number)_ scrollTop progress, from 0 to 1
            * `values.left`: _(number)_ scrollLeft progress, from 0  to 1
            * `values.scrollTop`: _(number)_ Native scrollTop
            * `values.scrollLeft`: _(number)_ Native scrollLeft
            * `values.scrollHeight`: _(number)_ Native scrollHeight
            * `values.scrollWidth`: _(number)_ Native scrollWidth
            * `values.clientWidth`: _(number)_ Native clientWidth 
            * `values.clientHeight`: _(number)_ Native clientHeight 
    * `onUpdate (values)`: _(function)_ Called when the component is updated
        * `values`: _(object)_ Values representing scrolling position for the scroll start moment
    * `onScrollStart (values)`: _(function)_ Called when scrolling has started
        * `values`: _(object)_ Values representing scrolling position for the scroll start moment
    * `onScrollStop (values)`: _(function)_ Called when scrolling has stopped
        * `values`: _(object)_ Values representing scrolling position for the scroll stop moment


#### Methods
* `(get|set) scrollTop`: _(number)_ Get or set the scrollTop value _(as in vanila JS)_
* `(get|set) scrollLeft`: _(number)_ Get or set the scrollLeft value _(as in vanila JS)_
* `(get) scrollHeight`: _(number)_ Get the scrollHeight value _(as in vanila JS)_
* `(get) scrollWidth`: _(number)_ Get the scrollWidth value _(as in vanila JS)_
* `(get) clientHeight`: _(number)_ Get the clientHeight value _(as in vanila JS)_
* `(get) clientWidth`: _(number)_ Get the clientWidth value _(as in vanila JS)_
* `scrollToTop()`: _(Scrollbar)_ Scroll to the top border
* `scrollToBottom()`: _(Scrollbar)_ Scroll to the bottom border
* `scrollToLeft()`: _(Scrollbar)_ Scroll to the left border
* `scrollToRight()`: _(Scrollbar)_ Scroll to the right border
* `update()`: _(Scrollbar)_ Updates the scrollbars. Useful when external, non-react libraries are changing scrollable content
* `getScrollValues()`: _(object)_ Get values representing current scrolling position