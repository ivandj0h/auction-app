import React, {useEffect, useState} from "react";
import DataTable from 'react-data-table-component';
import {Item} from "@/lib/interface/Interface";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";


async function fetchItems() {
    const res = await fetch("http://localhost:3000/api/draft");
    const data = await res.json();

    console.log("Response data:", data);
    // Log the item IDs
    data.forEach((item: Item) => {
        console.log("Item ID:", item.author);
    });

    return data;
}



export default function DraftItem() {
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [bidPrice, setBidPrice] = useState("");
    const [items, setItems] = useState<Item[]>([]);
    const [filterText, setFilterText] = useState("");
    const { data: session } = useSession();
    const route = useRouter();

    // console.log("Session:", session?.user.name);

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
        const itemDuration = item.duration ? item.duration.toString() : ''

        return (
            (item.itemName ? item.itemName.toLowerCase() : '').includes(filterText.toLowerCase()) ||
            item.current_price.toString().includes(filterText.toLowerCase()) ||
            itemDuration.includes(filterText.toLowerCase())
        );
    });

    const handlePublishClick = async (item: Item) => {
        console.log("id-item", item.id)
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

        // const data = await res.json();

        // If the API call was successful, update the items state.
        if (res.ok) {
            setItems(prevItems =>
                prevItems.map(i => (i.id === item.id ? { ...i, published: true } : i))
            );
            route.push("/dashboard")
        } else {
            console.error('Failed to publish item:', res.statusText);
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

    const filteredItemss = items.filter(item => {
        const itemDuration = item.duration ? item.duration.toString() : '';

        const matchesFilterText = (
            (item.itemName ? item.itemName.toLowerCase() : '').includes(filterText.toLowerCase()) ||
            item.current_price.toString().includes(filterText.toLowerCase()) ||
            itemDuration.includes(filterText.toLowerCase())
        );

        // @ts-ignore
        const matchesAuthor = session?.user.name === item.author;

        return matchesFilterText && matchesAuthor;
    });


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
                return row.duration ? row.duration : '';
            },
            sortable: true,
            header: CustomHeader,
        },
        {
            name: 'Publish',
            cell: (row: Item) => (
                <button
                    className={`btn px-8 mb-4 mt-4 mr-12`} // removed conditionally set classes
                    onClick={() => handlePublishClick(row)} // removed conditional check for 'published' status
                >
                    Publish
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            header: CustomHeader,
        },
        // {
        //     name: 'Bid',
        //     cell: (row: Item) => (
        //         <button
        //             className="btn px-8 mb-4 mt-4"
        //             onClick={() => handleBidClick(row)}
        //         >
        //             Bid
        //         </button>
        //     ),
        //     ignoreRowClick: true,
        //     allowOverflow: true,
        //     button: true,
        //     header: CustomHeader,
        // },
    ];

    const paginationOptions = {
        rowsPerPageText: 'Items per page:',
        rangeSeparatorText: 'of',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'All',
        selectAllRowsItemSelectable: false,
        perPage: 5, // Number of items to show per page
    };


    return (
        <div className="my-4 p-4 border rounded-md w-[90%]">
            <input
                type="text"
                placeholder="Filter By Name"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
            />
            <DataTable
                title="Draft Items"
                columns={columns}
                data={filteredItemss}
                pagination
                paginationPerPage={paginationOptions.perPage}
                paginationRowsPerPageOptions={[5, 10, 15, 20]} // Customize available rows per page options
                paginationComponentOptions={paginationOptions}
            />
            {showModal ? (
                <div className="fixed z-10 inset-0 overflow-y-auto bor" aria-labelledby="modal-title" role="dialog"
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
                                        className="mt-1 block w-full py-5 rounded-md border-gray-500 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
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
