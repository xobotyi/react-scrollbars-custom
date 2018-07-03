# API

### `<Scrollbar>`
#### Properties
* Setups
    * `defaultStyles`: _(boolean)_ Apply default inline styles _(default: false)_
    * `thumbSizeMin`: _(number)_ Minimal size of thumb in pixels _(default: 30)_
    * `scrollDetectionThreshold`: _(number)_ Scroll process check interval in milliseconds _(default: 100)_
* Rendering
    * `renderView`: _(function)_ The element where content will be rendered
    * `renderTrackVertical`: _(function)_ Vertical track element
    * `renderTrackHorizontal`: _(function)_ Horizontal track element
    * `renderThumbVertical`: _(function)_ Vertical thumb element
    * `renderThumbHorizontal`: _(function)_ Horizontal thumb element
* Events handling
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
    * `onScrollStart (values)`: _(function)_ Called when scrolling has started
        * `values`: _(object)_ Values representing scrolling position for the scroll start moment
    * `onScrollStop (values)`: _(function)_ Called when scrolling has stopped
        * `values`: _(object)_ Values representing scrolling position for the scroll stop moment


#### Methods
* `(get|set) scrollTop` get or set the scrollTop value _(as in vanila JS)_
* `(get|set) scrollLeft` get or set the scrollLeft value _(as in vanila JS)_
* `(get) scrollHeight` get the scrollHeight value _(as in vanila JS)_
* `(get) scrollWidth` get the scrollWidth value _(as in vanila JS)_
* `(get) clientHeight` get the clientHeight value _(as in vanila JS)_
* `(get) clientWidth` get the clientWidth value _(as in vanila JS)_
* `scrollToTop()` scroll to the top border
* `scrollToBottom()` scroll to the bottom border
* `scrollToLeft()` scroll to the left border
* `scrollToRight()` scroll to the right border