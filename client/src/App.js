import { Layout, Menu } from 'antd';
import { useState } from 'react';
import './App.css';
import ResultTable from './Components/ResultTable/ResultTable';
import About from './Pages/About/About';
import KnowledgeEditor from './Pages/KnowledgeEditor/KnowledgeEditor';

const { Header, Content, Sider, Footer } = Layout;

const pages = [
    { pageTitle: 'О программе', pageComponent: <About/> },
    { pageTitle: 'Редактор базы знаний', pageComponent: <KnowledgeEditor/> },
    { pageTitle: 'Решатель задач', pageComponent: <ResultTable/> }
]

function App() {
    const [selectedPage, setSelectedPage] = useState(pages[0]);

    return (
    <Layout className='app'>
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
