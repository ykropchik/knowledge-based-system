import { AutoComplete, Divider, Button, Table } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import s from './AttributesValueEditor.module.sass';

const options = [
    { value: 'до 3 млн' },
    { value: 'от 3 млн до 5 млн' },
    { value: 'от 5 млн до 7 млн' },
    { value: 'от 7 млн до 9 млн' },
    { value: 'от 9 млн до 11 млн' },
    { value: '11 млн и более' }
];

const columns = [
    {
      title: 'Признак',
      dataIndex: 'attribute',
    },
    {
      title: 'Тип',
      dataIndex: 'type',
    },
    {
      title: 'Значение',
      dataIndex: 'value',
      editable: true
    },
  ];
  const data = [
    {
        key: '1',
        attribute: 'район расположения',
        type: 'Скалярный',
        value: 'Эгершельд',
    },
    {
        key: '2',
        attribute: 'тип дома',
        type: 'Скалярный',
        value: 'Кирпичный',
    },
    {
        key: '3',
        attribute: 'тип объекта',
        type: 'Скалярный',
        value: 'Вторичка',
    },
    {
        key: '4',
        attribute: 'год постройки',
        type: 'Размерный',
        value: '1956-2006',
    },
    
  ];

export default function AttributesValueEditor() {
    return (
        <>
            <Divider orientation="left">Значения признаков для класса</Divider>
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

            <Table columns={columns} dataSource={data} bordered pagination={{ position: ['none', 'none'] }}/>
        </>
    );
}