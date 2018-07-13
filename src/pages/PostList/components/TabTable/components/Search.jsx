/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Input, Select, Grid, Button, Icon, DatePicker, moment,Feedback   } from '@icedesign/base';
import { FormBinderWrapper, FormBinder } from '@icedesign/form-binder';
import IceContainer from '@icedesign/container';

const { RangePicker } = DatePicker;

const { Row, Col } = Grid;

const Toast = Feedback.toast

export default class UserTable extends Component {
  static displayName = 'UserTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      formValue: {},
      sortList: [],
      tagList:[]
    };
  }

  componentDidMount = ()=> {
    C.axios(C.api('sortList'))
      .then(res=> {
        if (res.code == C.code.success) {
          this.setState({
            sortList: res.data
          })
        } else {
          Toast.error(res.msg  || '接口异常, 请联系管理人');
        }
      })
      .catch(err=> {
        Toast.error('分类列表失敗');
      })
    C.axios(C.api('tagList'))
      .then(res=> {
        if (res.code == C.code.success) {
          this.setState({
            tagList: res.data
          })
        } else {
          Toast.error(res.msg  || '接口异常, 请联系管理人');
        }
      })
      .catch(err=> {
        Toast.error('分类列表失敗');
      })
  }

  enterLoading = ()=> {
    this.props.search(this.state.formValue);
    console.log(this.state.formValue)
  }


  formChange = (value) => {
    if (value.hasOwnProperty('sorts') && value.sorts instanceof Array) {
      if (value.sorts.length > 1) {
        value.sorts = value.sorts.join(',')
      } else {
        value.sorts = value.sorts[0]
      }
    }
    if (value.hasOwnProperty('tags') && value.tags instanceof Array) {
      if (value.tags.length > 1) {
        value.tags = value.tags.join(',')
      } else {
        value.tags = value.tags[0]
      }
    }
    console.log('changed value', value);
    this.setState({
      formValue: value,
    });
  };

  render() {
    const { formValue } = this.state;
    const sortList = this.state.sortList;
    const tagList = this.state.tagList;
    return (
      <IceContainer title="搜索">
        <FormBinderWrapper value={formValue} onChange={this.formChange}>
          <Row wrap>
            <Col xxs="24" l="8" style={styles.formCol}>
              <span style={styles.label}>标题:</span>
              <FormBinder name="title">
                <Input />
              </FormBinder>
            </Col>
            <Col xxs="24" l="8" style={styles.formCol}>
              <span style={styles.label}>作者:</span>
              <FormBinder name="author">
                <Input />
              </FormBinder>
            </Col>
            <Col xxs="24" l="8" style={styles.formCol}>
              <span style={styles.label}>标签:</span>
              <FormBinder name="tags">
                <Select placeholder="请选择" style={{ width: '200px' }} multiple>
                    {
                        tagList.map(item=> {
                            return <Select.Option value={item.name}>{item.name}</Select.Option>
                        })
                    }
                </Select>
              </FormBinder>
            </Col>
            <Col xxs="24" l="8" style={styles.formCol}>
              <span style={styles.label}>分类:</span>
              <FormBinder name="sorts">
                <Select placeholder="请选择" style={{ width: '200px' }} multiple>
                    {
                        sortList.map(item=> {
                            return <Select.Option value={item.name}>{item.name}</Select.Option>
                        })
                    }
                </Select>
              </FormBinder>
            </Col>
            <Col xxs="24" l="8" style={styles.formCol}>
              <span style={styles.label}>热门:</span>
              <FormBinder name="hot">
                <Select placeholder="请选择" style={{ width: '200px' }}>
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value="0">否</Select.Option>
                  <Select.Option value="1">是</Select.Option>
                </Select>
              </FormBinder>
            </Col>
            <Col xxs="24" l="8" style={styles.formCol}>
              <span style={styles.label}>推荐:</span>
              <FormBinder name="recommend">
                <Select placeholder="请选择" style={{ width: '200px' }}>
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value="0">否</Select.Option>
                  <Select.Option value="1">是</Select.Option>
                </Select>
              </FormBinder>
            </Col>
            <Col xxs="24" l="16" style={styles.formCol}>
                <span style={styles.label}>时间:</span>
                <RangePicker showTime onChange={(a, b) => {
                  this.setState({
                    formValue: Object.assign(this.state.formValue, {startTime: b[0], endTime: b[1]})
                  })
                }} />
            </Col>
            <Col xxs="24" l="8" style={styles.formCol}>
            </Col>
            <Col xxs="24" l="8" style={styles.formCol}>
            <Button
              type="primary"
              loading={this.props.Loading}
              onClick={this.enterLoading.bind(this)}
            >
            搜索
            </Button>
            </Col>
          </Row>
        </FormBinderWrapper>
      </IceContainer>
    );
  }
}

const styles = {
  formRow: {
    marginBottom: '18px',
  },
  formCol: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  label: {
    lineHeight: '28px',
    paddingRight: '10px',
  },
};
