import React from 'react';
import ReactDom from 'react-dom';

import Cahce from 'h5_cache';
console.log('Cahce', Cahce)
const {
  LocalCache,
  SessionCache,
  MemoryCache,
} = Cahce;

class DemoCache extends LocalCache {
  constructor() {
    const options = {
      lifeTime: '2D', // 超时时间两天
      defaultData: {
        name: '',
      },
      key: 'demo_key',
    };
    super(options);
  }
}

const demoCache = DemoCache.getInstance();
const data = {
  'name': 'yanjj',
};
demoCache.set(data);
demoCache.setAttr('name', 'fanke');


export default class HelloWorldComponent extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    console.log('Hello html5-pagemanager!');
    return (
      <div> Hello html5-pagemanager! </div>
    );
  }
}


const rootInstance = ReactDom.render(
  <HelloWorldComponent />,
  document.getElementById('app')
);

if (module.hot) {
  console.log('module.hot!')
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function() {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    },
  });
}