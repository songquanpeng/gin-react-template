import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import SystemSetting from '../../components/SystemSetting';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastConstants } from '../../constants';
import { copy, isAdmin } from '../../helpers';


const Setting = () => {
  const generateToken = async () => {
    const res = await axios.get('/api/user/token');
    const { success, message, data } = res.data;
    if (success) {
      await copy(data);
      toast.success(`令牌已重置并已复制到剪切板：${data}`);
    } else {
      toast.error('错误：' + message, { autoClose: toastConstants.ERROR_TIMEOUT });
    }
  };

  return <Segment>
    <Header as='h3'>个人设置</Header>
    <Button as={Link} to={`/user/edit/`}>更新个人信息</Button>
    <Button onClick={generateToken}>生成访问令牌</Button>
    {
      isAdmin() ? <>
        <Header as='h3'>系统设置</Header>
        <SystemSetting />
      </> : <>
      </>
    }

  </Segment>;
};

export default Setting;