/* eslint  react/no-string-refs: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Button, Radio, Switch, Upload, Grid, Feedback } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import './SettingsForm.scss';

const { Row, Col } = Grid;
const Toast = Feedback.toast;
const { Group: RadioGroup } = Radio;
const { ImageUpload } = Upload;

function beforeUpload(info) {
  console.log('beforeUpload callback : ', info);
}

function onChange(info) {
  console.log('onChane callback : ', info);
}

function onSuccess(res, file) {
  console.log('onSuccess callback : ', res, file);
}

function onError(file) {
  console.log('onError callback : ', file);
}



export default class SettingsForm extends Component {
  static displayName = 'SettingsForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
        qiniu: {
            url: 'http://upload.qiniu.com',
            Bucket:'sponingblog',
            AK: 'TSlScX_akS5TIpsXlkqHH2gy7Efk-ZaZeg4ZWtta',
            SK: 'X-MGLySWVrWFIQKTn87HWDIBvb3ni4Zm3qwZNKxk',
            qiniuPath: 'http://p8iuuo4mh.bkt.clouddn.com'
        },
        qiniuToken: { token: ''},
      value: {
        name: '',
        gender: 'male',
        WeChat: '',
        personWeChat: '',
        officialWeChat: '',
        email: '',
        avatar: '',
        siteUrl: '',
        githubUrl: '',
        description: '',
      },
      isUserBasicsSubmit: true,
      avatarFileList: [],
      personWeChatFileList: [],
      officialWeChatFileList: []
    };
  }

  componentDidMount() {
    C.axios(C.api('qiniuToken')).then(res=> {
        if (res.code == C.code.success) {
            this.setState({qiniuToken: {token: res.data}})
        } else {
            Toast.error('七牛云token获取失败')
        }
    }).catch(error=>{
        Toast.error('七牛云token接口异常，请联系管理人')
    })
    //
    C.axios(C.api('getUserBasics')).then(res=> {
        if (res.code == C.code.success) {
            this.setState({
                value: res.data,
                avatarFileList: [{
                    name: res.data.avatar.split('/')[res.data.avatar.split('/').length - 1],
                    status: "done",
                    downloadURL: res.data.avatar,
                    fileURL: res.data.avatar,
                    imgURL: res.data.avatar
                }],
                personWeChatFileList: [{
                    name: res.data.personWeChat.split('/')[res.data.personWeChat.split('/').length - 1],
                    status: "done",
                    downloadURL: res.data.personWeChat,
                    fileURL: res.data.personWeChat,
                    imgURL: res.data.personWeChat
                }],
                officialWeChatFileList: [{
                    name: res.data.officialWeChat.split('/')[res.data.officialWeChat.split('/').length - 1],
                    status: "done",
                    downloadURL: res.data.officialWeChat,
                    fileURL: res.data.officialWeChat,
                    imgURL: res.data.officialWeChat
                }]
            })
        } else {
            Toast.error('用户信息获取失败')
        }
    }).catch(error=>{
        Toast.error('用户信息获取失败，请联系管理人')
    })
  }

  onDragOver = () => {
    console.log('dragover callback');
  };

  onDrop = (fileList) => {
    console.log('drop callback : ', fileList);
  };

  formChange = (value) => {
    if (value.avatar.hasOwnProperty('file')) {
        value.avatar = value.avatar.file.imgURL;
    }
    if (value.officialWeChat.hasOwnProperty('file')) {
        value.officialWeChat = value.officialWeChat.file.imgURL;
    }
    if (value.personWeChat.hasOwnProperty('file')) {
        value.personWeChat = value.personWeChat.file.imgURL;
    }
    console.log('value', value);
    this.setState({
      value,
    });
  };

  onUploadChange(info) {
        if (info.file.status == 'removed') {
            C.axios(C.api('deleteQiniuImg'), {
                BuckeName:'sponingblog',
                key: this.state.value.avatar.split('/')[this.state.value.avatar.split('/').length - 1]
            }).then(res=> {
                if (res.code == C.code.success) {
                    Toast.success('删除成功')
                    // this.setState({
                    //     avatarFileList: [],
                    //     values: Object.assign({
                    //         avatar: ''
                    //     })
                    // })
                } else {
                    Toast.error('删除失败')
                }
            }).catch(error=> {
                    Toast.error('图片删除失败，请联系管理人')
            })
        } else {
            return;
        }
  }
    onUploadChangeOfficialWeChat(info) {
        if (info.file.status == 'removed') {
            C.axios(C.api('deleteQiniuImg'), {
                BuckeName:'sponingblog',
                key: this.state.value.officialWeChat.split('/')[this.state.value.officialWeChat.split('/').length - 1]
            }).then(res=> {
                if (res.code == C.code.success) {
                    Toast.success('删除成功')
                        // this.setState({
                        //     officialWeChatFileList: [],
                        //     values: Object.assign({
                        //         officialWeChat: ''
                        //     })
                        // })
                } else {
                    Toast.error('删除失败')
                }
            }).catch(error=> {
                    Toast.error('图片删除失败，请联系管理人')
            })
        } else {
            return;
        }
  }
    onUploadChangePersonWeChat(info) {
        if (info.file.status == 'removed') {
            C.axios(C.api('deleteQiniuImg'), {
                BuckeName:'sponingblog',
                key: this.state.value.personWeChat.split('/')[this.state.value.personWeChat.split('/').length - 1]
            }).then(res=> {
                if (res.code == C.code.success) {
                    Toast.success('删除成功')
                    // this.setState({
                    //     personWeChatFileList: [],
                    //     values: Object.assign({
                    //         personWeChat: ''
                    //     })
                    // })
                } else {
                    Toast.error('删除失败')
                }
            }).catch(error=> {
                    Toast.error('图片删除失败，请联系管理人')
            })
        } else {
            return;
        }
  }

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
        console.log('errors', errors, 'values', values);
        C.axios(C.api('userBasics'), this.state.value).then(res=> {
            console.log(res)
            if (res.code == C.code.success) {
                this.setState({
                    isUserBasicsSubmit: !this.state.isUserBasicsSubmit
                })
                Toast.success('提交成功')
            } else {
                Toast.error('用户信息提交失败')
            }
        }).catch(error=>{
            console.log(error)
            Toast.error('用户信息提交失败，请联系管理人')
        })
    });
  };

  render() {
    return (
      <div className="settings-form">
        <IceContainer>
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formContent}>
              <h2 style={styles.formTitle}>基本设置</h2>

              <Row style={styles.formItem}>
                <Col xxs="6" s="4" l="4" style={styles.label}>
                  姓名：
                </Col>
                    {
                        this.state.isUserBasicsSubmit ? <Col xxs="16" s="10" l="6">
                            <span>{this.state.value.name}</span>
                        </Col>
                        : <Col xxs="16" s="10" l="6">
                              <IceFormBinder name="name" required max={10} message="必填">
                                <Input size="large" placeholder="于江水" />
                              </IceFormBinder>
                              <IceFormError name="name" />
                            </Col>
                    }
                
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="4" l="4" style={styles.label}>
                  头像：
                </Col>
                {
                    this.state.isUserBasicsSubmit ? 
                        <Col xxs="16" s="10" l="6">
                        <img
                            ref="targetViewer"
                            src={this.state.value.avatar}
                            width="100px"
                            height="120px"
                          /> 
                        </Col>
                      : 
                    <Col xxs="16" s="10" l="6">
                      <IceFormBinder name='avatar'>
                        <ImageUpload
                          listType="picture-card"
                          limit={1}
                          action={this.state.qiniu.url}
                          fileList={this.state.avatarFileList}
                          accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                          data={this.state.qiniuToken}
                          locale={{
                            image: {
                              cancel: '取消上传',
                              addPhoto: '上传图片',
                            },
                          }}
                          formatter={(res)=>{
                                let imgURL = this.state.qiniu.qiniuPath + "/" + res.key;
                                this.setState({
                                        avatarFileList: [{
                                            name: res.key,
                                            status: "done",
                                            downloadURL: imgURL,
                                            fileURL: imgURL,
                                            imgURL: imgURL
                                        }],
                                        value: Object.assign(this.state.value, {
                                            avatar: imgURL
                                        })
                                    })
                          }}
                          onChange= {this.onUploadChange.bind(this)}
                        />
                      </IceFormBinder>
                    </Col>
                }
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="4" l="4" style={styles.label}>
                  公众号二维码：
                </Col>
                {
                    this.state.isUserBasicsSubmit ? 
                        <Col xxs="16" s="10" l="6">
                        <img
                            ref="targetViewer"
                            src={this.state.value.officialWeChat}
                            width="100px"
                            height="120px"
                          /> 
                        </Col>
                      : 
                        <Col xxs="16" s="10" l="6">
                          <IceFormBinder name="officialWeChat">
                            <ImageUpload
                              listType="picture-card"
                              limit={1}
                              action={this.state.qiniu.url}
                              fileList={this.state.officialWeChatFileList}
                              accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                              data={this.state.qiniuToken}
                              locale={{
                                image: {
                                  cancel: '取消上传',
                                  addPhoto: '上传图片',
                                },
                              }}
                              formatter={(res)=>{
                                    let imgURL = this.state.qiniu.qiniuPath + "/" + res.key;
                                    this.setState({
                                            officialWeChatFileList: [{
                                                name: res.key,
                                                status: "done",
                                                downloadURL: imgURL,
                                                fileURL: imgURL,
                                                imgURL: imgURL
                                            }],
                                            value: Object.assign(this.state.value, {
                                                officialWeChat: imgURL
                                            })
                                        })
                              }}
                              onChange= {this.onUploadChangeOfficialWeChat.bind(this)}
                            />
                          </IceFormBinder>
                        </Col>
                    }
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="4" l="4" style={styles.label}>
                  个人微信二维码： 
                </Col>
                {
                    this.state.isUserBasicsSubmit ? 
                        <Col xxs="16" s="10" l="6">
                        <img
                            ref="targetViewer"
                            src={this.state.value.personWeChat}
                            width="100px"
                            height="120px"
                          /> 
                        </Col>
                      : 
                            <Col xxs="16" s="10" l="6">
                              <IceFormBinder name="personWeChat">
                                <ImageUpload
                                  listType="picture-card"
                                  limit={1}
                                  action={this.state.qiniu.url}
                                  fileList={this.state.personWeChatFileList}
                                  accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                                  data={this.state.qiniuToken}
                                  locale={{
                                    image: {
                                      cancel: '取消上传',
                                      addPhoto: '上传图片',
                                    },
                                  }}
                                  formatter={(res)=>{
                                        let imgURL = this.state.qiniu.qiniuPath + "/" + res.key;
                                        this.setState({
                                                personWeChatFileList: [{
                                                    name: res.key,
                                                    status: "done",
                                                    downloadURL: imgURL,
                                                    fileURL: imgURL,
                                                    imgURL: imgURL
                                                }],
                                                value: Object.assign(this.state.value, {
                                                    personWeChat: imgURL
                                                })
                                            })
                                  }}
                                  onChange= {this.onUploadChangePersonWeChat.bind(this)}
                                />
                              </IceFormBinder>
                            </Col>
                        }
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="4" l="4" style={styles.label}>
                  个人微信号：
                </Col>
                {
                    this.state.isUserBasicsSubmit ? 
                    <Col xxs="16" s="10" l="6">
                        <span>{this.state.value.WeChat}</span>
                    </Col> : <Col xxs="16" s="10" l="6">
                              <IceFormBinder name="WeChat" >
                                <Input size="large" placeholder="" />
                              </IceFormBinder>
                              <IceFormError name="WeChat" />
                            </Col>
                }
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="4" l="4" style={styles.label}>
                  性别：
                </Col>
                {
                    this.state.isUserBasicsSubmit ? 
                    <Col xxs="16" s="10" l="6"><span>{this.state.value.gender == 'male' ? '男':'女'}</span></Col> :
                    <Col xxs="16" s="10" l="6">
                      <IceFormBinder name="gender" required message="必填">
                        <RadioGroup>
                          <Radio value="male">男</Radio>
                          <Radio value="female">女</Radio>
                        </RadioGroup>
                      </IceFormBinder>
                      <IceFormError name="gender" />
                    </Col>
                }
              </Row>


              <Row style={styles.formItem}>
                <Col xxs="6" s="4" l="4" style={styles.label}>
                  邮箱：
                </Col>
                {
                    this.state.isUserBasicsSubmit ? 
                    <Col xxs="16" s="10" l="6">
                        <span>{this.state.value.email}</span>
                    </Col> :
                    <Col xxs="16" s="10" l="6">
                          <IceFormBinder name="email" >
                            <Input size="large" placeholder="" />
                          </IceFormBinder>
                          <IceFormError name="email" />
                    </Col>
                }
                
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="4" l="4" style={styles.label}>
                  website ：
                </Col>
                 {
                    this.state.isUserBasicsSubmit ? 
                    <Col xxs="16" s="10" l="6">
                        <span>{this.state.value.siteUrl}</span>
                    </Col> :
                    <Col xxs="16" s="10" l="6">
                          <IceFormBinder name="siteUrl" >
                            <Input size="large" placeholder="" />
                          </IceFormBinder>
                          <IceFormError name="siteUrl" />
                    </Col>
                }
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="4" l="4" style={styles.label}>
                  Github：
                </Col>
                 {
                    this.state.isUserBasicsSubmit ? 
                    <Col xxs="16" s="10" l="6">
                        <span>{this.state.value.githubUrl}</span> :
                    </Col> :
                    <Col xxs="16" s="10" l="6">
                          <IceFormBinder name="githubUrl" >
                            <Input size="large" placeholder="" />
                          </IceFormBinder>
                          <IceFormError name="githubUrl" />
                    </Col>
                }
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="4" l="4" style={styles.label}>
                  自我描述：
                </Col>
                 {
                    this.state.isUserBasicsSubmit ? 
                    <Col xxs="16" s="10" l="6">
                        <span>{this.state.value.description}</span> :
                    </Col> :
                    <Col xxs="16" s="10" l="6">
                      <IceFormBinder name="description">
                        <Input size="large" multiple placeholder="请输入描述..." />
                      </IceFormBinder>
                      <IceFormError name="description" />
                    </Col>
                }
              </Row>
            </div>
          </IceFormBinderWrapper>

          <Row style={{ marginTop: 20 }}>
            <Col offset="3">
                {
                    this.state.isUserBasicsSubmit ? 
                  <Button
                    size="large"
                    type="primary"
                    style={{ width: 100 }}
                    onClick={()=> {
                        this.setState({isUserBasicsSubmit:!this.state.isUserBasicsSubmit})
                    }}
                  >
                    编辑
                  </Button> :
                  <Button
                    size="large"
                    type="primary"
                    style={{ width: 100 }}
                    onClick={this.validateAllFormField}
                  >
                    提 交
                  </Button>
                    }
            </Col>
          </Row>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  label: {
    textAlign: 'right',
  },
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formItem: {
    alignItems: 'center',
    marginBottom: 25,
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
};
