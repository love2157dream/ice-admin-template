import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { Feedback, Loading } from '@icedesign/base';
import { connect } from 'react-redux';
import action from './../../../../store/action'
import PropTypes from 'prop-types';


const Toast = Feedback.toast;

const MOCK_DATA = [
  {
    id: 'asdf',
    name: 'React Native',
    shortName: 'RN'
  }
];

class TabTable extends Component {
  static displayName = 'TabTable';

  static propTypes = {
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
    this.columns = [
      {
        title: '标签名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
      },
      {
        title: '缩写名称',
        dataIndex: 'shortName',
        key: 'shortName',
        width: 200,
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
                getFormValues={this.getFormValues}
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

  componentDidMount () {
      this.props.tagsListFunc();
  }

  getFormValues = (dataIndex, values) => {
    let _id = values._id;
    C.axios(C.api('editTag'), {_id}).then(res=> {
      if (res.code == C.code.success) {
        Toast.success('修改成功')
        this.props.tagsListFunc()
      } else {
        Toast.error(res.msg || '接口异常, 请联系管理人');
      }
    }).catch(error=> {
      Toast.error(err)
    })
  };

  handleRemove = (value, index, record) => {
    let _id = record._id;
    C.axios(C.api('removeTag'), {_id}).then(res=> {
      if (res.code == C.code.success) {
        Toast.success('删除成功')
        this.props.tagsListFunc()
      } else {
        Toast.error(res.msg || '接口异常, 请联系管理人');
      }
    }).catch(error=> {
      Toast.error(err)
    })
  };

  render() {
    console.log(this.props.loading)
    return (
      <Loading visible={this.props.loading}  shape="fusion-reactor">
      <div className="tab-table">
        <IceContainer>
          <CustomTable
            dataSource={this.props.tagsList}
            columns={this.columns}
            hasBorder={false}
          />
        </IceContainer>
      </div>
      </Loading>
    );
  }
}
TabTable = connect(state=> {
  return {
    tagsList: state.reducer.tagsList,
    loading: state.reducer.loading
  }
}, {
  tagsListFunc: action.tagsListFunc
})(TabTable)

export default TabTable 
