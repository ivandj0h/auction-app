import React, {useEffect, useState} from "react";
import DataTable from 'react-data-table-component';
import {Item} from "@/lib/interface/Interface";
import {paginationOptions} from "@/lib/utils/helpers";
import Spinner from "@/components/utils/Spinner";
import TableItemColums from "@/lib/utils/TableItemColums";


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
    const [unexpiredItems, setUnexpiredItems] = useState<Item[]>([]);
    const [filterText, setFilterText] = useState("");
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            fetchItems()
                .then((data: Item[]) => {
                    const currentTime = new Date().getTime();
                    const filteredData = data.filter((item: Item) => {
                        const endTime = new Date(item.end_time).getTime();
                        return currentTime < endTime;
                    });
                    setUnexpiredItems(filteredData);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching items:', error);
                    setLoading(false);
                });
        };

        fetchData();
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

    const handlePublishClick = async (item: Item) => {
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
                prevItems.map(i => (i.id === item.id ? {...i, published: true} : i))
            );
        } else {
            console.error('Failed to publish item:', data);
        }
    };
    // console.log('yang sudah di diflter:', filteredItems);

    const columns = TableItemColums({ handlePublishClick: handleBidClick });

    return (
        <div className="my-4 p-4 border rounded-md">
            {loading ? (
                <div className="flex items-center justify-center">
                    <Spinner/> Loading...
                </div>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Find Item By Name"
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="p-2 w-60 border rounded border-gray-400 focus:outline-none"
                    />
                    <DataTable
                        title="On Going Auctions"
                        columns={columns}
                        data={unexpiredItems} // make sure you're using unexpiredItems
                        pagination
                        paginationPerPage={paginationOptions.perPage}
                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                        paginationComponentOptions={paginationOptions}
                        className="p-2 w-60 border rounded border-gray-200"
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
                </>
            )}
        </div>
    );
};
