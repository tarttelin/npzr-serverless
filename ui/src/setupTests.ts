import {configure, ReactWrapper} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

declare let global: any;

configure({ adapter: new Adapter()});

const wait = (time = 0) => new Promise(res => setTimeout(res, time));
global.apolloCall = (wrapperInstance:ReactWrapper, time:number = 200) => wait(time)
  .then(() => wrapperInstance.update());