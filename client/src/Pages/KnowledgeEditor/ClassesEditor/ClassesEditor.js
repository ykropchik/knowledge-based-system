import { useEffect, useState } from 'react';
import { List, Divider, Input, Skeleton } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import s from './ClassesEditor.module.sass';
import { createClass, fetchPriceClasses, removeClass } from '../../../Api/api';
import toast, { Toaster } from 'react-hot-toast';

const { Search } = Input;

const defaultClasses = [
    { name: 'какой-то класс 1'},
    { name: 'какой-то класс 2'},
    { name: 'какой-то класс 3'},
    { name: 'какой-то класс 4'},
    { name: 'какой-то класс 5'},
    { name: 'какой-то класс 6'}
]

export default function ClassesEditor() {
    const [classes, setClasses] = useState(defaultClasses);
    const [isLoading, setLoading] = useState(true);
    const [newClassName, setNewClassName] = useState('');

    useEffect(() => {
        let isMounted = true;
        getClasses(isMounted);

        return () => { isMounted = false };
    }, [])

    function getClasses(isMounted) {
        setLoading(true);
        fetchPriceClasses()
            .then(res => {
                if (isMounted) {
                    setClasses(res.result);
                }
            })
            .catch(console.log)
            .finally(() => setLoading(false))
    }

    const onAddClass = (value) => {
        if (value) {
            const creatingPromice = createClass({ name: value });
            toast.promise(creatingPromice, {
                loading: 'Создание нового класса',
                success: res => {
                    setClasses(res.result)
                    return 'Новый класс создан'; 
                },
                error: 'Произошла ошибка!',
            });
        }
        setNewClassName('');
    }

    const onRemoveClass = (id) => {
        const removingPromice = removeClass(id);
            toast.promise(removingPromice, {
                loading: 'Удаление класса',
                success: res => {
                    setClasses(res.result);
                    return 'Класс успешно удален';
                },
                error: 'Произошла ошибка!',
            });
    }

    const onClassNameChange = (e) => {
        setNewClassName(e.target.value);
    }

    return (
        <>
            <Divider orientation="left">Список классов</Divider>
            <div className={s.classesEditor}>
                <div className={s.listContainer}>
                    <List
                        bordered
                        dataSource={classes}
                        renderItem={item => (
                            <List.Item actions={[<DeleteOutlined className={s.removeButton} onClick={() => onRemoveClass(item.id)}/>]}>
                                <Skeleton loading={isLoading} active title={false} paragraph={{ rows: 1 }}>
                                    {item.name}
                                </Skeleton>
                            </List.Item>
                        )} />
                </div>

                <div className={s.newClassContainer}>
                    <Search
                        style={{ position: 'sticky', top: 32 }}
                        value={newClassName}
                        placeholder="Введите название класса"
                        allowClear
                        onSearch={onAddClass}
                        onChange={onClassNameChange}
                        enterButton={<PlusOutlined />} />
                </div>
            </div>
            <Toaster
                position="top-right"
                reverseOrder={false} />
        </>
    );
}