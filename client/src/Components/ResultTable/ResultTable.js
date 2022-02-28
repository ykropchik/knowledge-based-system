import { Layout, Table } from 'antd';

const { Content } = Layout;

const columns = [
    {
      title: 'Признак',
      dataIndex: 'attribute',
      key: 'attribute',
      fixed: 'left',
      width: 200
    },
    {
      title: 'Введенные данные',
      dataIndex: 'inputData',
      key: 'inputData',
      fixed: 'left',
      width: 200
    },
    {
      title: 'менее 3 млн',
      dataIndex: 'address',
      key: '1',
      width: 200
    },
    {
      title: 'от 3 млн до 5 млн',
      dataIndex: 'address',
      width: 200
    },
    {
      title: 'от 5 млн до 3 млн',
      dataIndex: 'address',
      width: 200
    },
    {
      title: 'от 5 млн до 7 млн',
      dataIndex: 'address',
      width: 200
    },
    {
      title: 'от 7 млн до 9 млн',
      dataIndex: 'address',
      width: 200
    },
    {
      title: 'от 9 млн до 11 млн',
      dataIndex: 'address',
      width: 200
    },
    {
      title: '11 млн и более',
      dataIndex: 'address',
      width: 200
    }
  ];
  
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      attribute: `Edrward ${i}`,
      inputData: 32,
      address: `London Park no. ${i}`,
    });
  }

export default function ResultTable() {
    return (
        <Content style={{ padding: '0 50px' }}>
            <Table 
                columns={columns}
                dataSource={data}
                bordered={true}
                scroll={{ x: 2000, y: 500 }}
                pagination={{ position: ['none', 'none'] }}/>
        </Content>
    );
}