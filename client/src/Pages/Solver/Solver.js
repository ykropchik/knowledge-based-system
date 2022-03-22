import {
    Divider,
    Layout,
    InputNumber,
    Table,
    Select,
    Button,
    Col,
    Row,
} from "antd";
import { useEffect, useState } from "react";
import { fetchAttributes, solveClassification } from "../../Api/api";
import { CalculatorOutlined } from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";

const { Option } = Select;
const { Content } = Layout;

function EditableCell({ record, editable, onSave, children, ...props }) {
    const [childType, setChildType] = useState();

    useEffect(() => {
        if (!editable) {
            setChildType("usual");
            return;
        }

        if (Array.isArray(record.possibleValues)) {
            setChildType("selector");
            return;
        } else if (record.possibleValues !== null) {
            setChildType("number");
            return;
        } else {
            setChildType("usual");
            return;
        }
    }, []);

    return (
        <td {...props}>
            {childType === "usual" && children}
            {childType === "selector" && (
                <SingleValueSelector
                    possibleValues={record.possibleValues}
                    onSave={(value) => onSave({ id: record.id, value: value })}
                />
            )}
            {childType === "number" && (
                <NumberInput
                    possibleValues={record.possibleValues}
                    onSave={(value) => onSave({ id: record.id, value: value })}
                />
            )}
        </td>
    );
}

function NumberInput({ possibleValues, onSave }) {
    return (
        <>
            <InputNumber
                style={{ width: 150 }}
                controls={false}
                min={possibleValues.min}
                max={possibleValues.max}
                placeholder={`${possibleValues.min} ~ ${possibleValues.max}`}
                onChange={(value) => onSave(value)}
            />
            <span
                style={{
                    padding: "0 11px",
                    lineHeight: "32px",
                    textAlign: "center",
                    color: "#c8c4cd",
                }}
            >
                {possibleValues.units}
            </span>
        </>
    );
}

function SingleValueSelector({ possibleValues, onSave }) {
    return (
        <Select
            allowClear
            placeholder={"Выберите значение"}
            style={{ width: "100%" }}
            maxTagCount={"responsive"}
            onChange={(_, option) => onSave(option.value)}
        >
            {possibleValues.map((item) => (
                <Option key={item}>{item}</Option>
            ))}
        </Select>
    );
}

const columns = [
    {
        title: "Признак",
        dataIndex: "name",
        width: 400,
    },
    {
        title: "Значение",
        dataIndex: "possibleValues",
        editable: true,
        width: 380,
    },
];

export default function Solver() {
    const [attributes, setAttributes] = useState([]);
    const [solveAllowed, setSolveAllowed] = useState(false);
    const [inputData, setInputData] = useState([]);

    useEffect(() => {
        let isMounted = true;

        fetchAttributes()
            .then((res) => {
                if (isMounted) {
                    setAttributes(res.result);
                }
            })
            .catch(console.log);

        return () => {
            isMounted = false;
        };
    }, []);

    const onSave = (value) => {
        setSolveAllowed(true);
        setInputData([
            ...inputData.filter((item) => item.id !== value.id),
            value,
        ]);
    };

    const solve = () => {
        console.log(JSON.stringify({ data: inputData }));
        const solvePromise = solveClassification({ data: inputData });
        toast.promise(solvePromise, {
            loading: "Решения задачи",
            success: (res) => {
                //setPriceClassAttributes(res.result)
                return "Задача успешно решена!";
            },
            error: "Произошла ошибка!",
        });
    };

    return (
        <Content style={{ padding: "0 50px" }}>
            <Divider orientation="center">Ввод исходных данных</Divider>
            <Row gutter={[16, 16]}>
                <Col span={12} offset={6}>
                    <Table
                        dataSource={attributes}
                        columns={columns.map((col) => {
                            if (!col.editable) {
                                return col;
                            }

                            return {
                                ...col,
                                onCell: (record) => {
                                    return {
                                        record,
                                        editable: col.editable,
                                        onSave: onSave,
                                    };
                                },
                            };
                        })}
                        components={{ body: { cell: EditableCell } }}
                        pagination={{ position: ["none", "none"] }}
                    />
                </Col>
                <Col span={1}>
                    <Button
                        type="primary"
                        shape="round"
                        icon={<CalculatorOutlined />}
                        size={"middle"}
                        disabled={!solveAllowed}
                        onClick={solve}
                    >
                        Решить
                    </Button>
                </Col>
            </Row>
            <Toaster position="top-right" reverseOrder={false} />
        </Content>
    );
}
