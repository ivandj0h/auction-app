import React, {useState} from "react";

interface Item {
    itemName: string;
    status: string;
    duration: string;
    bid: string;
}

interface Props {
    data?: Item[];
}

const OnGoingTable: React.FC<Props> = ({data = []}) => {
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [bidPrice, setBidPrice] = useState("");

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

    return (
        <div className="my-4 p-4 border rounded-md">
            <div className="w-full">
                <table className="table-auto w-full">
                    <thead>
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Current Price</th>
                        <th className="px-4 py-2">Duration</th>
                        <th className="px-4 py-2">Bid</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{item.itemName}</td>
                            <td className="border px-4 py-2">{item.status}</td>
                            <td className="border px-4 py-2">{item.duration}</td>
                            <td className="border px-4 py-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleBidClick(item)}
                                >
                                    Bid
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

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


export default OnGoingTable;
