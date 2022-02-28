import { List, Divider, Input } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import s from './AttributesEditor.module.sass';
import { useRef } from 'react';

const { Search } = Input;

const data = [
    'район расположения',
    'тип дома',
    'тип объекта',
    'год постройки',
    'количество этажей в доме',
    'этаж',
    'тип планировки',
    'число комнат',
    'площадь',
    'количество балконов/лоджий',
    'состояние ремонта в квартире',
    'наличие мебели и бытовой техники',
    'наличие благоустроенной придомовой территории',
    'количество детских садов в радиусе 1км',
    'количество школ в радиусе 1км',
];

export default function AttributesEditor() {
    const classInput = useRef(null);

    const onAddClass = (value) => {
        console.log(classInput.current)
        if (value) {
            console.log(value);
        }
    }

    return (
        <>
            <Divider orientation="left">Список признаков</Divider>
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