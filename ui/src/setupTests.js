import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter()});

const wait = (time = 0) => new Promise(res => setTimeout(res, time));

global.apolloCall = wrapperInstance => wait(200)
  .then(() => wrapperInstance.update());