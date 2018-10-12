import React      from 'react';
import { render } from 'react-dom';

import DefaultScrollbars from "./components/DefaultScrollbars";

render(
        [
            <DefaultScrollbars key="default" />,
        ],
        document.getElementById('AppRoot'),
);
