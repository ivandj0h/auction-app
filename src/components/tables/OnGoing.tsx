import React, {useEffect, useState} from "react";
import DataTable from 'react-data-table-component';
import {calculateDuration} from "@/lib/utils/calculateDuration";

interface Item {
    id: string;
    published: boolean;
    itemName: string | null;  // modify this
    current_price: number;
    start_duration: string | Date | null;  // modify this
    end_duration: string | Date | null;  // modify this
    bid: string;
    author: string;
    status: string;
}


async function fetchItems() {
    const res = await fetch("http://localhost:3000/api/items");
    const data = await res.json();
    return data;
}

export default function OnGoingTable() {
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [bidPrice, setBidPrice] = useState("");
    const [items, setItems] = useState<Item[]>([]);
    const [filterText, setFilterText] = useState("");

    useEffect(() => {
        fetchItems().then(data => setItems(data));
    }, []);

    const handleBidClick = (item: Item) => {
        setCurrentItem(item);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setCurrentItem(null);
        setBidPrice("");
    };

    const handleModalSubmit = () => {
        console.log("Submitting bid for", currentItem, "with price", bidPrice);
        handleModalClose();
    };

    const filteredItems = items.filter(item => {
        const itemDuration = calculateDuration(
            item.start_duration ? item.start_duration.toString() : '',
            item.end_duration ? item.end_duration.toString() : ''
        );

        return (
            (item.itemName ? item.itemName.toLowerCase() : '').includes(filterText.toLowerCase()) ||
            item.current_price.toString().includes(filterText.toLowerCase()) ||
            itemDuration.includes(filterText.toLowerCase())
        );
    });


    const handlePublishClick = async (item: Item) => {
        // Assuming that your API expects an item ID to update the published status.
        const res = await fetch(`http://localhost:3000/api/items/${item.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                published: true,
            }),
        });

        const data = await res.json();

        // If the API call was successful, update the items state.
        if (res.ok) {
            setItems(prevItems =>
                prevItems.map(i => (i.id === item.id ? { ...i, published: true } : i))
            );
        } else {
            console.error('Failed to publish item:', data);
        }
    };


    // Custom Header Component
    const CustomHeader = ({ column }: { column: any }) => {
        return (
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                {column.name}
            </div>
        );
    };


    const columns = [
        {
            name: 'Name',
            selector: (row: Item) => row.itemName || '', // If itemName is null, return an empty string instead
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
                const current_time = new Date().toISOString();
                const start_duration = row.start_duration instanceof Date ? row.start_duration.toISOString() : row.start_duration ? row.start_duration : '';
                const duration = calculateDuration(start_duration, current_time);
                console.log(duration);
                return duration;
            },
            sortable: true,
            header: CustomHeader,
        },

        {
            name: 'Publish',
            cell: (row: Item) => (
                row.author === 'admin' && (
                    <button
                        className={`btn px-8 mb-4 mt-4 mr-12 ${row.published ? 'opacity-50 cursor-not-allowed' : ''}`} // add disabled styles here
                        onClick={() => !row.published && handlePublishClick(row)} // prevent clicking when published
                        disabled={row.published} // disable the button when published
                    >
                        Publish
                    </button>
                )
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            header: CustomHeader,
        },
        {
            name: 'Bid',
            cell: (row: Item) => (
                <button
                    className="btn px-8 mb-4 mt-4"
                    onClick={() => handleBidClick(row)}
                >
                    Bid
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            header: CustomHeader,
        },
    ];


    return (
        <div className="my-4 p-4 border rounded-md">
            <input
                type="text"
                placeholder="Filter By Name"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
            />
            <DataTable
                title="My Table"
                columns={columns}
                data={filteredItems}
                pagination
            />
            {showModal ? (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
                     aria-modal="true">
                    <div
                        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                             aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"
                              aria-hidden="true">&#8203;</span>
                        <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Bid {currentItem?.itemName}
                                </h3>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        value={bidPrice}
                                        onChange={(e) => setBidPrice(e.target.value)}
                                        placeholder="Bid price"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleModalSubmit}>
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    onClick={handleModalClose}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
