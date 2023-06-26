import React, { useEffect, useState } from "react";
import DataTable, {TableColumn} from "react-data-table-component";
import { Item } from "@/lib/interface/Interface";
import { checkInputBid, paginationOptions } from "@/lib/utils/helpers";
import Spinner from "@/components/utils/Spinner";
import TableOnGoingColumn from "@/lib/utils/TableOnGoingColumn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useBalanceContext} from "@/context/BalanceContext";

async function fetchItems() {
    const res = await fetch("http://localhost:3000/api/items");
    const data = await res.json();

    return data;
}

async function fetchBalance(userId: string) {
    const res = await fetch(`http://localhost:3000/api/balance/${userId}`);
    const data = await res.json();
    return data;
}

const OnGoingTable: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [bidPrice, setBidPrice] = useState("");
    const [items, setItems] = useState<Item[]>([]);
    const [unexpiredItems, setUnexpiredItems] = useState<Item[]>([]);
    const [filterText, setFilterText] = useState("");
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [balanceCheckLoading, setBalanceCheckLoading] = useState(false);
    const [isBalanceEnough, setIsBalanceEnough] = useState(true);
    const [lowInputBidPrice, setLowInputBidPrice] = useState(false);
    const [lastBidTime, setLastBidTime] = useState<number | null>(null);
    const [bidButtonText, setBidButtonText] = useState("Submit Bid");
    const [isWaiting, setIsWaiting] = useState(false);
    const { setBalanceAmount } = useBalanceContext();


    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            fetchItems()
                .then((data: Item[]) => {
                    const currentTime = new Date().getTime();
                    const filteredData = data.filter((item: Item) => {
                        const endTime = new Date(item.end_time).getTime();
                        return currentTime < endTime;
                    });
                    setUnexpiredItems(filteredData);
                    setLoading(false);

                    // Logging item.id for each item
                    filteredData.forEach((item) => {
                        // console.log("Item ID:", item.id);
                    });
                })
                .catch((error) => {
                    console.error("Error fetching items:", error);
                    setLoading(false);
                });
        };

        fetchData();
    }, []);

    const handleBidClick = async (item: Item) => {
        if (!session) {
            await router.push("/");
            return;
        }

        setCurrentItem(item);
        setShowModal(true);
        setBidPrice("");
        setBalanceCheckLoading(true);

        if (sessionStatus === "authenticated" && session?.user?.id) {
            const userBalance = await fetchBalance(session.user.id.toString());
            setBalance(userBalance);

            // Update the comparison here
            const isEnoughBalance = item.current_price <= userBalance.balance;
            setIsBalanceEnough(isEnoughBalance);
        }

        setTimeout(() => {
            // setIsBalanceEnough(false);
            setBalanceCheckLoading(false);
        }, 2000);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setCurrentItem(null);
        setBidPrice("");
    };

    const handleModalSubmit = async (itemId: string) => {
        if (session) {
            // Fetch user's current balance
            const balanceResponse = await fetch(`/api/balance/${session.user?.id?.toString()}`);
            if (!balanceResponse.ok) {
                console.error("Error fetching balance:", balanceResponse.status, balanceResponse.statusText);
                return;
            }

            const jsonResponse = await balanceResponse.json();
            const currentBalance = jsonResponse.balance;
            // Calculate new balance amount
            const newBalanceAmount = currentBalance - parseInt(bidPrice);
            setBalanceAmount(newBalanceAmount);

            // Update item's bid price and user's balance
            const response = await fetch(`/api/bid/${itemId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    authorId: session.user?.id?.toString(),
                    newBidPrice: parseInt(bidPrice),
                    newBalanceAmount: parseInt(String(newBalanceAmount)), // Update this line
                }),
            });

            if (!response.ok) {
                console.error("Error submitting bid:", response.status, response.statusText);
                // You could handle error response here
            } else {
                const data = await response.json(); // if your API returns JSON data
                // You could handle successful response here
                toast.success("Bid submitted successfully", data);
            }
        } else {
            console.error("Session is null");
            // Handle the case when session is null
        }

        handleModalClose();
        setIsWaiting(true); // Set isWaiting to true after bid is submitted
    };


    const handleBidPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBidPrice(e.target.value);
    };

    const handleSubmitBid = () => {
        const enteredBidPrice = parseFloat(bidPrice);

        if (!bidPrice) {
            // Handle empty input value
            toast.error("Bid price is empty");
            handleModalClose();
            return;
        }

        // Assuming currentItem is an object that could potentially be null or undefined
        if (currentItem && currentItem.current_price) {

            const currentTime = Date.now();
            const timeDifference = currentTime - (lastBidTime || 0);
            const waitingPeriod = 5000; // 5 seconds

            if (timeDifference < waitingPeriod) {
                console.log("Please wait before bidding again.");
                return;
            }

            if (checkInputBid(currentItem.current_price, enteredBidPrice)) {
                if (currentItem.id) { // Add a null/undefined check for currentItem.id
                    handleModalSubmit(currentItem.id.toString());

                    // Update the last bid time
                    setLastBidTime(Date.now());

                    // Update the bid button text to indicate the waiting period
                    setBidButtonText("Waiting...");
                    setIsWaiting(true);

                    setTimeout(() => {
                        setBidButtonText("Submit Bid");
                        setIsWaiting(false);
                    }, waitingPeriod);
                } else {
                    console.log("Item ID is missing");
                    // Handle case when the item ID is missing
                }
            } else {
                console.log("Input bid price is not valid");
                // Handle case when the bid price is not valid according to checkInputBid
            }
        } else {
            handleModalClose();
        }
    };


    const columns: TableColumn<Item>[] = TableOnGoingColumn({ handlePublishClick: handleBidClick, isWaiting });


    return (
        <div className="my-4 p-4 border rounded-md">
            {loading ? (
                <div className="flex items-center justify-center">
                    <Spinner /> Loading...
                </div>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Find Item By Name"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="p-2 w-60 border rounded border-gray-400 focus:outline-none"
                    />
                    <DataTable
                        title="On Going Auctions"
                        columns={columns}
                        data={unexpiredItems}
                        pagination
                        paginationPerPage={paginationOptions.perPage}
                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                        paginationComponentOptions={paginationOptions}
                        className="p-2 w-60 border rounded border-gray-200"
                    />

                    {showModal && (
                        <div
                            className="fixed z-10 inset-0 overflow-y-auto"
                            aria-labelledby="modal-title"
                            role="dialog"
                            aria-modal="true"
                        >
                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                  &#8203;
                </span>
                                <div
                                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                                >
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <h1 className="text-2xl leading-6 font-black text-gray-900" id="modal-title">
                                            {currentItem?.itemName}
                                        </h1>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            {currentItem?.current_price.toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            })}
                                        </h3>
                                        <div className="mt-2">
                                            <input
                                                type="number"
                                                value={bidPrice}
                                                onChange={handleBidPriceChange}
                                                placeholder="Bid price"
                                                className="mt-1 block w-full py-2 px-4 rounded-md border-2 focus:border-blue-300"
                                                disabled={balanceCheckLoading || isWaiting} // Disable input during waiting period
                                            />
                                            {balanceCheckLoading ? (
                                                <div className="flex items-center justify-center mt-4">
                                                    <Spinner /> Checking your Balance...
                                                </div>
                                            ) : isBalanceEnough ? (
                                                <p className="text-green-500 mt-2">Your balance is enough to bid the item. Good luck!</p>
                                            ) : (
                                                <p className="text-red-500 mt-2">Your balance is not enough. Please top up to bid the item.</p>
                                            )}
                                            {lowInputBidPrice ? (
                                                <p className="text-red-500 mt-2">Bid price must be higher than current price</p>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="button"
                                                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer ${
                                                    balanceCheckLoading || !isBalanceEnough || isWaiting
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }`}
                                                onClick={handleSubmitBid}
                                                disabled={!isBalanceEnough || balanceCheckLoading || isWaiting} // Disable button during waiting period
                                            >
                                                {bidButtonText}
                                            </button>
                                            <button
                                                type="button"
                                                className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer ${
                                                    balanceCheckLoading || isWaiting ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                                onClick={handleModalClose}
                                                disabled={balanceCheckLoading || isWaiting} // Disable button during waiting period
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            <ToastContainer position="top-center" autoClose={1000} />
        </div>
    );
};

export default OnGoingTable;
