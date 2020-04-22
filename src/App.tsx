import './App.less';
import React from 'react';
import {Layout, Menu, Button} from "antd";
import { UploadOutlined, UserOutlined, VideoCameraOutlined, PlusOutlined } from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
      <Layout>
        <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={broken => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
        >
          <div className="logo">Instatext</div>
          <div className='main-nav'>
            <Button className='add-message' type="primary" shape="round" icon={<PlusOutlined />}>
              Add new message
            </Button>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <UserOutlined />
                <span className="nav-text">Inbox</span>
              </Menu.Item>
              <Menu.Item key="2">
                <VideoCameraOutlined />
                <span className="nav-text">Contacts</span>
              </Menu.Item>
            </Menu>
          </div>
          <div className='bottom-nav'>
            Manage Account
          </div>
        </Sider>
        <Layout>
          <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
          <Content style={{ margin: '24px 16px 0' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              Manage Account
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
  );
}

export default App;
