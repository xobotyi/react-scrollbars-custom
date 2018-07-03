import React      from 'react';
import { render } from 'react-dom';

import DefaultStyleScrollbarsApp from './components/DefaultStyleScrollbars/App';
import CustomStyleScrollbarsApp from './components/CustomStyleScrollbars/App';

render(<DefaultStyleScrollbarsApp />, document.getElementById('defaultScrollbarsRoot'));
render(<CustomStyleScrollbarsApp />, document.getElementById('customScrollbarsRoot'));