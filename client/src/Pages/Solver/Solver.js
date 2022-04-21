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
import { TEST_SETS } from "./testSets";

const { Option } = Select;
const { Content } = Layout;

function EditableCell({ record, editable, defaultValues, onSave, children, ...props }) {
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
                    defaultValue={defaultValues.filter(item => item.id === record.id)[0]?.value}
                />
            )}
            {childType === "number" && (
                <NumberInput
                    possibleValues={record.possibleValues}
                    onSave={(value) => onSave({ id: record.id, value: value })}
                    defaultValue={defaultValues.filter(item => item.id === record.id)[0]?.value}
                />
            )}
        </td>
    );
}

function NumberInput({ possibleValues, onSave, defaultValue }) {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        setValue(defaultValue)
    }, [defaultValue]);

    const onChange = (value) => {
        setValue(value);
        onSave(value);
    }

    return (
        <>
            <InputNumber
                style={{ width: 150 }}
                controls={false}
                min={possibleValues.min}
                max={possibleValues.max}
                placeholder={`${possibleValues.min} ~ ${possibleValues.max}`}
                onChange={onChange}
                value={value}
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

function SingleValueSelector({ possibleValues, onSave, defaultValue }) {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        setValue(defaultValue)
    }, [defaultValue]);

    const onChange = (_, option) => {
        setValue(option.value);
        onSave(option.value);
    }

    const onClear = () => {
        setValue(null);
        onSave(null);
    }

    return (
        <Select
            allowClear
            placeholder={"Выберите значение"}
            style={{ width: "100%" }}
            maxTagCount={"responsive"}
            onChange={onChange}
            onClear={onClear}
            value={value}
        >
            {possibleValues.map((item) => (
                <Option key={item}>{item}</Option>
            ))}
        </Select>
    );
}

function DataInput({ attributes, onSolveStart, onSolveSuccess, onSolveFail }) {
    const [solveAllowed, setSolveAllowed] = useState(true);
    const [inputData, setInputData] = useState([]);
    const [testSetNumber, setTestSetNumber] = useState(0);

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
        let filteredData = inputData.filter(item => item.value !== null)
        const solvePromise = solveClassification({ data: filteredData });
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

    const loadTestData = () => {
        let testData = attributes.map((attribute, i) => ({ id: attribute.id, value: TEST_SETS[testSetNumber][i] }));
        setInputData(testData);
        if (testSetNumber + 1 === TEST_SETS.length) {
            setTestSetNumber(0);
        } else {
            setTestSetNumber(old => old + 1);
        }
    }

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
                                    defaultValues: inputData,
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
                <Button
                    type="primary"
                    shape="round"
                    size={"middle"}
                    onClick={loadTestData}
                    style={{ marginTop: 12}}
                >
                    Тестовые данные
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
                        toast.success("База знаний спешно прошла проверку!");
                    })
                    .catch(console.log);
                } else {
                    setStatus(STATUS.completenessError)
                }                
            })
            .catch((err) => { setStatus(STATUS.serverError); console.log(err) })
    }

    const onSolveStart = (data) => {
        let defaultData = attributes.map(item => ({ id: item.id, value: null }));
        defaultData = defaultData.filter(item => !data.some((elem) => elem.id === item.id)); 
        setInputData(defaultData.concat(data));
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
