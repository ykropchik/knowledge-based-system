import { Divider, Radio, Space, Checkbox, Input, InputNumber, List, Button, Empty, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import s from './ToleranceRangeEditor.module.sass';
import { fetchAttributes, setAttributeValues } from '../../../Api/api';
import toast, { Toaster } from 'react-hot-toast';
import Placeholder from '../../../Components/Placeholder/Placeholder';

const { Search } = Input;
const { Option } = Select;

function ScalarTypeEditor({values, onChange}) {
    const [list, setList] = useState([]);
    const [value, setValue] = useState('');

    useEffect(() => {
        if (Array.isArray(values)) {
            setList(values);
        } else {
            setList([]);
        }
    }, [values]);

    const onAddValue = (item) => {
        if (item && list.includes(item)) {
            toast.error('Такое значение уже есть!');
            return;
        }

        setValue('');
        setList([...list, item]);
        onChange([...list, item]);
    }

    const onInputValueChange = (e) => {
        setValue(e.target.value);
    }

    const onRemove = (item) => {
        setList(list.filter((value) => value !== item));
        onChange(list.filter((value) => value !== item));
    }

    return (
        <>
            <Search
                placeholder="Введите значение"
                value={value}
                allowClear
                onSearch={onAddValue}
                onChange={onInputValueChange}
                enterButton={<PlusOutlined/>}
                style={{ marginBottom: 12 }}/>
            <List 
                style={{ background: '#fff' }}
                bordered
                dataSource={list}
                locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>Пусто</span>}/> }}
                renderItem={item => (
                    <List.Item actions={[<DeleteOutlined className={s.removeButton} onClick={() => onRemove(item)}/>]}>
                        {item}
                    </List.Item>
                )}/>
            <Toaster
                position="top-right"
                reverseOrder={false} />
        </>
    );
}

function RangeTypeEditor({values, onChange}) {
    const [value, setValue] = useState(values ?? { units: null, min: null, max: null });

    useEffect(() => {
        setValue(values ?? { units: null, min: null, max: null });
    }, [values]);

    function onChangeValue(v) {
        setValue({ ...value, ...v });
        onChange({ ...value, ...v });
    }

    return (
        <>
            <Input 
                addonBefore="Единицы измерения" 
                style={{ marginBottom: 12, width: '80%' }} 
                value={value.units} 
                onChange={(e) => onChangeValue({units: e.target.value})}/>
            <br/>
            <InputNumber 
                addonBefore="Минимум" 
                style={{ marginBottom: 12, width: '80%' }}
                value={value.min}
                onChange={(num) => onChangeValue({min: num})}
                controls={false}/>
            <br/>
            <InputNumber 
                addonBefore="Максимум" 
                style={{ marginBottom: 12, width: '80%' }} 
                value={value.max} 
                onChange={(num) => onChangeValue({max: num})} 
                controls={false}/>
        </>
    );
}

function BooleanTypeEditor({values, onChange}) {
    const options = [
        { label: 'Да', value: 'Да' },
        { label: 'Нет', value: 'Нет' }
    ]

    const onChangeValue = (checkedValues) => {
        onChange(checkedValues);
    }

    return (
        <Checkbox.Group options={options} value={Array.isArray(values) ? values : []} onChange={onChangeValue}/>
    );
}

const defaultAttributes = [
    { name: 'какой-то признак 1'},
    { name: 'какой-то признак 2'},
    { name: 'какой-то признак 3'},
    { name: 'какой-то признак 4'},
    { name: 'какой-то признак 5'},
    { name: 'какой-то признак 6'}
]

const attributeTypes = [
    'Скалярный',
    'Размерный',
    'Логический'
]

const attributeType = {
    0: 'scalar',
    1: 'range',
    2: 'bool'
}

