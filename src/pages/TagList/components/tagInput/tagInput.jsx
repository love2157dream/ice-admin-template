import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid, Input, Button, Feedback, Loading } from '@icedesign/base';
import { withRouter } from 'react-router' 
import { connect } from 'react-redux'
import action from './../../../../store/action'
import {
  FormBinderWrapper,
  FormBinder,
  FormError,
} from '@icedesign/form-binder';
import './tagInput.scss';

const { Row, Col } = Grid;
const Toast = Feedback.toast;

@withRouter
class SimpleFluencyForm extends Component {
  static displayName = 'SimpleFluencyForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
        formValue: {
            name: '',
            shortName: '',
        },
    };
  }

  formChange = (newValue) => {
    this.setState({
      formValue: newValue,
    });
  };

  handleSubmit = () => {
    let self = this;
    this.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }
      this.props.showToast();
      C.axios(C.api('addTag'), { name: values.name, shortName: values.shortName }).then(res=> {
        if (res.code == C.code.success) {
            Toast.success('添加成功')
            this.props.tagsListFunc();
            this.setState({
                formValue: Object.assign(this.state.formValue, {
                    name: '',
                    shortName: ''
                  })
              })
        } else {
            Toast.success(res.msg)
        }
      }).catch(error=> {
            Toast.error('登录失败')
      })
    });
  };

  render() {
    return (
        <Loading visible={this.props.loading}  shape="fusion-reactor">
      <div className="simple-fluency-form" style={styles.simpleFluencyForm}>
            <IceContainer style={styles.form}>
              <FormBinderWrapper
                ref={(form) => {
                  this.form = form;
                }}
                value={this.state.formValue}
                onChange={this.formChange}
              >
                <div style={styles.formContent}>
                  <h2 style={styles.formTitle}>添加标签</h2>
                  <Row style={styles.formRow}>
                    <Col xxs="6" s="4" l="3" style={styles.formLabel}>
                      <span>标签名称：</span>
                    </Col>
                    <Col xxs="16" s="10" l="6">
                      <FormBinder required message="必填项">
                        <Input name="name" />
                      </FormBinder>
                      <div style={styles.formErrorWrapper}>
                        <FormError name="name" />
                      </div>
                    </Col>
                  </Row>
                  <Row style={styles.formRow}>
                    <Col xxs="6" s="4" l="3" style={styles.formLabel}>
                      <span>缩略名称：</span>
                    </Col>
                    <Col xxs="16" s="10" l="6">
                      <FormBinder required message="必填项">
                        <Input name="shortName" placeholder='简写，展示用，不作为搜索'/>
                      </FormBinder>
                      <div style={styles.formErrorWrapper}>
                        <FormError name="shortName" />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col offset="3">
                      <Button
                        onClick={this.handleSubmit}
                        type="primary"
                        size="large"
                      >
                        确认
                      </Button>
                    </Col>
                  </Row>
                </div>
              </FormBinderWrapper>
            </IceContainer>
      </div>
        </Loading>
    );
  }
}

SimpleFluencyForm = connect(state=> {
    return {
      tagsList: state.reducer.sortList,
      loading: state.reducer.loading
    }
  }, {
    tagsListFunc: action.tagsListFunc,
    showToast: action.showToastFunc
  })(SimpleFluencyForm)

export default SimpleFluencyForm 

const styles = {
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  formLabel: {
    textAlign: 'right',
    lineHeight: '1.7rem',
    paddingRight: '10px',
  },
  formRow: {
    marginBottom: '20px',
  },
  formErrorWrapper: {
    marginTop: '5px',
  },
  simpleFluencyForm: {},
};
