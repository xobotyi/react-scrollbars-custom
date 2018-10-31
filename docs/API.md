# API

### `<Scrollbar>`
#### Properties
* **Setups**
    * `nativeScrollbars`: _(boolean)_ User browser's native scrollbars instead of custom _(default: false)_
    * `defaultStyles`: _(boolean)_ Apply default inline styles _(default: false)_
    * `fallbackScrollbarWidth`: _(number)_ Number of pixels that will be treated as scrollbar width if automated scrollbar width detection will fail. _This parameter used on mobiles, because scrollbars there has an absolute positioning and can't be measured._ _(default: 20)_
    * `minimalThumbsSize`: _(number)_ Minimal size of thumb in pixels _(default: 30)_
    * `rtl`: _(boolean)_ Override the direction style parameter _(default: undefined)_
    * `momentum`: _(boolean)_ Whether to use momentum scrolling on iOS _(default: true)_
    * `noScroll`: _(boolean)_ Disable both vertical and horizontal scrolling _(default: false)_
    * `noScrollY`: _(boolean)_ Disable vertical scrolling _(default: false)_
    * `noScrollX`: _(boolean)_ Disable horizontal scrolling _(default: false)_
    * `permanentScrollbars`: _(boolean)_ Display both, vertical and horizontal scrollbars permanently, in spite of scrolling possibility _(default: false)_
    * `permanentScrollbarY`: _(boolean)_ Display vertical scrollbar permanently, in spite of scrolling possibility  _(default: false)_
    * `permanentScrollbarX`: _(boolean)_ Display horizontal scrollbar permanently, in spite of scrolling possibility  _(default: false)_
    * `scrollDetectionThreshold`: _(number)_ Scroll process check interval in milliseconds _(default: 100)_
    * `contentSizeTrack`: _(boolean)_ Automatically check content's sizes to actualize the scrollbars. Useful when dom is changed not only by react. _(default: false)_
    * `contentSizeTrackInterval`: _(number)_ Interval between content's size check, in milliseconds _(default: 200)_
    * `className`: _(string)_ Additional classname to add to holder element _(default: undefined)_
    * `wrapperClassName`: _(string)_ Additional classname to add to wrapper element _(default: undefined)_
    * `contentClassName`: _(string)_ Additional classname to add to content element _(default: undefined)_
    * `trackVerticalClassName`: _(string)_ Additional classname to add to vertical track element _(default: undefined)_
    * `trackHorizontalClassName`: _(string)_ Additional classname to add to horizontal track element _(default: undefined)_
    * `thumbVerticalClassName`: _(string)_ Additional classname to add to vertical track element _(default: undefined)_
    * `thumbHorizontalClassName`: _(string)_ Additional classname to add to horizontal track element _(default: undefined)_
    * `style`: _(object)_ Additional styles for holder element _(default: undefined)_
    * `wrapperStyle`: _(object)_ Additional styles for wrapper element _(default: undefined)_
    * `contentStyle`: _(object)_ Additional styles for content element _(default: undefined)_
    * `trackVerticalStyle`: _(object)_ Additional styles for vertical track element _(default: undefined)_
    * `trackHorizontalStyle`: _(object)_ Additional styles for horizontal track element _(default: undefined)_
    * `thumbVerticalStyle`: _(object)_ Additional styles for vertical track element _(default: undefined)_
    * `thumbHorizontalStyle`: _(object)_ Additional styles for horizontal track element _(default: undefined)_
* **Rendering**
    * `renderWrapper`: _(function)_ The element that wraps the content in order to hide browser's scrollbars
    * `renderContent`: _(function)_ The element where content will be rendered
    * `renderTrackVertical`: _(function)_ Vertical track element
    * `renderTrackHorizontal`: _(function)_ Horizontal track element
    * `renderThumbVertical`: _(function)_ Vertical thumb element
    * `renderThumbHorizontal`: _(function)_ Horizontal thumb element
* **Events handling**
    * `onScroll (scrollValues, scrollbar)`: _(function)_ Called when any scroll related property has changed, including forced update call
        * `scrollValues`  _(object)_ Values representing current scrolling position
            * `scrollTop`: _(number)_ Native scrollTop
            * `scrollLeft`: _(number)_ Native scrollLeft
            * `scrollHeight`: _(number)_ Native scrollHeight
            * `scrollWidth`: _(number)_ Native scrollWidth
            * `clientWidth`: _(number)_ Native clientWidth
            * `clientHeight`: _(number)_ Native clientHeight
        * `scrollbar`: _(Scrollbar)_ Scrollbar instance
    * `onScrollStart (scrollbar)`: _(function)_ Called when scrolling has started
        * `scrollbar`: _(Scrollbar)_ Scrollbar instance
    * `onScrollStop (scrollbar)`: _(function)_ Called when scrolling has stopped
        * `scrollbar`: _(Scrollbar)_ Scrollbar instance


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
* `update(forced=false, rtlAutodetect=false)`: _(Scrollbar)_ Updates the scrollbars. By default if content or wrapper sizes did not changed - update will not be performed.
    * `forced`: _(boolean)_ Whether to update the scrollbars even nothing has changed _(default: false)_
    * `rtlAutodetect`: _(boolean)_ Whether to check and actualize CSS direction value _(default: false)_
Keep in mind that forced update will either trigger `onScroll` callback.  
