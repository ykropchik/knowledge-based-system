import { Layout, Menu } from 'antd';
import { useState } from 'react';
import AttributesEditor from './AttributesEditor/AttributesEditor';
import AttributesValueEditor from './AttributesValueEditor/AttributesValueEditor';
import ClassesEditor from './ClassesEditor/ClassesEditor';
import PriceClassesEditor from './PriceClassesEditor/PriceClassesEditor';
import ToleranceRangeEditor from './ToleranceRangeEditor/ToleranceRangeEditor';
const { Content, Sider } = Layout;

const menuItems = [
    { title: 'Классы', component: <ClassesEditor/> },
    { title: 'Признаки', component: <AttributesEditor/> },
    { title: 'Вожможные значения признаков', component: <ToleranceRangeEditor/> },
    { title: 'Признаки ценовых классов', component: <PriceClassesEditor/> },
    { title: 'Значения признаков для классов', component: <AttributesValueEditor/> }
];

export default function KnowledgeEditor() {
    const [activeMenu, setActiveMenu] = useState(menuItems[0]);

    return (
        <Layout>
            <Sider width={250} className="site-layout-background">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['0']}
                    style={{ height: '100%', background: '#fff' }}
                    onSelect={({ key }) => setActiveMenu(menuItems[key])}>
                    {
                        menuItems.map((item, i) => (
                            <Menu.Item key={i} title={item.title}>{item.title}</Menu.Item>
                        ))
                    }
                </Menu>
                </Sider>
            <Content style={{ padding: '0 50px' }}>
                { activeMenu.component }
            </Content>
        </Layout>
    );
}