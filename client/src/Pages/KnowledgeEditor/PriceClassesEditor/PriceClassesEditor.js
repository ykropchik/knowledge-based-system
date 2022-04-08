import { AutoComplete, Divider, Button, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import s from './PriceClassesEditor.module.sass';
import MultiSelect from '../../../Components/MultiSelect/MultiSelect';
import { fetchAttributes, fetchPriceClasses, setAttributesToPriceClass } from '../../../Api/api';
import Placeholder from '../../../Components/Placeholder/Placeholder';
import toast, { Toaster } from 'react-hot-toast';

const { Option } = Select;

export default function PriceClassesEditor() {
    const [classes, setClasses] = useState([]);
    const [id, setId] = useState(null);
    const [attributes, setAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [initialSelectedAttributes, setInitialSelectedAttributes] = useState([]);
    const [saveAllowed, setSaveAllowed] = useState(false);

    useEffect(() => {
        let isMounted = true;
        getClasses(isMounted);
        getAttributes(isMounted);

        return () => { isMounted = false };
    }, [])

    function getClasses(isMounted) {
        fetchPriceClasses()
            .then(res => {
                if (isMounted) {
                    setClasses(res.result);
                }
            })
            .catch(console.log)
    }

    function getAttributes(isMounted) {
        fetchAttributes()
            .then(res => {
                if (isMounted) {
                    setAttributes(res.result);
                }
            })
            .catch(console.log)
    }

    const onSelectClass = (_, priceClass) => {
        setId(priceClass.id);
        setSelectedAttributes(priceClass.priceclassattributes.map((item) => item.attribute));
        setInitialSelectedAttributes(priceClass.priceclassattributes.map((item) => item.attribute));
        setSaveAllowed(false);
    }

    const onSelectAttributes = (attributes) => {
        setSelectedAttributes(attributes);
        setSaveAllowed(JSON.stringify(attributes) !== JSON.stringify(initialSelectedAttributes));
    }

    const onSave = () => {
        const savePromice = setAttributesToPriceClass(id, selectedAttributes.map(attribute => attribute.id));
            toast.promise(savePromice, {
                loading: 'Добавление признаков ценового класса',
                success: res => {
                    setClasses(res.result);
                    return 'Признаки ценового класса успешно добавлены!';
                },
                error: 'Произошла ошибка!',
            });
    }

    return (
        <>
            <Divider orientation="left">Признаки ценовых классов</Divider>
            <div className={s.header}>
                <Select
                    showSearch
                    className={s.input}
                    placeholder="Выберите класс"
                    optionFilterProp="children"
                    onSelect={onSelectClass}
                    filterOption={(input, option) =>
                        option.children.toUpperCase().indexOf(input.toUpperCase()) >= 0
                    }>
                        {
                            classes.map((priceClass, i) => (
                                <Option
                                    key={i}
                                    value ={i}
                                    id={priceClass.id}
                                    priceclassattributes={priceClass.priceClassAttributes}>
                                    {priceClass.name}
                                </Option>
                            ))
                        }
                </Select>
                <Button type="primary" shape="round" icon={<SaveOutlined/>} size={'middle'} onClick={onSave} disabled={!saveAllowed}>Сохранить</Button>
            </div>
            {
                id ?
                <MultiSelect items={attributes} selectedItems={selectedAttributes} label={item => item.name} onChange={onSelectAttributes}/>
                :
                <Placeholder text={'Выберите класс чтобы продолжить'}/>
            }
            <Toaster
                position="top-right"
                reverseOrder={false} />
        </>
    );
}