import React from "react";
import {Item} from "@/lib/interface/Interface";
import {FiCheck} from "react-icons/fi";


// custom header component
const CustomHeader = ({column}: { column: any }) => {
    return (
        <div style={{textAlign: 'center', fontWeight: 'bold'}}>
            {column.name}
        </div>
    );
};

// custom table item columns
// @ts-ignore
const TableItemColums = ({ handlePublishClick }) => {
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
                selector: (row: Item) => row.duration ? row.duration : '',
                sortable: true,
                header: CustomHeader,
            },
            {
                name: 'Publish',
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

}

export default TableItemColums;
