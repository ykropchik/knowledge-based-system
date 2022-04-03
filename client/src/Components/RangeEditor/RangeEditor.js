import { Form, InputNumber } from "antd";
import { useState } from "react";

export default function RangeEditor({
    possibleValues,
    initialValues,
    onSave,
    onSaveFailed,
}) {
    const [data, setData] = useState(initialValues ?? { min: null, max: null });
    const [validation, setValidation] = useState({
        valid: "success",
        message: undefined,
    });

    function save(min, max) {
        if (min <= max) {
            setValidation({ valid: "success", message: undefined });
            onSave({ min: min, max: max });
        } else {
            setValidation({ valid: "error", message: "Min ⩽ Max" });
            onSaveFailed();
        }
    }

    const onChange = (type, value) => {
        if (type === "min") {
            setData({ ...data, min: value });
            save(value, data.max);
        } else {
            setData({ ...data, max: value });
            save(data.min, value);
        }
    };

    return (
        <>
            <Form.Item
                name="min"
                style={{ margin: 0, display: "inline-block" }}
                validateStatus={validation.valid}
                help={validation.message}
            >
                <InputNumber
                    style={{ width: 100 }}
                    controls={false}
                    min={possibleValues.min}
                    max={possibleValues.max}
                    placeholder={possibleValues.min}
                    defaultValue={initialValues?.min ?? null}
                    onChange={(value) => onChange("min", value)}
                />
            </Form.Item>
            <span
                style={{
                    padding: "0 11px",
                    lineHeight: "32px",
                    textAlign: "center",
                    color: "#c8c4cd",
                }}
            >
                ~
            </span>
            <Form.Item
                name="max"
                style={{ margin: 0, display: "inline-block" }}
                validateStatus={validation.valid}
            >
                <InputNumber
                    style={{ width: 100 }}
                    controls={false}
                    min={possibleValues.min}
                    max={possibleValues.max}
                    placeholder={possibleValues.max}
                    defaultValue={initialValues?.max ?? null}
                    onChange={(value) => onChange("max", value)}
                />
            </Form.Item>
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
