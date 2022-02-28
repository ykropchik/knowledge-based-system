import { AutoComplete, Divider, Radio, Space, Checkbox, Input, List, Button, Empty } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useState } from 'react';
import s from './ToleranceRangeEditor.module.sass';

const { Search } = Input;

function ScalarTypeEditor() {
    return (
        <>
            <Search
                // ref={classInput}
                placeholder="Введите значение"
                allowClear
                // onSearch={onAddClass}
                enterButton={<PlusOutlined/>}
                style={{ marginBottom: 12 }}/>
            <List 
                bordered
                dataSource={[]}
                locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>Пусто</span>}/> }}
                renderItem={item => (
                    <List.Item actions={[<DeleteOutlined className={s.removeButton}/>]}>
                    {item}
                    </List.Item>
                )}/>
        </>
    );
}

function RangeTypeEditor() {
    return (
        <>
            <Input addonBefore="Единицы измерения" style={{ marginBottom: 12 }}/>
            <Input addonBefore="Минимум" style={{ marginBottom: 12 }}/>
            <Input addonBefore="Максимум" style={{ marginBottom: 12 }}/>
        </>
    );
}

function BooleanTypeEditor() {
    return (
        <>
            <Checkbox defaultChecked={false}>Да</Checkbox>
            <br/>
            <Checkbox defaultChecked={false}>Нет</Checkbox>
        </>
    );
}

const options = [
    { value: 'район расположения' },
    { value: 'тип дома' },
    { value: 'тип объекта' },
    { value: 'год постройки' },
    { value: 'этажей в доме' },
    { value: 'этаж' },
    { value: 'тип планировки' },
    { value: 'число комнат' },
    { value: 'площадь' },
];

const attributeTypes = [
    { value: 'Скалярный', component: <ScalarTypeEditor/> },
    { value: 'Размерный', component: <RangeTypeEditor/> },
    { value: 'Логический', component: <BooleanTypeEditor/> }
]

export default function ToleranceRangeEditor() {
    const [ type, setType ] = useState(0);

    return (
        <>
            <Divider orientation="left">Возможные значения признаков</Divider>
            <div className={s.header}>
                <AutoComplete
                    className={s.input}
                    options={options}
                    placeholder="Название признака"
                    filterOption={(inputValue, option) =>
                        option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }/>
                <Button type="primary" shape="round" icon={<SaveOutlined/>} size={'middle'}>Сохранить</Button>
            </div>
            <div className={s.container}>    
                <div className={s.content}>
                    <Divider orientation="left">Тип признака</Divider>
                    <Radio.Group onChange={(e) => setType(e.target.value)} value={type}>
                        <Space direction="vertical">
                            {
                                attributeTypes.map((item, i) => (
                                    <Radio value={i}>{item.value}</Radio>
                                ))
                            }
                        </Space>
                    </Radio.Group>
                </div>
                <div className={s.content}>
                    <Divider orientation="left">Область допустимых значений</Divider>
                    { attributeTypes[type].component }
                </div>
            </div>
        </>
    );
}