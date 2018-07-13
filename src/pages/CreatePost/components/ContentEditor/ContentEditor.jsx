import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Grid, Form, Button, Select, DatePicker, moment, Switch, Icon, Feedback  } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { withRouter } from 'react-router';

// import RichEditor from './RichEditor';
// import RichEditor from './slate/markdownPreview';
import RichEditor from './slate/plainText';
import ReactMarkdown from 'react-markdown'
import CodeBlock from './react-markdown/code-block.js'

const { Row, Col } = Grid;
const FormItem = Form.Item;
import './index.scss'

const Toast = Feedback.toast;

@withRouter
export default class ContentEditor extends Component {
  static displayName = 'ContentEditor';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    let search = this.props.location.search, id;
    if (search.indexOf('id=')) {
      id = search.replace('?id=', '')
    } else {
      id = ''
    }
    console.log(id)
    this.state = {
        id,
        markdownText: '',
        htmlMode: 'raw',
        showUp: false,
        value: {
          title: '',
          desc: '',
          author: '',
          markdown: '',
          body: null,
          sorts: [],
          tags: [],
          status: [],
          time:  moment().format("YYYY-MM-DD HH:mm:ss"),
          hot: '0',
          recommend: '0'
        },
    };
  }

    componentDidMount() {
        if (this.state.id) {
            C.axios(C.api('getArticle'), {id: this.state.id}).then(res=> {
                if (res.code == C.code.success) {
                    res.data.sorts = res.data.sorts.split(',');
                    res.data.tags = res.data.tags.split(',');
                    this.setState({ value: res.data })
                } else {
                    Toast.error(res.msg  || '接口异常, 请联系管理人');
                }
            }).catch(error=> {
                Toast.error('獲取文章失敗');
              })
        }
    }

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  handleSubmit = () => {
    this.postForm.validateAll((errors, values) => {
        console.log(JSON.stringify(values));
      console.log('errors', errors, 'values', values);
      if (errors) {
        return false;
      }
      let value = JSON.parse(JSON.stringify(this.state.value));
      value.sorts = value.sorts.join(',');
      value.tags = value.tags.join(',');
        C.axios(C.api('saveArticle'), value).then(res=> {
            if (res.code == C.code.success) {
               this.props.history.push('/post/list');
                Toast.success('提交成功！');
            } else {
                Toast.error(res.msg  || '接口异常, 请联系管理人');
            }
        }).catch(error=> {
            console.log(error, 'error')
            Toast.error('提交文章失敗');
        })
    });
  };

  showUp() {
    this.setState({
        showUp: !this.state.showUp
    })
  }

  render() {
    return (
      <div className="content-editor">
        <IceFormBinderWrapper
          ref={(refInstance) => {
            this.postForm = refInstance;
          }}
          value={this.state.value}
          onChange={this.formChange}
        >
          <IceContainer>
            <h2 className='title-h2' style={styles.title}>
                添加文章
                <Icon type={this.state.showUp ? 'arrow-down' : 'arrow-up'} onClick={this.showUp.bind(this)} className='up' style={{ color: "#666", marginRight: "10px" }} />
            </h2>
            
            <Form labelAlign="top" style={styles.form}>
              <Row className={this.state.showUp ? 'none' : ''}>
                <Col span="11">
                  <FormItem label="标题" required>
                    <IceFormBinder name="title" required message="标题必填">
                      <Input placeholder="这里填写文章标题" />
                    </IceFormBinder>
                    <IceFormError name="title" />
                  </FormItem>
                </Col>
              </Row>
              <Row className={this.state.showUp ? 'none' : ''}>
                <Col span="5">
                  <FormItem label="作者">
                    <IceFormBinder
                      name="author"
                      message="作者信息必填"
                    >
                      <Input placeholder="填写作者名称" />
                    </IceFormBinder>
                    <IceFormError name="author" />
                  </FormItem>
                </Col>
                <Col span="5" offset="1">
                  <FormItem label="分类">
                    <IceFormBinder
                      name="sorts"
                      type="array"
                    >
                      <Select
                        style={styles.cats}
                        multiple
                        placeholder="请选择分类"
                        dataSource={[
                          { label: '分类1', value: 'cat1' },
                          { label: '分类2', value: 'cat2' },
                          { label: '分类3', value: 'cat3' },
                        ]}
                      />
                    </IceFormBinder>
                  </FormItem>
                </Col>
                <Col span="5" offset="1">
                  <FormItem label="标签">
                    <IceFormBinder
                      name="tags"
                      type="array"
                    >
                      <Select
                        style={styles.cats}
                        multiple
                        placeholder="请选择标签"
                        dataSource={[
                          { label: '标签1', value: 'cat1' },
                          { label: '标签2', value: 'cat2' },
                          { label: '标签3', value: 'cat3' },
                        ]}
                      />
                    </IceFormBinder>
                    <IceFormError
                      name="cats"
                      render={(errors) => {
                        console.log('errors', errors);
                        return (
                          <div>
                            <span style={{ color: 'red' }}>
                              {errors.map(item => item.message).join(',')}
                            </span>
                            <span style={{ marginLeft: 10 }}>
                              不知道选择什么分类？请 <a href="#">点击这里</a>{' '}
                              查看
                            </span>
                          </div>
                        );
                      }}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row className={this.state.showUp ? 'none' : ''}>
                <Col span="5">
                  <FormItem label="状态" required>
                    <IceFormBinder
                      name="status"
                    >
                      <Select
                        style={styles.cats}
                        placeholder="请选择状态"
                        dataSource={[
                          { label: '发布', value: '1' },
                          { label: '草稿', value: '2' },
                          { label: '终止', value: '3' },
                        ]}
                      />
                    </IceFormBinder>
                  </FormItem>
                </Col>
                <Col span="5" offset='1'>
                  <FormItem label="时间" required>
                    <DatePicker defaultValue={this.state.value.time} showTime onChange={(a, b) => {
                            this.setState({
                                value: Object.assign(this.state.value, {time: b})
                            })
                    }} />
                  </FormItem>
                </Col>
                <Col span="2" offset='1'>
                  <FormItem label="详情文章推荐">
                      <Switch
                        checked={this.state.value.recommend == '1'}
                        onChange={(checked)=> {
                            this.setState({
                                value: Object.assign(this.state.value, {recommend: checked ? '1' : '0'})
                            })
                        }}
                      />
                  </FormItem>
                </Col>
                <Col span="2" offset='1'>
                  <FormItem label="热门文章推荐">
                      <Switch
                        checked={this.state.value.hot == '1'}
                        onChange={(checked)=> {
                            this.setState({
                                value: Object.assign(this.state.value, {hot: checked ? '1' : '0'})
                            })
                        }}
                      />
                  </FormItem>
                </Col>
              </Row>
              <Row className={this.state.showUp ? 'none' : ''}>
                <Col span="11">
                  <FormItem label="描述">
                      <IceFormBinder name="desc">
                        <Input multiple placeholder="这里填写正文描述" />
                      </IceFormBinder>
                  </FormItem>
                </Col>
              </Row>
              <Row >
                <Col span="14">
                      <FormItem label="正文 - code" required >
                          <IceFormBinder name="body">
                                <RichEditor 
                                style={styles.editor}
                                onChange={(value)=>{
                                    let documentNodes = value.document.nodes, nodes = [], text= '';
                                    documentNodes.map(item=> {
                                        nodes.push(item)
                                    })
                                    nodes.map(item=> {
                                        let tip = item.nodes[0].leaves[0].text;
                                        text = text + (tip ? tip : '\n');
                                    })
                                    this.setState({
                                        value: Object.assign(this.state.value,  {markdown: text})
                                    })
                                }}
                                />
                          </IceFormBinder>
                      </FormItem>
                </Col>
                <Col span="9" offset='1'>
                      <FormItem label="正文 - html" required >
                          <ReactMarkdown source={this.state.value.markdown} />
                      </FormItem>
                </Col>
              </Row>
              <FormItem label=" ">
                <Button type="primary" onClick={this.handleSubmit}>
                  发布文章
                </Button>
              </FormItem>
            </Form>
          </IceContainer>
        </IceFormBinderWrapper>
      </div>
    );
  }
}

const styles = {
  editor: {
    minHeight: 500,
  },
  title: {
    margin: '0px 0px 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  form: {
    marginTop: 30,
  },
  cats: {
    width: '100%',
  }
};
