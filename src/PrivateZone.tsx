import {Button, Layout, Modal, Menu, Form} from "antd";
import {Link, NavLink, Redirect, Route, Switch, useLocation} from "react-router-dom";
import {Inbox} from "./inbox/inbox";
import {Contact} from "./contacts/contact";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import { UploadOutlined, UserOutlined, VideoCameraOutlined, PlusOutlined } from '@ant-design/icons';
import {addContactFlow, NewContact} from "./widgets/new_contact";
import {NewMessage} from "./widgets/new_message";
import FirebaseContext from "./firebase/context";
import {Data} from "./firebase/data-context";

const { Header, Footer, Sider, Content } = Layout;


export enum FORM_ID {
    CONTACT = 'CONTACT',
    MESSAGE = 'MESSAGE'
}

export const DataContext = React.createContext<Data>(null as unknown as Data);

export const PrivateZone = () => {
    const fb = useContext(FirebaseContext);
    const ctx = useMemo(() => {
        return new Data(fb!);
    }, [fb]);

    useEffect(() => {
        return () => {
            // clean data-context
        }
    }, []);

    return (
        <DataContext.Provider value={ctx}>
            <_PrivateZone/>
        </DataContext.Provider>);
};



const _PrivateZone = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const fb = useContext(FirebaseContext);
    const location = useLocation();

    const getApp = useCallback((pathname) => {
        switch (pathname) {
            case '/contact': {
                return {
                    id: FORM_ID.CONTACT,
                    title:'Add new contact', item: ['2'], modal: () => <NewContact form={form} onFinish={() => setModalVisible(false)}/>};
            }
            default:
            case '/inbox': {
                return {
                    id: FORM_ID.MESSAGE,
                    title:'Add new message', item: ['1'], modal: () => <NewMessage form={form} onFinish={() => setModalVisible(false)}/>};
            }
        }
    }, [setModalVisible]);

    const [form] = Form.useForm();
    console.log('THE FORM', form, location.pathname);


    const [currentApp, setCurrentApp] = useState<any>(getApp(location.pathname));
    useEffect(() => {
        console.log('>>>>>>>>>>>>>>>>>>', location.pathname);
        setCurrentApp(getApp(location.pathname));
    }, [location.pathname]);



    return  (
    <Layout>
        <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={broken => console.log(broken)}
            onCollapse={(collapsed, type) => console.log(collapsed, type)}
        >
            <div className="logo">Instatext</div>
            <div className='main-nav'>
                <Button onClick={() => setModalVisible(true)}
                        className='add-message' type="primary" shape="round" icon={<PlusOutlined />}>
                    { currentApp.title }
                </Button>
                <Menu
                    selectedKeys={currentApp.item}
                    theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item  key="1">
                        <NavLink to='/inbox'>
                            <UserOutlined />
                            <span className="nav-text">Inbox</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <NavLink to='/contact'>
                            <VideoCameraOutlined />
                            <span className="nav-text">Contacts</span>
                        </NavLink>
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
                        <PrivateRoute path="/inbox">
                            <Inbox/>
                        </PrivateRoute>
                        <PrivateRoute path="/contact">
                            <Contact />
                        </PrivateRoute>
                        <PrivateRoute path="/">
                            <div> HOME </div>
                        </PrivateRoute>
                    </Switch>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>I.T System Prod M.C D.C ©2021</Footer>
        </Layout>
        <Modal
            title={currentApp.title}
            visible={modalVisible}
            forceRender={true}
            okText={currentApp.id === FORM_ID.CONTACT ? 'Create contact' : 'Send message'}
            okButtonProps={{disabled: form.isFieldsTouched()}}

            onOk={() => {
                console.log(form);
               switch (currentApp.id) {
                   case FORM_ID.MESSAGE: {
                       form.validateFields().then(() => {
                           addContactFlow(fb, form, () => {
                               form.resetFields();
                               setModalVisible(false);
                           },)
                       }, (i) => {
                           console.log('fa', i);
                       });
                       break
                   }
                   case FORM_ID.CONTACT: {
                       form.validateFields().then(() => {
                           addContactFlow(fb, form, () => {
                               form.resetFields();
                               setModalVisible(false);
                           },)
                       }, (i) => {
                           console.log('fa', i);
                       });
                       break;
                   }
                   default: {
                       console.error('unknown form id', currentApp.id);
                   }
               }
            }}
            onCancel={() => setModalVisible(false)}
        >
            {currentApp.modal()}
        </Modal>
    </Layout>)
};


// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {

    const firebase = useContext(FirebaseContext);

    return (
        <Route
            {...rest}
            render={({location}) =>
                firebase!.currentUser && firebase!.currentUser!.emailVerified ? (
                        children
                    ) :
                    <Redirect
                        to={{
                            pathname: "/signup",
                            state: {from: location}
                        }}
                    />
            }
        />
    );
}
