import React, { Component } from 'react';
import { connect } from 'react-redux'
import IceContainer from '@icedesign/container';
import PropTypes from 'prop-types'
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';

import { Feedback, Loading } from '@icedesign/base';

import action from './../../../../store/action'

const Toast = Feedback.toast;


class TabTable extends Component {
  static displayName = 'TabTable';


  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
        dataSource: [],
    };
    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 150,
      },
      {
        title: '缩写名',
        dataIndex: 'shortName',
        key: 'shortName',
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
      this.props.sortsListFunc()
  }

  getFormValues = (dataIndex, values) => {
    let _id = values._id;
    this.props.showLoading()
    C.axios(C.api('editSort'), {_id}).then(res=> {
      if (res.code == C.code.success) {
        Toast.success('修改成功')
        this.props.sortsListFunc();
      } else {
        Toast.error(res.msg || '接口异常, 请联系管理人');
      }
    }).catch(error=> {
      Toast.error(err)
    })
  };

  handleRemove = (value, index, record) => {
    let _id = record._id;
    this.props.showLoading()
    C.axios(C.api('removeSort'), {_id}).then(res=> {
      if (res.code == C.code.success) {
        Toast.success('删除成功')
        this.props.sortsListFunc();
      } else {
        Toast.error(res.msg || '接口异常, 请联系管理人');
      }
    }).catch(error=> {
      Toast.error(err)
    })
  };

  render() {
    return (
       <Loading visible={this.props.loading}  shape="fusion-reactor">
      <div className="tab-table">
        <IceContainer>
          <CustomTable
            dataSource={this.props.sortsList}
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
    sortsList: state.reducer.sortsList,
    loading: state.reducer.loading
  }
}, {
  sortsListFunc: action.sortsListFunc,
  showLoading: action.showToastFunc
  })(TabTable)

export default  TabTable