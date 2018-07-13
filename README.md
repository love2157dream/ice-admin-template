# ice-admin-template

> react + react-router + redux + 封装函数；代码已经封装好了常用的方法和http接口，常量，接口返回码等等，项目可以直接入手，节约开发时间


![](https://user-gold-cdn.xitu.io/2018/7/13/16494555e30ed6a4?w=1625&h=272&f=png&s=21810)

项目地址：

[ice-admin-template](https://github.com/Jaction/ice-admin-template)

ice框架[ice](https://alibaba.github.io/ice/)

使用:

* 启动调试服务: `npm start`
* 构建 dist: `npm run build`

目录结构:

* react-router @4.x 默认采用 hashHistory 的单页应用
* 入口文件: `src/index.js`
* 导航配置: `src/menuConfig.js`
* 路由配置: `src/routerConfig.js`
* 路由入口: `src/router.jsx`
* 布局文件: `src/layouts`
* 通用组件: `src/components`
* 页面文件: `src/pages`

效果图:

![screenshot](https://user-gold-cdn.xitu.io/2018/7/13/1649441ec9029852?w=1920&h=1080&f=png&s=65802)


## redux 与 react

> redux 知识点网上很多，可自行百度，在这里实践一下

redux文件结构如下

![](https://user-gold-cdn.xitu.io/2018/7/13/16494444f1425de1?w=1041&h=686&f=png&s=23681)

#### 1、引入注册
```
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import store from './store'

export default <Provider store={store}>
    <Router>{routeChildren}</Router>
</Provider>;
```
<br/>
当前代码中最主要的就是  

`import store from ./store`

store.js代码如下
```
import {createStore, combineReducers, applyMiddleware} from 'redux';
import * as tags from './store/reducer';
import thunk from 'redux-thunk';

let store = createStore(
  combineReducers({...tags}),
  applyMiddleware(thunk)
);

export default store;
```

redux-thunk解决异步的问题
放置这里的都是状态，也就是数据，这些数据有可能是接口数据，也有可能是Boolean的判断

<br/>

#### action.js

> action.js 与 reducer.js本身没有什么关系，到目前为止，没有把两种相关联起来， action只是纯函数而已

代码如下

```
import C from './../common/index';

// 初始化获取标签，保存至redux
const action = {
    tagsListFunc() {
        return dispatch => {
            C.axios(C.api('tagList')).then(res=> {
                dispatch({
                    type: 'tagsList',
                    data: res.data || []
                })
            })
        }
    },
    showToastFunc() {
        return {
            type: 'showToast'
        }
    }
}
export default action;
```

代码中用到dispatch函数，对应异步请求数据而不是纯return，则需要dispatch同步异步

<br/>

#### reduce.js
`./store/reduce.js`

```
export const reducer = (state, action) => {
    if (!state) {
        return {
            tagsList: [],
            sortsList: [],
            loading: true
        }
    }
    switch (action.type) {
        case 'tagsList': 
            state = Object.assign(state, {loading: false});
            return {
                ...state,
                tagsList: action.data
            }
            break;
        case 'sortsList': 
            state = Object.assign(state, {loading: false});
            return {
                ...state,
                sortsList: action.data
            }
            break;
        case 'showToast':
            state = Object.assign(state, {loading: true});
            return {
                ...state
            }
    }
}

```

根据action中的类型来判断return什么值到页面接受的值

<br/>
调用页面

```
import action from './../../../../store/action'
import { connect } from 'react-redux';

class TabTable extends Component {
    render() {
        return <div></div>
    }
}

TabTable = connect(state=> {
  return {
    tagsList: state.reducer.tagsList,
    loading: state.reducer.loading
  } // reducer return回来的值
}, {
  tagsListFunc: action.tagsListFunc // action中的执行函数
})(TabTable)

export default TabTable
```

react-redcux 把react和redux链接起来了，connect也把reducer和action链接来了，使得action中retrun的值相对于赋值到reducer.js中去

在页面调用函数或调用state

```
this.props.tagsListFunc();
this.props.tagsList;
```

