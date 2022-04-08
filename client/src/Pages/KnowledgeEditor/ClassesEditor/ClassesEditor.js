import { useEffect, useState } from "react";
import { List, Divider, Input, Skeleton, Button } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import s from "./ClassesEditor.module.sass";
import { createClass, fetchPriceClasses, removeClass } from "../../../Api/api";
import toast, { Toaster } from "react-hot-toast";

const defaultClasses = [
    { name: "какой-то класс 1" },
    { name: "какой-то класс 2" },
    { name: "какой-то класс 3" },
    { name: "какой-то класс 4" },
    { name: "какой-то класс 5" },
    { name: "какой-то класс 6" },
];

export default function ClassesEditor() {
    const [classes, setClasses] = useState(defaultClasses);
    const [isLoading, setLoading] = useState(true);
    const [newClassName, setNewClassName] = useState("");

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        fetchPriceClasses()
            .then((res) => {
                if (isMounted) {
                    setClasses(res.result);
                }
            })
            .catch(console.log)
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const onAddClass = () => {
        const creatingPromice = createClass({ name: newClassName });
            toast.promise(creatingPromice, {
                loading: "Создание нового класса",
                success: (res) => {
                    setClasses(res.result);
                    return "Новый класс создан";
                },
                error: (err) => {
                    if (err.status === 409) {
                        return "Класс с таким названием уже существует!";
                    }

                    return "Произошла ошибка!"
                }
            });
        setNewClassName("");
    };

    const onRemoveClass = (id) => {
        const removingPromice = removeClass(id);
        toast.promise(removingPromice, {
            loading: "Удаление класса",
            success: (res) => {
                setClasses(res.result);
                return "Класс успешно удален";
            },
            error: "Произошла ошибка!",
        });
    };

    const onClassNameChange = (e) => {
        setNewClassName(e.target.value);
    };

    return (
        <>
            <Divider orientation="left">Список классов</Divider>
            <div className={s.classesEditor}>
                <div className={s.listContainer}>
                    <List
                        bordered
                        dataSource={classes}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <DeleteOutlined
                                        className={s.removeButton}
                                        onClick={() => onRemoveClass(item.id)}
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
                            value={newClassName}
                            onChange={onClassNameChange}
                            placeholder="Введите название класса"
                        />
                        <Button type="primary" disabled={!newClassName.trim()} onClick={onAddClass}>
                            <PlusOutlined />
                        </Button>
                    </Input.Group>
                </div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}
