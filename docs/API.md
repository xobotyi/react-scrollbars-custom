# API

### Instance properties

**`holderEl`** _`HTMLElement`_  
Reference to holder DOM element

**`wrapperEl`** _`HTMLElement`_  
Reference to wrapper DOM element

**`contentEl`** _`HTMLElement`_  
Reference to content DOM element

**`trackXEl`** _`HTMLElement`_  
Reference to horizontal DOM track

**`trackYEl`** _`HTMLElement`_  
Reference to vertical DOM track

**`thumbXEl`** _`HTMLElement`_  
Reference to horizontal DOM thumb

**`thumbYEl`** _`HTMLElement`_  
Reference to vertical DOM thumb

**`scrollValues`** _`object`_  
Current scroll related values  
>**`clientHeight`** _`number`_ content's native clientHeight parameter  
>**`clientWidth`** _`number`_ content's native clientWidth parameter  
>**`scrollHeight`** _`number`_ content's native scrollHeight parameter  
>**`scrollWidth`** _`number`_ content's native scrollWidth parameter  
>**`scrollTop`** _`number`_ content's native scrollTop parameter  
>**`scrollLeft`** _`number`_ content's native scrollLeft parameter  
>**`scrollYBlocked`** _`boolean`_ Indicates whether vertical scroll blocked via properties  
>**`scrollXBlocked`** _`boolean`_ Indicates whether horizontal scroll blocked via properties  
>**`scrollYPossible`** _`boolean`_ Indicates whether the content overflows vertically and scrolling not blocked  
>**`scrollXPossible`** _`boolean`_ Indicates whether the content overflows horizontally and scrolling not blocked  
>**`trackYVisible`** _`boolean`_ Indicates whether vertical track is visible  
>**`trackXVisible`** _`boolean`_ Indicates whether horizontal track is visible  
>**`isRtl`** _`boolean`_ Indicates whether display direction is right-to-left  

### Props

**`className`** _`string`_  
Additional classNames for the holder _(or content in case of native mode)_ element.

**`contentProps`** _`object`_  
Properties to pass to the content element.

**`contentRenderer`** _`SFC`_  
Custom content renderer.

**`fallbackScrollbarWidth`** _`number`_ = 20  
Scrollbar width for cases when automatic scrollbar width detection was not worked (mostly - for mobile devices).

**`minimalThumbsSize`** _`number`_ = 30  
Minimal size of scrollbar thumb.

**`momentum`** _`boolean`_ = true  
Use momentum scrolling on iOS.

**`native`** _`boolean`_ = false  
Do not use custom scrollbars.

**`noDefaultStyles`** _`boolean`_ = false  
Do not use default inline styles.  
>**Note:** Styles needed to proper component work will be passed _regardless of this option_.

**`noScrollX`** _`boolean`_ = false  
Disable horizontal scrolling.

**`noScrollY`** _`boolean`_ = false  
Disable vertical scrolling.

**`noScroll`** _`boolean`_ = false  
Disable any scrolling.

**`onScrollStart(scrollValues: ScrollValues)`** _`function`_  
Callback that called immediately when user started scrolling (no matter how, thumb dragging, keyboard, mousewheel and etc.).

**`onScrollStop(scrollValues: ScrollValues)`** _`function`_  
Callback that called after `scrollDetectionThreshold` milliseconds after last scroll event.

**`onScroll(scrollValues: ScrollValues, prevScrollValues: ScrollValues)`** _`function`_  
Callback that called each time any of scroll-related parameters has changed.
>**Note:** This callback is called inside `requestAnimationFrame` loop.  
>That mean that regardless of system load it will be called no more than 60 times per second. But if system overloaded - only when browser will decide to call it.

**`permanentTrackX`** _`boolean`_  
Show horizontal track regardless of scrolling possibility (by default track is shown only when scrolling is possible).

**`permanentTrackY`** _`boolean`_  
Show vertical track regardless of scrolling possibility (by default track is shown only when scrolling is possible).

**`permanentTracks`** _`boolean`_ = false  
Show both tracks regardless of scrolling possibility (by default tracks are shown only when scrolling is possible).

**`removeTrackXWhenNotUsed`** _`boolean`_  
Remove horizontal track when scrolling is not possible, otherwise it will be hidden with `display:none;` inline style.

**`removeTrackYWhenNotUsed`** _`boolean`_  
Remove vertical track when scrolling is not possible, otherwise it will be hidden with `display:none;` inline style.

**`removeTracksWhenNotUsed`** _`boolean`_ = true  
Remove tracks when scrolling is not possible, otherwise it will be hidden with `display:none;` inline style.

**`rtl`** _`boolean`_  
If true - `direction: rtl` inline styles will be applied to the **holder** _(or content in case of native mode)_ element.  
Otherwise it will be detected automatically for the **content** element regardless of the mode.

**`scrollDetectionThreshold`** _`number`_ = 100  
Amount of seconds after which scrolling will be treated as completed and `onScrollStop` callback called.

**`style`** `object`  
Additional styles for the holder _(or content in case of native mode)_ element.

**`tagName`** _`string`_ = "div" 
tagName of holder _(or content in case of native mode)_ element.

**`thumbXProps`** _`object`_  
Properties to pass to the horizontal thumb element.

**`thumbXRenderer`** _`SFC`_  
Custom horizontal thumb renderer.

**`thumbYProps`** _`object`_  
Properties to pass to the vertical thumb element.

**`thumbYRenderer`** _`SFC`_  
Custom vertical thumb renderer.

**`trackClickBehavior`** _`string`_ `"jump" | "step"` = "jump"  
If "jump" - click on the track's free area will move thumb's center straight to the clicked position.
If "step" - it will only move the thumb one length towards the click position.

**`trackXProps`** _`object`_  
Properties to pass to the horizontal track element.

**`trackXRenderer`** _`SFC`_  
Custom horizontal track renderer.

**`trackYProps`** _`object`_  
Properties to pass to the vertical track element.

**`trackYRenderer`** _`SFC`_  
Custom vertical track renderer.

**`translateContentSizesToHolder`** _`boolean`_ = false  
Content element sizes will be translated to the holder element with inline props.  
Due to the content element is always absolutely positioned - it can't stretch wrapper and holder elements. This prop solves that problem.

**`wrapperProps`** _`object`_  
Properties to pass to the wrapper element.

**`wrapperRenderer`** _`SFC`_  
Custom wrapper renderer.


### Methods

**scrollToTop ()**  
_return_ `Scrollbar`  
Scroll to the top border

**scrollToBottom ()**  
_return_ `Scrollbar`  
Scroll to the bottom border

**scrollToLeft ()**  
_return_ `Scrollbar`  
Scroll to the left border

**scrollToRight ()**  
_return_ `Scrollbar`  
Scroll to the right border

**getScrollValues ( force `boolean` = false )**  
_return_ `scrollValues`  
Return scroll values actual for the last update process. If `force` parameter is truthy - it will return current scroll values, but it will cause layout reflow.

**update ( force `boolean` = false )**  
_return_ `scrollValues`  
Actualizes scroll values and scrollbars.
