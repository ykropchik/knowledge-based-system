import { Checkbox, Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import s from './MultiSelect.module.sass';
import { useState } from 'react';

export default function MultiSelect({ items = ['1', '2', '3', '4']}) {
    const [selectedItems, setSelectedItems] = useState([]);

    function selectAllClick() {
        if(selectedItems.length !== items.length) {
            setSelectedItems(items);
        } else {
            removeAllSelectedItems();
        }
    }

    function leftSideItemClick(item) {
        if (selectedItems.indexOf(item) < 0) {
            setSelectedItems([].concat(selectedItems, [item]));
        } else {
            removeSelectedItem(item);
        }
    }

    function removeSelectedItem(selectedItem) {
        let selectedItemIndex = selectedItems.indexOf(selectedItem);
        if (selectedItemIndex >= 0) {
        let newSelectedItemsList = [
            ...selectedItems.slice(0, selectedItemIndex),
            ...selectedItems.slice(selectedItemIndex + 1),
        ]

        setSelectedItems(newSelectedItemsList);
        }
    }

    function removeAllSelectedItems() {
        setSelectedItems([]);
    }

    return (
        <div className={s.mainContainer}>
            <div className={s.column}>
                <div className={s.borderedItem} onClick={() => selectAllClick()}>
                    <Checkbox checked={selectedItems.length === items.length && items.length !== 0}/>
                    <span className={s.itemContent}>Выбрать все</span>
                </div>
                <div className={s.scrollContainer}>
                    <ul className={s.itemsList}>
                    {
                        items.map((item, i) => 
                            <li className={s.item} key={i} onClick={() => leftSideItemClick(item)}>
                                {
                                    <Checkbox name={i} checked={selectedItems.indexOf(item) >= 0} onChange={() => leftSideItemClick(item)}/>
                                }
                                <span className={s.item_content}>{item}</span>
                            </li>
                        )
                    }
                    </ul>
                </div>
            </div> 
            <div className={s.column}>
                <div className={s.selectedHeaderContainer}>
                    <span className={s.selectedCounter}>{selectedItems.length === 0 ? 'Ничего не выбрано' : `Выбрано ${selectedItems.length}`}</span>
                    {
                    selectedItems.length > 1
                    ? <span className={s.clearAll} onClick={() => {removeAllSelectedItems()}}>Удалить все</span>
                    : <></>
                    }
                </div>
                <div className={s.scrollContainer}>
                    <ul className={s.itemsList}>
                    {
                        selectedItems.map((selectedItem, i) => 
                            <li className={s.item} key={i} onClick={e => {removeSelectedItem(selectedItem)}}>
                                <span className={s.itemContent}>{selectedItem}</span>
                                <DeleteOutlined className={s.delete} onClick={e => {removeSelectedItem(selectedItem)}}/>
                            </li>
                        )
                    }
                    </ul>
                </div>
            </div>
        </div>
    );
}