import React, {useEffect, useState} from "react";
import DataTable from 'react-data-table-component';
import {Item} from "@/lib/interface/Interface";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {paginationOptions} from "@/lib/utils/helpers";
import TableItemColums from "@/lib/utils/TableItemColums";
import Spinner from "@/components/utils/Spinner";
import {toast} from "react-toastify";
import { formatISO } from 'date-fns';
import {calculateDuration} from "@/lib/utils/calculateDuration";



async function fetchItems() {
    const res = await fetch("http://localhost:3000/api/draft");
    const data = await res.json();

    // console.log("Response data:", data);
    // Log the item IDs
    data.forEach((item: Item) => {
        // console.log("Item ID:", item.author);
    });

    return data;
}

export default function DraftItem() {
    const [, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [bidPrice, setBidPrice] = useState("");
    const [items, setItems] = useState<Item[]>([]);
    const [filterText, setFilterText] = useState("");
    const {data: session} = useSession();
    const route = useRouter();
    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');

    const handlePublishClick = (item: Item) => {
        setCurrentItem(item);
        setShowConfirmationModal(true);
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

    const handleConfirmationModalPublish = async (item: Item | null, startTime: string, endTime: string) => {
        if (!startTime || !endTime) {
            toast.error('Error: Invalid time window');
            return;
        }

        try {
            if (item) {
                const formattedStartTime = formatISO(new Date(startTime), { representation: 'complete' });
                const formattedEndTime = formatISO(new Date(endTime), { representation: 'complete' });
                const timeWindow = calculateDuration(startTime, endTime)

                const res = await fetch(`http://localhost:3000/api/items/${item.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        start_time: formattedStartTime,
                        end_time: formattedEndTime,
                        duration: timeWindow,
                    }),
                });

                if (res.ok) {
                    setItems(prevItems =>
                        prevItems.map(i => (i.id === item.id ? {...i, published: true} : i))
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

    const handleModalConfirm = async () => {
        setShowConfirmationModal(false);
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

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchItems()
                .then(data => {
                    // console.log(data);
                    setItems(data);
                    setLoading(false); // Set loading to false when data is fetched
                })
                .catch(error => {
                    console.error('Error fetching items:', error);
                    setLoading(false); // Set loading to false even if there's an error
                });
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    const columns = TableItemColums({handlePublishClick});

    return (
        <div className="my-4 p-4 border rounded-md w-[90%]">
            {loading ? (
                <div className="flex items-center justify-center">
                    <Spinner/> Loading...
                </div>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Search Your Item here..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="p-2 w-60 border rounded border-gray-400 focus:outline-none"
                    />
                    <DataTable
                        title="Draft Items"
                        columns={columns}
                        data={filteredItems}
                        pagination
                        paginationPerPage={paginationOptions.perPage}
                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                        paginationComponentOptions={paginationOptions}
                        className="p-2 w-60 border rounded border-gray-100"
                    />
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
                                <div className="flex space-x-4 my-2">
                                    <input
                                        type="datetime-local"
                                        placeholder="Start Time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="h-12 w-full rounded border border-gray-300 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex space-x-4 my-2">
                                    <input
                                        type="datetime-local"
                                        placeholder="End Time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="h-12 w-full rounded border border-gray-300 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex justify-end mt-6">
                                    <button
                                        className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                        onClick={() => handleConfirmationModalPublish(currentItem, startTime, endTime)}
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
                </>
            )}
        </div>
    );
}
