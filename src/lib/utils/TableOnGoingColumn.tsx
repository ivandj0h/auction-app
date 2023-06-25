import { Item } from "@/lib/interface/Interface";
import { FiCheck } from "react-icons/fi";
import React, {useState} from "react";
import { TableColumn } from "react-data-table-component";
import {FaTimes} from "react-icons/fa";
import {IoMdHourglass} from "react-icons/io";

interface TableOnGoingColumnProps {
    handlePublishClick: (item: Item) => void;
    isWaiting: boolean;
}

const TableOnGoingColumn = ({ handlePublishClick, isWaiting }: TableOnGoingColumnProps): TableColumn<Item>[] => {

    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    return [
        {
            name: "Name",
            selector: (row: Item) => row.itemName || "",
            sortable: true,
        },
        {
            name: "Current Price",
            selector: (row: Item) =>
                `${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(row.current_price)}`,
            sortable: true,
            right: false,
        },
        {
            name: "Duration",
            selector: (row: Item) => {
                return row.duration ? row.duration : "";
            },
            sortable: true,
        },
        {
            name: "Bid",
            cell: (row: Item) => (
                <button
                    className="p-2 m-2 rounded-md text-white bg-red-500 hover:bg-red-700"
                    onClick={() => handlePublishClick(row)}
                    disabled={isWaiting || row.id === selectedItem?.id}
                    style={{ backgroundColor: isWaiting || row.id === selectedItem?.id ? "#cccccc" : "#e53e3e" }}
                >
                    {row.id === selectedItem?.id ? (
                        <IoMdHourglass size={18} className="animate-spin" />
                    ) : (
                        <FiCheck size={18} />
                    )}
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }

    ];
};

export default TableOnGoingColumn;
