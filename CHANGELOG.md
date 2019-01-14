# CHANGELOG

## v3.2.0  (tba)
**General:**  
- Component rewritten with typescript
- ESM bundle support

**Bugfixes:**  
- https://github.com/xobotyi/react-scrollbars-custom/issues/41
- https://github.com/xobotyi/react-scrollbars-custom/issues/39
- https://github.com/xobotyi/react-scrollbars-custom/issues/38
- https://github.com/xobotyi/react-scrollbars-custom/issues/29

**API changes**  
- `Scrollbar.scrollTo(y, x)` -> `Scrollbar.scrollTo(x, y)`
- `Scrollbar.centerAt(y, x)` -> `Scrollbar.centerAt(x, y)`
- `Scrollbar.props.minimalThumbsSize` -> `Scrollbar.props.minimalThumbSize`
- `Scrollbar.props.tagName` -> removed
- `Scrollbar.props.wrapperRenderer` -> `Scrollbar.props.wrapperProps.renderer`
- `Scrollbar.props.contentRenderer` -> `Scrollbar.props.contentProps.renderer`
- `Scrollbar.props.trackXRenderer` -> `Scrollbar.props.trackXProps.renderer`
- `Scrollbar.props.trackYRenderer` -> `Scrollbar.props.trackYProps.renderer`
- `Scrollbar.props.thumbXRenderer` -> `Scrollbar.props.thumbXProps.renderer`
- `Scrollbar.props.thumbYRenderer` -> `Scrollbar.props.thumbYProps.renderer`
- `Scrollbar.state.isRtl` -> `Scrollbar.state.isRTL`
- new `Scrollbar.props.elementRef`
- new `Scrollbar.props.renderer`
- `Track.props.type` -> `Track.props.axis`
- `Thumb.props.type` -> `Thumb.props.axis`
