import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Pagination,Loading } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import Search from './components/Search';
import {withRouter} from 'react-router'

const TabPane = Tab.TabPane;
const Toast = Feedback.toast;


const tabs = [
  { tab: '全部', key: 'all' },
  { tab: '发布', key: '1' },
  { tab: '草稿', key: '2' },
  { tab: '终止', key: '3' },
];
@withRouter
export default class TabTable extends Component {
  static displayName = 'TabTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
        list: [],
        dataSource: {},
        tabKey: 'all',
        Loading: false,
        id: '',
        params: {
            title: '',
            author:'',
            status:'',
            startTime:'',
            endTime:'',
            hot:'',
            recommend:'',
            sorts:'',
            tags:'',
            markdown:'',
            desc:'',
            page: 1,
            size: 20
        }
    };
    this.handleChange = this.handleChange.bind(this);
    this.columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 200,
      },
      {
        title: '作者',
        dataIndex: 'author',
        key: 'author',
        width: 150,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 150,
      },
      {
        title: '发布时间',
        dataIndex: 'time',
        key: 'time',
        width: 150,
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        render: (value, index, record) => {
          return (
            <span>
              <EditDialog
                index={index}
                record={record}
                onExit={this.onExit.bind(this)}
                onLook={this.onLook.bind(this)}
              />
              <DeleteBalloon
                handleRemove={() => this.handleRemove(value, index, record)}
              />
            </span>
          );
        },
      },
    ];
  }
// {/*getFormValues={this.getFormValues}*/}

  componentDidMount() {
    this.listData()
    // axios
    //   .get('/mock/tab-table.json')
    //   .then((response) => {
    //     this.setState({
    //       dataSource: response.data.data,
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  listData () {
    this.setState({
        Loading: true
    })
    C.axios(C.api('listArticle'), this.state.params)
        .then(res=> {
            this.setState({
                Loading: false
            })
            if (res.code == C.code.success) {
                    res.data.map(item=> {
                        item.status = item.status == '1' ? '发布' : (item.status == '2' ? '草稿' : '终止');
                    })
                    this.setState({ dataSource: {all: res.data} })
            } else {
                    Toast.error(res.msg  || '接口异常, 请联系管理人');
            }
        })
        .catch(error=> {
            this.setState({
                Loading: false
            })
            Toast.error('獲取文章列表失敗');
        })
  }

  removeData() {
    this.setState({
        Loading: true
    })
    C.axios(C.api('removeArticle'), {id: this.state.id})
        .then(res=> {
            this.setState({
                Loading: false
            })
            if (res.code == C.code.success) {
                    this.listData();
                    Toast.success('删除成功');
            } else {
                    Toast.error(res.msg  || '接口异常, 请联系管理人');
            }
        })
        .catch(error=> {
            this.setState({
                Loading: false
            })
            Toast.error('獲取文章列表失敗');
        })
  }

  // getFormValues = (dataIndex, values) => {
  //   const { dataSource, tabKey } = this.state;
  //   dataSource[tabKey][dataIndex] = values;
  //   this.setState({
  //     dataSource,
  //   });
  // };
    onExit = (index)=> {
       this.props.history.push('/post/create?id=' + this.state.dataSource.all[index].id);
    }

    onLook = (index)=> {
        Toast.success('功能等待完善')
        console.log(index)
    }

  handleRemove = (value, index) => {
    const { dataSource } = this.state;
    let id = dataSource.all[index].id;
    this.setState({
        id: id
    })
    this.removeData();
  };

  handleTabChange = (key) => {
    this.setState({
        params: Object.assign(this.state.params, {status: key})
    })
    this.listData()
  }

    handleChange(current) {
        this.setState({
          params: Object.assign(this.state.params, {page: current})
        });
        this.listData()
    }

    search =(value)=> {
        this.setState({
            params: Object.assign(this.state.params, value)
        })
        console.log(this.state.params)
        this.listData();
    }

  render() {
    const { dataSource } = this.state;
    return (
      <div className="tab-table">
            <Search Loading={this.state.Loading} search={this.search.bind(this)}/>
           <Loading visible={this.state.Loading} shape="fusion-reactor">
                <IceContainer style={{ padding: '0 20px 20px' }}>
                  <Tab onChange={this.handleTabChange}>
                    {tabs.map((item) => {
                      return (
                        <TabPane tab={item.tab} key={item.key}>
                          <CustomTable
                            dataSource={dataSource[this.state.tabKey]}
                            columns={this.columns}
                            hasBorder={false}
                          />
                        </TabPane>
                      );
                    })}
                  </Tab>
                  <Pagination current={this.state.params.page} onChange={this.handleChange} />
                </IceContainer>
            </Loading>
      </div>
    );
  }
}
