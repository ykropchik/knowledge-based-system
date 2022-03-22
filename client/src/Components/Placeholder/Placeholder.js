import { Empty } from 'antd';

export default function Placeholder({text}) {
    return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false}>
            <span>{text}</span>
        </Empty>
    );
}