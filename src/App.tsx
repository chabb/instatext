import './App.less';
import React, {useContext, useEffect, useState} from 'react';
import {Layout, Menu, Button, Modal, Spin} from "antd";
import { UploadOutlined, UserOutlined, VideoCameraOutlined, PlusOutlined } from '@ant-design/icons';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink,
    useParams, useLocation, Redirect
} from 'react-router-dom';
import {Inbox} from "./inbox/inbox";
import {NewMessage} from "./widgets/new_message";
import FirebaseContext  from './firebase/context';
import Firebase from "./firebase/firebase";
import {SignIn} from "./login/signup";
import {SignUp} from "./login/signin";
import {EmailVerification} from "./login/email";
import {Contact} from "./contacts/contact";
import {NewContact} from "./widgets/new_contact";


const { Header, Footer, Sider, Content } = Layout;
const Home = () => <span> Home</span>;


const fb = new Firebase();

(window as any).d = fb;

function App() {
    console.log('RENDERING APP');
    return (
        <FirebaseContext.Provider value={fb}>
            <Router>
                <Body/>
            </Router>
        </FirebaseContext.Provider>
    );
}

const hasSession = (sessionLoaded, firebase) => sessionLoaded || !!firebase!.currentUser;

const getApp = (pathname) => {
    switch (pathname) {
        case '/contact': {
            return { title:'Add new contact', item: ['2'], modal:  <NewContact/>};
        }
        default:
        case '/inbox': {
            return { title:'Add new message', item: ['1'], modal:  <NewMessage/>};
        }
    }
}
function Body() {

    const [modalVisible, setModalVisible] = useState(false);
    const location = useLocation();
    const [currentApp, setCurrentApp] = useState<any>(getApp(location.pathname));
    const isLoginZone = (location.pathname === '/signin' || location.pathname === '/signup' || location.pathname === '/email');
    const firebase = useContext(FirebaseContext);
    const [sessionLoaded, setSessionLoaded] = useState(false);
    // why-did-i-render
    // remember that useEffect is not called when the element is mounted
    useEffect(() => {
        console.log('>>>>>>>>>>>>>>>>>>', location.pathname);
        setCurrentApp(getApp(location.pathname));
    }, [location.pathname]);

    useEffect(() => {
        const s = firebase!.sessionInitialized.subscribe((v) => {
            console.log('session started', v);
            if (v !== sessionLoaded) {
                setSessionLoaded(v);
            }
        });
        return () => s.unsubscribe();
    },[]);


    return hasSession(sessionLoaded, firebase) ? (
        <div className='app'>
            {isLoginZone ?
                <div className='logger'>
                    <Switch>
                        <Route path="/signin">
                            <SignIn/>
                        </Route>
                        <Route path='/signup'>
                            <SignUp/>
                        </Route>
                        <Route path='/email'>
                            <EmailVerification/>
                        </Route>
                    </Switch>
                </div>
                :
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
                                        <Home />
                                    </PrivateRoute>
                                </Switch>
                            </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>I.T System Prod M.C D.C ©2021</Footer>
                    </Layout>
                </Layout>}
            <Modal
                title={currentApp.title}
                visible={modalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
            >
                {currentApp.modal}
            </Modal>
        </div>) : <Spin size="large" tip="Loading..."/>
}


export default App;



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
