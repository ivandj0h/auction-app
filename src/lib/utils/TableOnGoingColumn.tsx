import { Item } from "@/lib/interface/Interface";
import { FiCheck } from "react-icons/fi";
import React from "react";

interface TableOnGoingColumnProps {
    handlePublishClick: (item: Item) => void;
}

const CustomHeader = ({ column }: { column: any }) => {
    return (
        <div className="text-center font-bold bg-red-600">
            {column.name}
        </div>
    );
};

const TableOnGoingColumn = ({ handlePublishClick }: TableOnGoingColumnProps) => {
    return [
        {
            name: 'Name',
            selector: (row: Item) => row.itemName || '',
            sortable: true,
            header: CustomHeader,
        },
        {
            name: 'Current Price',
            selector: (row: Item) => `${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(row.current_price)}`,
            sortable: true,
            right: false,
            header: CustomHeader,
        },
        {
            name: 'Duration',
            selector: (row: Item) => {
                return row.duration ? row.duration : '';
            },
            sortable: true,
            header: CustomHeader,
        },
        {
            name: 'Bid',
            cell: (row: Item) => (
                <button
                    className="p-2 bg-red-500 hover:bg-red-700 m-2 rounded-md text-white"
                    onClick={() => handlePublishClick(row)}
                >
                    <FiCheck size={18} />
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            header: CustomHeader,
        },
    ];
};

export default TableOnGoingColumn;
