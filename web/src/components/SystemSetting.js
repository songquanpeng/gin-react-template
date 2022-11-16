import React, { useEffect, useState } from 'react';
import { Divider, Form, Grid, Header } from 'semantic-ui-react';
import { API, showError } from '../helpers';

const SystemSetting = () => {
  let [inputs, setInputs] = useState({
    PasswordLoginEnabled: '',
    PasswordRegisterEnabled: '',
    EmailVerificationEnabled: '',
    GitHubOAuthEnabled: '',
    GitHubClientId: '',
    GitHubClientSecret: '',
    Notice: '',
    SMTPServer: '',
    SMTPAccount: '',
    SMTPToken: '',
    ServerAddress: '',
    Footer: '',
    WeChatAuthEnabled: '',
    WeChatServerAddress: '',
    WeChatServerToken: '',
    WeChatAccountQRCodeImageURL: '',
  });
  let originInputs = {};
  let [loading, setLoading] = useState(false);

  const getOptions = async () => {
    const res = await API.get('/api/option');
    const { success, message, data } = res.data;
    if (success) {
      let newInputs = {};
      data.forEach((item) => {
        newInputs[item.key] = item.value;
      });
      setInputs(newInputs);
      originInputs = newInputs;
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    getOptions().then();
  }, []);

  const updateOption = async (key, value) => {
    setLoading(true);
    switch (key) {
      case 'PasswordLoginEnabled':
      case 'PasswordRegisterEnabled':
      case 'EmailVerificationEnabled':
      case 'GitHubOAuthEnabled':
      case 'WeChatAuthEnabled':
        value = inputs[key] === 'true' ? 'false' : 'true';
        break;
      default:
        break;
    }
    const res = await API.put('/api/option', {
      key,
      value,
    });
    const { success, message } = res.data;
    if (success) {
      setInputs((inputs) => ({ ...inputs, [key]: value }));
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const handleInputChange = async (e, { name, value }) => {
    if (
      name === 'Notice' ||
      name.startsWith('SMTP') ||
      name === 'ServerAddress' ||
      name === 'GitHubClientId' ||
      name === 'GitHubClientSecret' ||
      name === 'WeChatServerAddress' ||
      name === 'WeChatServerToken' ||
      name === 'WeChatAccountQRCodeImageURL'
    ) {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      await updateOption(name, value);
    }
  };

  const submitServerAddress = async () => {
    let ServerAddress = inputs.ServerAddress;
    if (ServerAddress.endsWith('/')) {
      ServerAddress = ServerAddress.slice(0, ServerAddress.length - 1);
    }
    await updateOption('ServerAddress', ServerAddress);
  };

  const submitSMTP = async () => {
    if (originInputs['SMTPServer'] !== inputs.SMTPServer) {
      await updateOption('SMTPServer', inputs.SMTPServer);
    }
    if (originInputs['SMTPAccount'] !== inputs.SMTPAccount) {
      await updateOption('SMTPAccount', inputs.SMTPAccount);
    }
    if (
      originInputs['SMTPToken'] !== inputs.SMTPToken &&
      inputs.SMTPToken !== ''
    ) {
      await updateOption('SMTPToken', inputs.SMTPToken);
    }
  };

  const submitWeChat = async () => {
    if (originInputs['WeChatServerAddress'] !== inputs.WeChatServerAddress) {
      await updateOption('WeChatServerAddress', inputs.WeChatServerAddress);
    }
    if (
      originInputs['WeChatAccountQRCodeImageURL'] !==
      inputs.WeChatAccountQRCodeImageURL
    ) {
      await updateOption(
        'WeChatAccountQRCodeImageURL',
        inputs.WeChatAccountQRCodeImageURL
      );
    }
    if (
      originInputs['WeChatServerToken'] !== inputs.WeChatServerToken &&
      inputs.WeChatServerToken !== ''
    ) {
      await updateOption('WeChatServerToken', inputs.WeChatServerToken);
    }
  };

  const submitGitHubOAuth = async () => {
    if (originInputs['GitHubClientId'] !== inputs.GitHubClientId) {
      await updateOption('GitHubClientId', inputs.GitHubClientId);
    }
    if (
      originInputs['GitHubClientSecret'] !== inputs.GitHubClientSecret &&
      inputs.GitHubClientSecret !== ''
    ) {
      await updateOption('GitHubClientSecret', inputs.GitHubClientSecret);
    }
  };

  return (
    <Grid columns={1}>
      <Grid.Column>
        <Form loading={loading}>
          <Header as='h3'>通用配置</Header>
          <Form.Group widths='equal'>
            <Form.Input
              label='服务器地址'
              placeholder='例如：https://yourdomain.com（注意没有最后的斜杠）'
              value={inputs.ServerAddress}
              name='ServerAddress'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Button onClick={submitServerAddress}>
            更新服务器地址
          </Form.Button>
          <Divider />
          <Header as='h3'>配置登录注册方式</Header>
          <Form.Group inline>
            <Form.Checkbox
              checked={inputs.PasswordLoginEnabled === 'true'}
              label='允许通过密码进行登录'
              name='PasswordLoginEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.PasswordRegisterEnabled === 'true'}
              label='允许通过密码进行注册'
              name='PasswordRegisterEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.EmailVerificationEnabled === 'true'}
              label='通过密码注册时需要进行邮箱验证'
              name='EmailVerificationEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.GitHubOAuthEnabled === 'true'}
              label='允许通过 GitHub 账户登录 & 注册'
              name='GitHubOAuthEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.WeChatAuthEnabled === 'true'}
              label='允许通过微信登录 & 注册'
              name='WeChatAuthEnabled'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Divider />
          <Header as='h3'>
            配置 SMTP
            <Header.Subheader>用以支持系统的邮件发送</Header.Subheader>
          </Header>
          <Form.Group widths={3}>
            <Form.Input
              label='SMTP 服务器地址'
              name='SMTPServer'
              onChange={handleInputChange}
              autoComplete='off'
              value={inputs.SMTPServer}
              placeholder='例如：smtp.qq.com'
            />
            <Form.Input
              label='SMTP 账户'
              name='SMTPAccount'
              onChange={handleInputChange}
              autoComplete='off'
              value={inputs.SMTPAccount}
              placeholder='通常是邮箱地址'
            />
            <Form.Input
              label='SMTP 访问凭证'
              name='SMTPToken'
              onChange={handleInputChange}
              type='password'
              autoComplete='off'
              value={inputs.SMTPToken}
              placeholder='敏感信息不会发送到前端显示'
            />
          </Form.Group>
          <Form.Button onClick={submitSMTP}>保存 SMTP 设置</Form.Button>
          <Divider />
          <Header as='h3'>
            配置 GitHub OAuth App
            <Header.Subheader>
              用以支持通过 GitHub 进行登录注册，
              <a href='https://github.com/settings/developers' target='_blank'>
                点击此处
              </a>
              管理你的 GitHub OAuth App
            </Header.Subheader>
          </Header>
          <Form.Group widths={3}>
            <Form.Input
              label='GitHub Client ID'
              name='GitHubClientId'
              onChange={handleInputChange}
              autoComplete='off'
              value={inputs.GitHubClientId}
              placeholder='输入你注册的 GitHub OAuth APP 的 ID'
            />
            <Form.Input
              label='GitHub Client Secret'
              name='GitHubClientSecret'
              onChange={handleInputChange}
              type='password'
              autoComplete='off'
              value={inputs.GitHubClientSecret}
              placeholder='敏感信息不会发送到前端显示'
            />
          </Form.Group>
          <Form.Button onClick={submitGitHubOAuth}>
            保存 GitHub OAuth 设置
          </Form.Button>
          <Divider />
          <Header as='h3'>
            配置 WeChat Server
            <Header.Subheader>
              用以支持通过微信进行登录注册，
              <a
                href='https://github.com/songquanpeng/wechat-server'
                target='_blank'
              >
                点击此处
              </a>
              了解 WeChat Server
            </Header.Subheader>
          </Header>
          <Form.Group widths={3}>
            <Form.Input
              label='WeChat Server 服务器地址'
              name='WeChatServerAddress'
              placeholder='例如：https://yourdomain.com（注意没有最后的斜杠）'
              onChange={handleInputChange}
              autoComplete='off'
              value={inputs.WeChatServerAddress}
            />
            <Form.Input
              label='WeChat Server 访问凭证'
              name='WeChatServerToken'
              type='password'
              onChange={handleInputChange}
              autoComplete='off'
              value={inputs.WeChatServerToken}
              placeholder='敏感信息不会发送到前端显示'
            />
            <Form.Input
              label='微信公众号二维码图片链接'
              name='WeChatAccountQRCodeImageURL'
              onChange={handleInputChange}
              autoComplete='off'
              value={inputs.WeChatAccountQRCodeImageURL}
              placeholder='输入一个图片链接'
            />
          </Form.Group>
          <Form.Button onClick={submitWeChat}>
            保存 WeChat Server 设置
          </Form.Button>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default SystemSetting;
