# API

### `<Scrollbar>`
#### Properties
* Setups
    * `defaultStyles`: _(boolean)_ Apply default inline styles _(default: false)_
    * `thumbSizeMin`: _(number)_ Minimal size of thumb in pixels _(default: 30)_
* Rendering
    * `renderView`: _(function)_ The element where content will be rendered
    * `renderTrackVertical`: _(function)_ Vertical track element
    * `renderTrackHorizontal`: _(function)_ Horizontal track element
    * `renderThumbVertical`: _(function)_ Vertical thumb element
    * `renderThumbHorizontal`: _(function)_ Horizontal thumb element
* Events handling
    * `onScroll`: _(function)_ Native scroll event handler
    * `onScrollStart`: _(function)_ Called when scrolling has started
    * `onScrollStop`: _(function)_ Called when scrolling has stopped


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