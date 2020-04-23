import './App.less';
import React from 'react';
import {Layout, Menu, Button} from "antd";
import { UploadOutlined, UserOutlined, VideoCameraOutlined, PlusOutlined } from '@ant-design/icons';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from 'react-router-dom';
import {Inbox} from "./inbox/inbox";
const { Header, Footer, Sider, Content } = Layout;
const Home = () => <span> Home</span>;
const Contact = () => <span> Home</span>;

function App() {
  return (
      <Router>
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
                                  <Link to='/inboc'>
                                      <UserOutlined />
                                      <span className="nav-text">Inbox</span>
                                  </Link>
                              </Menu.Item>
                              <Menu.Item key="2">
                                  <Link to='/contact'>
                                      <VideoCameraOutlined />
                                      <span className="nav-text">Contacts</span>
                                  </Link>
                              </Menu.Item>
                      </Menu>
                  </div>
                  <Link to='/admin'>
                      <div className='bottom-nav'>
                          Manage Account
                      </div>
                  </Link>
              </Sider>
              <Layout>
                  <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
                  <Content style={{ margin: '24px 16px 0' }}>
                      <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                          <Switch>
                              <Route path="/inbox"/>
                                    <Inbox/>
                              <Route path="/contact">
                                  <Contact />
                              </Route>
                              <Route path="/">
                                  <Home />
                              </Route>
                          </Switch>
                      </div>
                  </Content>
                  <Footer style={{ textAlign: 'center' }}>I.T System Prod M.C D.C ©2021</Footer>
              </Layout>
          </Layout>
      </Router>
  );
}



export default App;

