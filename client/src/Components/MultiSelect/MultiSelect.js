import { Checkbox, Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import s from './MultiSelect.module.sass';
import { useEffect, useState } from 'react';
import Placeholder from '../Placeholder/Placeholder';

export default function MultiSelect({ items = [], selectedItems, label, onChange }) {
    const [selected, setSelected] = useState([...selectedItems]);

    useEffect(() => {
        setSelected(selectedItems);
    }, [selectedItems]);

    function indexOf(array, obj) {
        for (let i = 0; i < array.length; i++) {
            if (JSON.stringify(array[i]) === JSON.stringify(obj)) {
                return i;
            }
        }

        return -1;
    }

    function selectAllClick() {
        if(selected.length !== items.length) {
            setSelected(items);
            onChange(items);
        } else {
            removeAllSelectedItems();
        }
    }

    function leftSideItemClick(item) {
        if (indexOf(selected, item) >= 0) {
            removeSelectedItem(item);
        } else {
            setSelected([].concat(selected, [item]));
            onChange([].concat(selected, [item]));
        }
    }

    function removeSelectedItem(selectedItem) {
        let selectedItemIndex = indexOf(selected, selectedItem);
        if (selectedItemIndex >= 0) {
            let newSelectedItemsList = [
                ...selected.slice(0, selectedItemIndex),
                ...selected.slice(selectedItemIndex + 1),
            ]

            setSelected(newSelectedItemsList);
            onChange(newSelectedItemsList);
        }
    }

    function removeAllSelectedItems() {
        setSelected([]);
        onChange([]);
    }

    return (
        <div className={s.mainContainer}>
            <div className={s.column}>
                <div className={s.borderedItem} onClick={() => selectAllClick()}>
                    <Checkbox checked={selected.length === items.length && items.length !== 0}/>
                    <span className={s.itemContent}>Выбрать все</span>
                </div>
                <div className={s.scrollContainer}>
                    <ul className={s.itemsList}>
                    {
                        items.map((item, i) => 
                            <li className={s.item} key={i} onClick={() => leftSideItemClick(item)}>
                                {
                                    <Checkbox 
                                        name={i} 
                                        checked={indexOf(selected, item) >= 0}/>
                                }
                                <span className={s.item_content}>{label(item)}</span>
                            </li>
                        )
                    }
                    </ul>
                </div>
            </div> 
            <div className={s.column}>
                <div className={s.selectedHeaderContainer}>
                    <span className={s.selectedCounter}>{selected.length === 0 ? 'Ничего не выбрано' : `Выбрано ${selected.length}`}</span>
                    {
                    selected.length > 1
                    ?
                    <span className={s.clearAll} onClick={() => {removeAllSelectedItems()}}>Удалить все</span>
                    :
                    <></>
                    }
                </div>
                <div className={s.scrollContainer}>
                    <ul className={s.itemsList}>
                    {
                        selected.length !== 0
                        ?
                        selected.map((item, i) => 
                            <li className={s.itemRemove} key={i} onClick={e => {removeSelectedItem(item)}}>
                                <span className={s.itemContent}>{label(item)}</span>
                                <DeleteOutlined className={s.delete} onClick={e => {removeSelectedItem(item)}}/>
                            </li>
                        )
                        :
                        <Placeholder text={'Пусто'}/>
                    }
                    </ul>
                </div>
            </div>
        </div>
    );
}