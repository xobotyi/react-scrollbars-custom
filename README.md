<h1 align="center">react-scrollbars-custom</h1>
<p align="center">
    <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/badge/npm-react--scrollbars--custom-brightgreen.svg" /></a>
    <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/npm/v/react-scrollbars-custom.svg" /></a>
    <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/npm/dt/react-scrollbars-custom.svg" /></a>
    <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/travis/xobotyi/react-scrollbars-custom.svg" /></a>
    <a href="https://www.codacy.com/app/xobotyi/react-scrollbars-custom"><img src="https://api.codacy.com/project/badge/Grade/f0875490cea1497a9eca9c25f3f7774e"/></a>
    <a href="https://www.codacy.com/app/xobotyi/react-scrollbars-custom"><img src="https://api.codacy.com/project/badge/Coverage/f0875490cea1497a9eca9c25f3f7774e"/></a>
    <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/npm/l/react-scrollbars-custom.svg" /></a>
</p>
<p align="center">
    <strong><a href="https://xobotyi.github.io/react-scrollbars-custom/">DEMO</a> · <a href="https://github.com/xobotyi/react-scrollbars-custom/tree/master/docs">DOCUMENTATION</a></strong>
</p>

* Native browser scrolling behaviour - component don't emulate scrolling, only showing custom scrollbars
* Ultimate performance - 60 fps with help of RAF loop
* Desktop or mobile - scrollbars looks the same on any device
* No extra stylesheets required - minimum inline styles out of the box
* Fully customizable - want a hippo as a scrollbar thumb? Well.. I don't judge you
* No matter what changes the content - scrollbars always stay actual
* Total tests coverage
* Scrollbars nesting
* RTL support ([read more](https://github.com/xobotyi/react-scrollbars-custom/blob/master/docs/USAGE.md#rtl-support))
* momentum scrolling for iOS

>**IMPORTANT:** default component styles uses [Flexible Box Layout](https://developer.mozilla.org/ru/docs/Web/CSS/CSS_Flexible_Box_Layout) for proper scrollbars display.  
>But you can customize it with help pf inline or linked styles as you wish ([see docs](https://github.com/xobotyi/react-scrollbars-custom/blob/master/docs/CUSTOMISATION.md)). 

## Installation
```bash
npm i --save react-scrollbars-custom
```

## Usage
Minimal configuration
```javascript
class App extends Component
{
    render() {
        return (
                <Scrollbar style={ {width: '100%', height: '100%', minHeight: 300} } >
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
# install dependencies if you haven't yet
npm install
npm run examples
```

## Tests
```bash
# install dependencies if you haven't yet
npm install
npm run test
```

## Coverage
```bash
# install dependencies if you haven't yet
npm install
npm run test:coverage
```

## Credits
Big thanks to [@malte-wessel](https://github.com/malte-wessel) with his [react-custom-scrollbars](https://github.com/malte-wessel/react-custom-scrollbars) which I used before writing this component.  
So don't be wondered that repos and code look similar in some places, his package used as ethalon. And for the users convenience i've tried to make API's seamless as much as it possible.
