import React      from 'react';
import { render } from 'react-dom';

import AutohideScrollbarsApp     from './components/AutohideScrollbars/App';
import CustomStyleScrollbarsApp  from './components/CustomStyleScrollbars/App';
import DefaultStyleScrollbarsApp from './components/DefaultStyleScrollbars/App';
import SandboxScrollbarsApp      from './components/SandboxScrollbars/App';

render(
        [
            <DefaultStyleScrollbarsApp key="default" />,
            <CustomStyleScrollbarsApp key="custom" />,
            <AutohideScrollbarsApp key="autohide" />,
            <SandboxScrollbarsApp key="sandbox" />,
        ],
        document.getElementById('appRoot'),
);
