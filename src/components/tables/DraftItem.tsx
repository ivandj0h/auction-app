import React, {useEffect, useState} from "react";
import DataTable from 'react-data-table-component';
import {Item} from "@/lib/interface/Interface";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {FiCheck} from "react-icons/fi";

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
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [bidPrice, setBidPrice] = useState("");
    const [items, setItems] = useState<Item[]>([]);
    const [filterText, setFilterText] = useState("");
    const {data: session} = useSession();
    const route = useRouter();

    const handleBidClick = (item: Item) => {
        setCurrentItem(item);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setCurrentItem(null);
        setBidPrice("");
    };

    const handleConfirmationModalClose = () => {
        setShowConfirmationModal(false);
    };

    const handleModalSubmit = async () => {
        console.log("Submitting bid for", currentItem, "with price", bidPrice);

        const res = await fetch('http://localhost:3000/api/draft', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemName: currentItem?.itemName,
                current_price: bidPrice,
                // add other fields here as necessary
            }),
        });

        if (res.ok) {
            const newItem = await res.json();
            setItems(prevItems => [...prevItems, newItem]);
            setTimeout(() => {
                setShowModal(false);
            }, 2000);
        } else {
            console.error('Failed to submit bid:', res.statusText);
        }
    };

    const handleConfirmationModalPublish = async (item: Item | null) => {
        try {
            if (item) {
                const res = await fetch(`http://localhost:3000/api/items/${item.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        published: true,
                    }),
                });

                if (res.ok) {
                    setItems(prevItems =>
                        prevItems.map(i => (i.id === item.id ? { ...i, published: true } : i))
                    );
                    route.push("/dashboard");
                } else {
                    console.error('Failed to publish item:', res.statusText);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }

        setShowConfirmationModal(false);
    };



    const handlePublishClick = (item: Item) => {
        setCurrentItem(item);
        setShowConfirmationModal(true);
    };

    const handleModalConfirm = async () => {
        setShowConfirmationModal(false);
    };

    const CustomHeader = ({column}: { column: any }) => {
        return (
            <div style={{textAlign: 'center', fontWeight: 'bold'}}>
                {column.name}
            </div>
        );
    };

    const filteredItems = items.filter(item => {
        const itemDuration = item.duration ? item.duration.toString() : '';

        const matchesFilterText = (
            (item.itemName ? item.itemName.toLowerCase() : '').includes(filterText.toLowerCase()) ||
            item.current_price.toString().includes(filterText.toLowerCase()) ||
            itemDuration.includes(filterText.toLowerCase())
        );

        // Filter items based on the logged-in user
        // @ts-ignore
        const matchesAuthor = session?.user.name === item.author;

        return matchesFilterText && matchesAuthor;
    });

    const columns = [
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
                    <FiCheck size={18}/>
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            header: CustomHeader,
        },
    ];

    const paginationOptions = {
        rowsPerPageText: 'Items per page:',
        rangeSeparatorText: 'of',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'All',
        selectAllRowsItemSelectable: false,
        perPage: 5,
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchItems().then(data => {
                console.log(data);
                setItems(data);
            });
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="my-4 p-4 border rounded-md w-[90%]">
            <input
                type="text"
                placeholder="Search Your Item here..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="p-2 w-60 border rounded border-gray-400"
            />
            <DataTable
                title="Draft Items"
                columns={columns}
                data={filteredItems}
                pagination
                paginationPerPage={paginationOptions.perPage}
                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                paginationComponentOptions={paginationOptions}
            />
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 shadow-lg">
                        <h3 className="text-lg font-medium mb-4">Bid {currentItem?.itemName}</h3>
                        <div className="mb-4">
                            <input
                                type="text"
                                value={bidPrice}
                                onChange={(e) => setBidPrice(e.target.value)}
                                placeholder="Bid price"
                                className="w-full p-2 border rounded border-gray-400"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="btn btn-primary mr-2"
                                onClick={handleModalSubmit}
                            >
                                Submit
                            </button>
                            <button
                                className="btn"
                                onClick={handleModalClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmationModal && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 border border-gray-300">
                        <div className="text-center">
                            <h3 className="text-lg font-medium mb-4">
                                Confirm Publishing : <br/>
                                <span className="font-bold text-red-600">{currentItem?.itemName}</span>
                            </h3>
                        </div>
                        <p>Are you sure you want to publish this item?</p>
                        <div className="flex justify-end mt-6">
                            <button
                                className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={() => handleConfirmationModalPublish(currentItem)}
                            >
                                Publish
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                                onClick={handleConfirmationModalClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
