<h1 align="center">react-scrollbar-custom</h1>
<p align="center">
<a href="https://www.npmjs.com/package/react-scrollbar-custom"><img src="https://img.shields.io/badge/npm-react--scrollbar--custom-brightgreen.svg" /></a>
<a href="https://www.npmjs.com/package/react-scrollbar-custom"><img src="https://img.shields.io/npm/l/react-scrollbar-custom.svg" /></a>
<a href="https://www.npmjs.com/package/react-scrollbar-custom"><img src="https://img.shields.io/npm/v/react-scrollbar-custom.svg" /></a>
<a href="https://www.npmjs.com/package/react-scrollbar-custom"><img src="https://img.shields.io/npm/dt/react-scrollbar-custom.svg" /></a>
<a></a>
</p>
<p align="center">
    <a href="https://xobotyi.github.io/react-scrollbars-custom/">DEMO</a> · <a href="https://github.com/xobotyi/react-scrollbars-custom/tree/master/docs">DOCUMENTATION</a>
</p>

* Fully customizable
* `requestAnimationFrame` for 60fps
* No extra stylesheets necessary
* Cross-browser
* Native scrollbars on mobile devices

>**IMPORTANT:** default component styles uses [grid layout](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout) for proper scrollbars display.  
>But you can change it with help of [customisation](https://github.com/xobotyi/react-scrollbars-custom/tree/master/docs/CUSTOMISATION.md). 

## Installation
```bash
npm i --save react-scrollbar-custom
```

## Usage
Minimal configuration
```javascript
import React, { Component }  from 'react';
import Scrollbar from 'react-scrollbar-custom';

class App extends Component
{
    render() {
        return (
                <Scrollbar style={ {width: '100%', minHeight: 300} } >
                    <p>Hello world!</p>
                </Scrollbar>
        );
    }
}
```
All properties and methods are in the [API Documentation](https://github.com/xobotyi/react-scrollbars-custom/tree/master/docs/API.md)

## Examples
Run the example, it will install dependencies, build current component version and run local web-server listening `localhost:3000` (browser window will open automatically)
```bash
npm run examples
```

## Credits
Big thanks to [@malte-wessel](https://github.com/malte-wessel) with his [react-custom-scrollbars](https://github.com/malte-wessel/react-custom-scrollbars) which I used before writing this component.  
So don't be wondered that repos and code look similar in some places, his package used as ethalon. And for the users convenience i've tried to make API's seamless as much as it possible.