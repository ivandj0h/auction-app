// Pagination options
import {toast} from "react-toastify";

export const paginationOptions = {
    rowsPerPageText: 'Items per page:',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
    selectAllRowsItemSelectable: false,
    perPage: 5,
};

export const checkInputBid = (currentItemPrice: number, enteredBidPrice: number) => {
    // Check if either price is not a number
    if (isNaN(currentItemPrice) || isNaN(enteredBidPrice)) {
        throw new Error("Both prices must be valid numbers");
    }

    if (enteredBidPrice < currentItemPrice) {
        toast.error("The input bid price can't be lower than the current price");
        return false;
    }

    return true;
};

