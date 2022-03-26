import { Layout, Menu } from 'antd';
import { useState } from 'react';
import 'antd/dist/antd.css';
import About from './Pages/About/About';
import KnowledgeEditor from './Pages/KnowledgeEditor/KnowledgeEditor';
import Solver from './Pages/Solver/Solver';
import KnowlendgeBase from './Pages/KnowledgeBase/KnowledgeBase';

const { Header, Footer } = Layout;

const pages = [
    { pageTitle: 'О программе', pageComponent: <About/> },
    { pageTitle: 'База знаний', pageComponent: <KnowlendgeBase/> },
    { pageTitle: 'Редактор базы знаний', pageComponent: <KnowledgeEditor/> },
    { pageTitle: 'Решатель задач', pageComponent: <Solver/> }
]

function App() {
    const [selectedPage, setSelectedPage] = useState(pages[0]);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className='header'>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']} onSelect={({ key }) => setSelectedPage(pages[key])}>
                    {
                        pages.map(({ pageTitle }, i) => (
                            <Menu.Item key={i}>{pageTitle}</Menu.Item>
                        ))
                    }
                </Menu>
            </Header>
            
            { selectedPage.pageComponent }

            <Footer style={{ textAlign: 'center' }}>Интеллектуальная система для определения стоимости квартиры в городе владивосток ©2022 Created by Mikhail Zykov</Footer>
        </Layout>
    );
}

export default App;
