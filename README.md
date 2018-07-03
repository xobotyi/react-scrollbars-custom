<h1 align="center">react-scrollbar-custom</h1>
<p align="center">
badges will be here
</p>
<p align="center">
    <a href="https://xobotyi.github.io/react-scrollbars-custom/">DEMO</a> ♦ <a href="https://github.com/xobotyi/react-scrollbars-custom/tree/master/docs">DOCS</a>
</p>

* Fully customizable
* `requestAnimationFrame` for 60fps
* No extra stylesheets necessary
* Native scrollbars on mobile devices
* Well tested

## Installation
```bash
npm i --save react-scrollbar-custom
```

## Usage
Minimal configuration
```javascript
import React     from 'react';
import Scrollbar from 'react-scrollbar-custom';

class App extends React.Component
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
All properties and methods are in the [API Documentation](https://github.com/xobotyi/react-scrollbars-custom/tree/master/docs/API.md)

## Examples
Run the example (browser window will open automatically)
```bash
npm run examples
```

## Tests

## Coverage