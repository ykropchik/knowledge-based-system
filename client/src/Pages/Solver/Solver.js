import {
    Divider,
    Layout,
    InputNumber,
    Table,
    Select,
    Button,
    Col,
    Row,
    Alert,
    Spin,
} from "antd";
import { useEffect, useState } from "react";
import { fetchAttributes, solveClassification, checkCompleteness } from "../../Api/api";
import { CalculatorOutlined, SafetyOutlined, LoadingOutlined } from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";
import ResultTable from "../../Components/ResultTable/ResultTable";

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

const tempInputData = [
    {
        "id": 232,
        "value": "Эгершельд"
    },
    {
        "id": 233,
        "value": "Кирпичный"
    },
    {
        "id": 234,
        "value": "Вторичка"
    }
]

function DataInput({ attributes, onSolveStart, onSolveSuccess, onSolveFail }) {
    const [solveAllowed, setSolveAllowed] = useState(true);
    const [inputData, setInputData] = useState(tempInputData);

    const onSave = (value) => {
        setSolveAllowed(true);
        setInputData([
            ...inputData.filter((item) => item.id !== value.id),
            value,
        ]);
    };

    const solve = () => {
        // console.log(JSON.stringify({ data: inputData }));
        onSolveStart(inputData);
        const solvePromise = solveClassification({ data: inputData });
        toast.promise(solvePromise, {
            loading: "Решения задачи",
            success: (res) => {
                onSolveSuccess(res.result);
                return "Задача успешно решена!";
            },
            error: (err) => {
                onSolveFail(err)
                return "Произошла ошибка!";
            },
        });
    };

    return (
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
                    pagination={false}
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

const STATUS = {
    notChecked: "notChecked",
    checking: "checking",
    checkedSuccessfully: "checked",
    serverError: "serverError",
    completenessError: "completenessError",
    solving: "solving",
    solvedSuccessfully: "solvedSuccessfully",
    solverError: "solverError",
};

export default function Solver() {
    const [status, setStatus] = useState(STATUS.notChecked);
    const [attributes, setAttributes] = useState([]);
    const [solveRes, setSolveRes] = useState([]);
    const [inputData, setInputData] = useState([]);

    function prepareAttributes(attributes) {
        return attributes.filter((attribute) => attribute.type);
    }

    const check = () => {
        setStatus(STATUS.checking);
        checkCompleteness()
            .then((res) => {
                if (res.result === "OK") {
                    fetchAttributes()
                    .then((res) => {
                        setAttributes(prepareAttributes(res.result));
                        setStatus(STATUS.checkedSuccessfully);
                    })
                    .catch(console.log);
                } else {
                    setStatus(STATUS.completenessError)
                }                
            })
            .catch((err) => { setStatus(STATUS.serverError); console.log(err) })
    }

    const onSolveStart = (data) => {
        setInputData(data);
        setStatus(STATUS.solving);
        //console.log(data)
    }

    const onSolveSuccess = (result) => {
        setStatus(STATUS.solvedSuccessfully);
        setSolveRes(result);
    }

    return (
        <Content style={{ padding: "0 50px" }}>
                <Spin
                    tip={<span style={{ display: "inline-block", marginTop: 64, fontSize: 32 }}>В процессе...</span>}
                    indicator={<LoadingOutlined style={{ fontSize: 64 }} spin />}
                    spinning={status === STATUS.solving || status === STATUS.checking}>

                {status === STATUS.notChecked && (
                    <>
                        <Alert
                            style={{ margin: '32px 0' }}
                            showIcon
                            type="info"
                            message="Проверка полноты"
                            description={`Перед тем как решать задачу, необходимо проверить полноту базы знаний. Для этого нажмите "Проверить полноту" и следуйте инструкциям.`}
                        />
                        <Button
                            type="primary"
                            shape="round"
                            icon={<SafetyOutlined />}
                            size={"middle"}
                            onClick={check}
                        >
                            Проверить полноту
                        </Button>
                    </>
                )}

                {status === STATUS.completenessError &&
                    <Alert
                        style={{ margin: '32px 0' }}
                        showIcon
                        type="error"
                        message="Ошибка"
                        description="База знаний не прошла проверку полноты. Перепроверьте правильность введенных данных и повторите попытку."
                    />
                }

                {status === STATUS.serverError &&
                    <>
                        <Alert
                            style={{ margin: '32px 0' }}
                            showIcon
                            type="error"
                            message="Ошибка"
                            description="Произошла непредвиденная ошибка на сервере, попробуйте снова через некоторое время."
                        />
                        <Button
                            type="primary"
                            shape="round"
                            icon={<SafetyOutlined />}
                            size={"middle"}
                            onClick={check}
                        >
                            Проверить полноту
                        </Button>
                    </>
                }

                {status === STATUS.checkedSuccessfully && 
                    <>
                        <Divider orientation="center">Ввод исходных данных</Divider>
                        <DataInput 
                            attributes={attributes}
                            onSolveStart={onSolveStart}
                            onSolveSuccess={onSolveSuccess}
                            onSolveFail={() => setStatus(STATUS.serverError)} />
                    </>
                }

                {status === STATUS.solvedSuccessfully && solveRes && attributes &&
                    <ResultTable classes={solveRes} attributes={attributes} inputData={inputData}/>
                }

                <Toaster position="top-right" reverseOrder={false} />
            </Spin>
        </Content>
    );
}
