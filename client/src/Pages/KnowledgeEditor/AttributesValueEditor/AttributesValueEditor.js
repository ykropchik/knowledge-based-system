import { Divider, Button, Table, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import s from "./AttributesValueEditor.module.sass";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import {
    fetchPriceClasses,
    setPriceClassAttributesValues,
} from "../../../Api/api";
import Placeholder from "../../../Components/Placeholder/Placeholder";
import toast, { Toaster } from "react-hot-toast";
import RangeEditor from "../../../Components/RangeEditor/RangeEditor";
import MultiValueSelector from "../../../Components/MultiValueSelector/MultiValueSelector";

const { Option } = Select;

function EditableCell({
    record,
    editable,
    onSave,
    onSaveFailed,
    children,
    ...props
}) {
    const childType = useMemo(
        () => getChildType(editable, record),
        [editable, record]
    );

    function getChildType(editable, record) {
        if (!editable) {
            return "usual";
        }

        if (Array.isArray(record.possibleValues)) {
            return "selector";
        } else if (record.possibleValues !== null) {
            return "range";
        } else {
            return "usual";
        }
    }

    const save = (value) => {
        onSave({ id: record.id, value: value });
    };

    let childNode;

    switch (childType) {
        case "usual":
            childNode = children;
            break;
        case "selector":
            childNode = (
                <MultiValueSelector
                    possibleValues={record.possibleValues}
                    initialValues={record.value ?? []}
                    onSave={save}
                />
            );
            break;
        case "range":
            childNode = (
                <RangeEditor
                    possibleValues={record.possibleValues}
                    initialValues={record.value}
                    onSave={save}
                    onSaveFailed={onSaveFailed}
                />
            );
            break;
        default:
            childNode = children;
            break;
    }

    return <td {...props}>{childNode}</td>;
}

const columns = [
    {
        title: "Признак",
        dataIndex: "name",
    },
    {
        title: "Тип",
        dataIndex: "type",
        render: (value) => {
            switch (value) {
                case "scalar":
                    return "Скалярный";
                case "range":
                    return "Размерный";
                case "bool":
                    return "Логический";
                default:
                    return <b style={{ color: "red" }}>Не задан</b>;
            }
        },
    },
    {
        title: "Значение",
        dataIndex: "possibleValues",
        width: 350,
        editable: true,
    },
];

export default function AttributesValueEditor() {
    const [classes, setClasses] = useState([]);
    const [id, setId] = useState(null);
    const [priceClassAttributes, setPriceClassAttributes] = useState([]);
    const [saveAllowed, setSaveAllowed] = useState(false);
    const [savedData, setSavedData] = useState([]);

    useEffect(() => {
        let isMounted = true;
        getClasses(isMounted);

        return () => {
            isMounted = false;
        };
    }, []);

    function getClasses(isMounted) {
        fetchPriceClasses()
            .then((res) => {
                if (isMounted) {
                    setClasses(res.result);
                }
            })
            .catch(console.log);
    }

    const onSelectClass = (_, priceClass) => {
        setId(priceClass.id);
        setPriceClassAttributes(priceClass.priceclassattributes);
        setSaveAllowed(false);
    };

    const onSave = (value) => {
        setSaveAllowed(true);
        setSavedData([
            ...savedData.filter((item) => item.id !== value.id),
            value,
        ]);
    };

    const onSaveFailed = () => {
        setSaveAllowed(false);
    };

    const onSendData = () => {
        const savingPromise = setPriceClassAttributesValues({
            data: savedData,
        });
        toast.promise(savingPromise, {
            loading: "Сохранение значений",
            success: (res) => {
                setPriceClassAttributes(res.result);
                return "Значения успешно сохранены";
            },
            error: "Произошла ошибка!",
        });
    };

    return (
        <>
            <Divider orientation="left">Значения признаков для класса</Divider>
            <div className={s.header}>
                <Select
                    showSearch
                    className={s.input}
                    placeholder="Выберите класс"
                    optionFilterProp="children"
                    onSelect={onSelectClass}
                    filterOption={(input, option) =>
                        option.children
                            .toUpperCase()
                            .indexOf(input.toUpperCase()) >= 0
                    }
                >
                    {classes.map((priceClass, i) => (
                        <Option
                            key={i}
                            value={i}
                            id={priceClass.id}
                            priceclassattributes={
                                priceClass.priceClassAttributes
                            }
                        >
                            {priceClass.name}
                        </Option>
                    ))}
                </Select>
                <Button
                    type="primary"
                    shape="round"
                    icon={<SaveOutlined />}
                    size={"middle"}
                    disabled={!saveAllowed}
                    onClick={onSendData}
                >
                    Сохранить
                </Button>
            </div>
            {id ? (
                <Table
                    bordered
                    dataSource={priceClassAttributes.map((item) => ({
                        id: item.id,
                        name: item.attribute.name,
                        type: item.attribute.type,
                        possibleValues: item.attribute.possibleValues,
                        value: item.value,
                    }))}
                    pagination={{ position: ["none", "none"] }}
                    components={{ body: { cell: EditableCell } }}
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
                                    onSaveFailed: onSaveFailed,
                                };
                            },
                        };
                    })}
                />
            ) : (
                <Placeholder text={"Выберите класс чтобы продолжить"} />
            )}
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}
