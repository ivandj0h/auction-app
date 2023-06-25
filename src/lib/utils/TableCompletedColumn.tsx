import { Item } from "@/lib/interface/Interface";
import React from "react";
const CustomHeader = ({ column }: { column: any }) => {
    return (
        <div className="text-center font-bold bg-red-600">
            {column.name}
        </div>
    );
};

const TableCompletedColumn = () => {
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
            name: 'Status',
            selector: (row: Item) => row.status || '',
            sortable: true,
            header: CustomHeader,
            cell: (row: Item) => <span className="bg-red-600 font-bold">{row.status}</span>,
        },
    ];
};

export default TableCompletedColumn;
