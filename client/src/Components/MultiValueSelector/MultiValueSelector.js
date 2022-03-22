import { Select } from "antd";
import { useMemo } from "react";

const { Option } = Select;

export default function MultiValueSelector({
    possibleValues,
    initialValues,
    onSave,
}) {
    return (
        <Select
            allowClear
            mode="multiple"
            placeholder="Выберите одно или несколько значений"
            style={{ width: "100%" }}
            maxTagCount={"responsive"}
            defaultValue={initialValues}
            onChange={(_, options) => onSave(options.map((item) => item.value))}
        >
            {possibleValues.map((item) => (
                <Option key={item}>{item}</Option>
            ))}
        </Select>
    );
}
