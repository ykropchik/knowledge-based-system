import { Divider, Layout, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { fetchAttributes, fetchPriceClasses } from "../../Api/api";

const { Content } = Layout;

const defaultColumn = [
    {
        title: "Признаки",
        dataIndex: "attribute",
        fixed: "left",
        render: (text) => text.name
    },
];

export default function KnowlendgeBase() {
    const [isLoading, setLoading] = useState(true);
    // const [attributes, setAttributes] = useState([]);
    // const [classes, setClasses] = useState([]);
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);

    async function getData() {
        let classesPromise = fetchPriceClasses();
        let attributesPromise = fetchAttributes();

        try {
            let result = await Promise.all([classesPromise, attributesPromise]);
            return [result[0].result, result[1].result];
        } catch (err) {
            throw new Error(err);
        }
    }

    // useEffect(() => {
    //     console.log(data);
    // }, [data]);

    useEffect(() => {
        let isMounted = true;

        setLoading(true);
        getData()
            .then(([classes, attributes]) => {
                // setClasses(classes);
                // setAttributes(attributes);
                setColumns(getColumns(classes));
                setData(prepareData(classes, attributes));
            })
            .catch(console.log)
            .finally(() => setLoading(false));

        return () => {
            isMounted = false;
        };
    }, []);

    function getColumns(classes) {
        let classesColumn = classes.map((item, i) => ({
            title: item.name,
            dataIndex: i,
            render: (text) => {
                console.log(text)
                if (!text) {
                    return;
                }

                if (!text.value && !!text.value) {
                    return <b style={{ color: "#a6a6a6" }}>Значение не задано</b>;
                }

                if (Array.isArray(text.value)) {
                    return text.value?.join(", ");
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
            }
        }));

        // console.log(classesColumn)

        return defaultColumn.concat(classesColumn);
    }

    function prepareData(classes, attributes) {
        let prepareAttributes = attributes.map(({ id, ...attribute }) => {
            let classesAttributes = classes.map((item, index) => {
                let temp = item.priceClassAttributes.filter((elem) => elem.attribute.id === id);
                return temp[0];
            });

            // console.log(classesAttributes)

            return { attribute: attribute, ...classesAttributes };
        });

        return prepareAttributes;
    }

    return (
        <Content style={{ padding: "0 50px" }}>
            <Divider orientation="center">База знаний</Divider>
            <Table
                dataSource={data}
                columns={columns}
                bordered
                scroll={{ x: "max-content" }}
                pagination={false}
            />
        </Content>
    );
}
