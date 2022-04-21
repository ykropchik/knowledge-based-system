import { Divider, Layout, Table } from "antd";
import { useEffect, useState } from "react";

const { Content } = Layout;

const defaultColumn = [
    {
        title: "Признаки",
        dataIndex: "attribute",
        fixed: "left",
        render: (text) => text.name,
    },
    {
        title: "Введенные данные",
        dataIndex: "inputData",
        fixed: "left",
        render: (text) => text?.value,
    },
];

export default function ResultTable({ classes, attributes, inputData }) {
    const [columns, setColumns] = useState(getColumns(classes));
    const [data, setData] = useState(
        prepareData(classes, attributes, inputData)
    );

    useEffect(() => {
        setColumns(getColumns(classes));
    }, [classes]);

    useEffect(() => {
        setData(prepareData(classes, attributes, inputData));
        // console.log(prepareData(classes, attributes));
    }, [classes, attributes, inputData]);

    function getColumns(classes) {
        let classesColumn = classes.map((item, i) => ({
            title: item.name,
            dataIndex: i,
            render: (text) => {
                if (!text) {
                    return '';
                }

                if (Array.isArray(text.value)) {
                    return text.value.join(", ");
                } else {
                    if (text.value?.min === null) {
                        return text.value?.max;
                    }

                    if (text.value?.min === null) {
                        return text.value?.min;
                    }

                    if (text.value?.min === text.value?.max) {
                        return text.value?.min;
                    }

                    return `${text.value?.min} ~ ${text.value?.max}`;
                }
            },
            onCell: (record) => {
                if (!record[i] || !record.inputData) {
                    return;
                }

                if (record.inputData.value === null) {
                    return { style: {backgroundColor: "#ffccd1"} };
                }

                if (Array.isArray(record[i].value)) {
                    if (record[i].value.includes(record.inputData.value)) {
                        return { style: {backgroundColor: "#c8e7c8"} }
                    } else {
                        return { style: {backgroundColor: "#ffccd1"} }
                    }
                } else {
                    if (record.inputData.value < record[i].value.min || record.inputData.value > record[i].value.max) {
                        return { style: {backgroundColor: "#ffccd1"} }
                    } else {
                        return { style: {backgroundColor: "#c8e7c8"} }
                    }
                }
            },
        }));

        return defaultColumn.concat(classesColumn);
    }

    function prepareData(classes, attributes, inputData) {
        let prepareAttributes = attributes.map(({ id, ...attribute }) => {
            let inputAttribute = inputData.filter((elem) => elem.id === id)[0];

            let classesAttributes = classes.map((item) => {
                let temp = item.priceClassAttributes.filter(
                    (elem) => elem.attribute.id === id
                );

                return temp[0];
            });

            return {
                attribute: attribute,
                inputData: inputAttribute,
                ...classesAttributes,
            };
        });

        // return prepareAttributes.filter((item) => item.inputData)
        return prepareAttributes
    }

    return (
        <Content style={{ padding: "0 50px" }}>
            <Divider orientation="center">Результат</Divider>
            {
                classes.length !== 0 
                ?
                <Table
                    dataSource={data}
                    columns={columns}
                    bordered
                    // components={{ body: { cell: CustomCell } }}
                    scroll={{ x: "max-content" }}
                    pagination={false}
                    onRow={(record) => {
                        return {
                            isValid:
                                record.attribute.type &&
                                record.attribute.possibleValues,
                        };
                    }}
                />
                :
                <div>нет решений</div>
            }
            
        </Content>
    );
}
