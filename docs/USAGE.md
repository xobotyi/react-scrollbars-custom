# USAGE

### Default
The <Scrollbar> component works out of the box, with only need of `width` and `height` to be set, inline or via CSS;
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

### Events handling