export default function ToleranceRangeEditor() {
    const [attributes, setAttributes] = useState(defaultAttributes);
    const [id, setId] = useState(undefined);
    const [saveAllowed, setSaveAllowed] = useState(false);
    const [type, setType] = useState(null);
    const [values, setValues] = useState(undefined);
    const [initialState, setInitialState] = useState({ type: null, values: undefined });

    useEffect(() => {
        let isMounted = true;
        getAttributes(isMounted);

        return () => { isMounted = false };
    }, []);

    function getAttributes(isMounted) {
        fetchAttributes()
            .then(res => {
                if (isMounted) {
                    setAttributes(res.result);
                }
            })
            .catch(console.log)
    }

    const onSelectAttribute = (_, attribute) => {
        setId(attribute.id);
        setType(attribute.type);
        setValues(attribute.possiblevalues);
        setInitialState({ type: attribute.type, values: attribute.possiblevalues });
        setSaveAllowed(false);
    }

    const onChangeAttributeType = (e) => {
        setType(e.target.value);
        setValues(JSON.stringify(e.target.value) === JSON.stringify(initialState.type) ? initialState.values : null);
        setSaveAllowed(JSON.stringify(e.target.value) !== JSON.stringify(initialState.type));
    }

    const onChangeValues = (values) => {
        setSaveAllowed(JSON.stringify(values) !== JSON.stringify(initialState.values));
        setValues(values);
        console.log(values);
    }

    const save = () => {
        const savingPromise = setAttributeValues(id, { type: type, values: values});
            toast.promise(savingPromise, {
                loading: 'Сохранение ОДЗ',
                success: res => {
                    setAttributes(res.result);
                    return 'ОДЗ успешно сохранено!';
                },
                error: 'Произошла ошибка!',
            });
    }
    
    return (
        <>
            <Divider orientation="left">Возможные значения признаков</Divider>
            <div className={s.header}>
                <Select
                    showSearch
                    className={s.input}
                    placeholder="Выберите признак"
                    optionFilterProp="children"
                    onSelect={onSelectAttribute}
                    filterOption={(input, option) =>
                        option.children.toUpperCase().indexOf(input.toUpperCase()) >= 0
                    }>
                        {
                            attributes.map((attribute, i) => (
                                <Option
                                    key={i}
                                    value ={i}
                                    id={attribute.id}
                                    type={attribute.type}
                                    possiblevalues={attribute.possibleValues}>
                                    {attribute.name}
                                </Option>
                            ))
                        }
                </Select>
                <Button type="primary" shape="round" icon={<SaveOutlined/>} size={'middle'} onClick={save} disabled={!saveAllowed}>Сохранить</Button>
            </div>
            {
                id ?
                <div className={s.container}>    
                    <div className={s.content}>
                        <Divider orientation="left">Тип признака</Divider>
                        <Radio.Group onChange={onChangeAttributeType} value={type}>
                            <Space direction="vertical">
                                {
                                    attributeTypes.map((item, i) => (
                                        <Radio key={i} value={attributeType[i]}>{item}</Radio>
                                    ))
                                }
                            </Space>
                        </Radio.Group>
                    </div>
                    <div className={s.content}>
                        <Divider orientation="left">Область допустимых значений</Divider>
                        { type === null && <Placeholder text={'Выберите тип признака чтобы продолжить'}/> }
                        { type === 'scalar' && <ScalarTypeEditor values={type === 'scalar' ? values : null} onChange={(v) => onChangeValues(v)}/> }
                        { type === 'range' && <RangeTypeEditor values={type === 'range' ? values : null} onChange={(v) => onChangeValues(v)}/> }
                        { type === 'bool' && <BooleanTypeEditor values={type === 'bool' ? values : null} onChange={(v) => onChangeValues(v)}/> }
                    </div>
                </div>
                :
                <Placeholder text={'Выберите признак чтобы продолжить'}/>
            }
            <Toaster
                position="top-right"
                reverseOrder={false} />
        </>
    );
}