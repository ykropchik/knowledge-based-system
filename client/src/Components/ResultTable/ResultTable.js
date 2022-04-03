import { Divider, Layout, Table } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAttributes, fetchPriceClasses } from "../../Api/api";

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
        render: (text) => text.value,
    },
];

// function CustomCell({ dataindex, record, colored, children, ...props }) {
//     const childNode = useMemo(() => getChildNode(dataindex, record, colored), [dataindex, record, colored]);

//     function getChildNode() {
//         console.log(colored, dataindex)
//         return <td {...props}>{children}</td>;

//         if (!colored) {         
//             return <td {...props}>{children}</td>;
//         }

//         let data = record[dataindex];
//         console.log(data.value)
        
//         if (Array.isArray(data.value)) {
//             if (data.value.includes(record.inputData)) {
//                 return (
//                     <td {...props} style={{ backgroundColor: "#c8e7c8" }}>
//                         {data.value.join(", ")}
//                     </td>
//                 );
//             } else {
//                 return (
//                     <td {...props} style={{ backgroundColor: "#ffccd1" }}>
//                         {data.value.join(", ")}
//                     </td>
//                 );
//             }
//         } else {
//             if (
//                 data.value.min > record.inputData ||
//                 data.value.max < record.inputData
//             ) {
//                 return (
//                     <td
//                         {...props}
//                         style={{ backgroundColor: "#ffccd1" }}
//                     >{`${data.value.min} ~ ${data.value.max}`}</td>
//                 );
//             } else {
//                 return (
//                     <td
//                         {...props}
//                         style={{ backgroundColor: "#c8e7c8" }}
//                     >{`${data.value.min} ~ ${data.value.max}`}</td>
//                 );
//             }
//         }
//     }

//     return childNode;
// }

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
                    return `${text.value.min} ~ ${text.value.max}`;
                }
            },
            onCell: (record) => {
                if (!record[i]) {
                    return;
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

        return prepareAttributes;
    }

    return (
        <Content style={{ padding: "0 50px" }}>
            <Divider orientation="center">Результат</Divider>
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
        </Content>
    );
}
