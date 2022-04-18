import { List, Divider, Input, Skeleton, Button } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import s from "./AttributesEditor.module.sass";
import { useEffect, useState } from "react";
import {
    fetchAttributes,
    createAttribute,
    removeAttribute,
} from "../../../Api/api";
import toast, { Toaster } from "react-hot-toast";

const defaultAttributes = [
    { name: "какой-то признак 1" },
    { name: "какой-то признак 2" },
    { name: "какой-то признак 3" },
    { name: "какой-то признак 4" },
    { name: "какой-то признак 5" },
    { name: "какой-то признак 6" },
];

export default function AttributesEditor() {
    const [attributes, setAttributes] = useState(defaultAttributes);
    const [isLoading, setLoading] = useState(true);
    const [newAttributeName, setNewAttributeName] = useState("");

    useEffect(() => {
        let isMounted = true;
        getAttributes(isMounted);

        return () => {
            isMounted = false;
        };
    }, []);

    function getAttributes(isMounted) {
        setLoading(true);
        fetchAttributes()
            .then((res) => {
                if (isMounted) {
                    setAttributes(res.result);
                }
            })
            .catch(console.log)
            .finally(() => setLoading(false));
    }

    const onAddAttribute = () => {
        const creatingPromice = createAttribute({ name: newAttributeName });
            toast.promise(creatingPromice, {
                loading: "Создание нового признака",
                success: (res) => {
                    setAttributes(res.result);
                    return "Новый признак создан";
                },
                error: (err) => {
                    if (err.status === 409) {
                        return "Признак с таким названием уже существует!"
                    }

                    return "Произошла ошибка!"
                }
            });
        setNewAttributeName("");
    };

    const onRemoveAttribute = (id) => {
        const removingPromice = removeAttribute(id);
        toast.promise(removingPromice, {
            loading: "Удаление признака",
            success: (res) => {
                setAttributes(res.result);
                return "Признак успешно удален";
            },
            error: "Произошла ошибка!",
        });
    };

    const onAttributeNameChange = (e) => {
        setNewAttributeName(e.target.value);
    };

    return (
        <>
            <Divider orientation="left">Список признаков</Divider>
            <div className={s.classesEditor}>
                <div className={s.listContainer}>
                    <List
                        bordered
                        dataSource={attributes}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <DeleteOutlined
                                        className={s.removeButton}
                                        onClick={() =>
                                            onRemoveAttribute(item.id)
                                        }
                                    />,
                                ]}
                            >
                                <Skeleton
                                    loading={isLoading}
                                    active
                                    title={false}
                                    paragraph={{ rows: 1 }}
                                >
                                    {item.name}
                                </Skeleton>
                            </List.Item>
                        )}
                    />
                </div>

                <div className={s.newClassContainer}>
                    <Input.Group
                        compact
                        style={{ display: "flex", position: "sticky", top: 32 }}
                    >
                        <Input
                            allowClear
                            value={newAttributeName}
                            onChange={onAttributeNameChange}
                            placeholder="Введите название признака"
                        />
                        <Button type="primary" disabled={!newAttributeName.trim()} onClick={onAddAttribute}>
                            <PlusOutlined />
                        </Button>
                    </Input.Group>
                </div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}
