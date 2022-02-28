import { useRef } from 'react';
import { List, Divider, Input } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import s from './ClassesEditor.module.sass';

const { Search } = Input;

const data = [
    'Класс 1',
    'Класс 2',
    'Класс 3',
    'Класс 4',
    'Класс 5',
];

export default function ClassesEditor() {
    const classInput = useRef(null);

    const onAddClass = (value) => {
        console.log(classInput.current)
        if (value) {
            console.log(value);
        }
    }
    
    return (
        <>
            <Divider orientation="left">Список классов</Divider>
            <div className={s.classesEditor}>
                <div className={s.listContainer}>
                    <List 
                        bordered
                        dataSource={data}
                        renderItem={item => (
                            <List.Item actions={[<DeleteOutlined className={s.removeButton}/>]}>
                            {item}
                            </List.Item>
                        )}/>
                </div>
                
                <div className={s.newClassContainer}>
                    <Search
                        ref={classInput}
                        placeholder="Введите название класса"
                        allowClear
                        onSearch={onAddClass}
                        enterButton={<PlusOutlined/>} />
                </div>
            </div>
        </>
    );
}