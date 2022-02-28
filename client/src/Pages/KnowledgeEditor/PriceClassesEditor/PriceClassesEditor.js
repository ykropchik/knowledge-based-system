import { AutoComplete, Divider, Button} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useState } from 'react';
import s from './PriceClassesEditor.module.sass';
import MultiSelect from '../../../Components/MultiSelect/MultiSelect';

const options = [
    { value: 'до 3 млн' },
    { value: 'от 3 млн до 5 млн' },
    { value: 'от 5 млн до 7 млн' },
    { value: 'от 7 млн до 9 млн' },
    { value: 'от 9 млн до 11 млн' },
    { value: '11 млн и более' }
];

export default function PriceClassesEditor() {
    return (
        <>
            <Divider orientation="left">Признаки ценовых классов</Divider>
            <div className={s.header}>
                <AutoComplete
                    className={s.input}
                    options={options}
                    placeholder="Название класса"
                    allowClear
                    filterOption={(inputValue, option) =>
                        option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }/>
                <Button type="primary" shape="round" icon={<SaveOutlined/>} size={'middle'}>Сохранить</Button>
            </div>
            <>
                <MultiSelect/>
            </>
        </>
    );
}