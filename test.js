import chai             from "chai";
import spies            from "chai-spies";
import Enzyme           from 'enzyme';
import Adapter          from 'enzyme-adapter-react-16';

chai.use(spies);

Enzyme.configure({adapter: new Adapter()});

const context = require.context('./tests', true, /\.spec\.js$/);
context.keys().forEach(context);
