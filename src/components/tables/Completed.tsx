import React, {useEffect, useState} from "react";
import DataTable from 'react-data-table-component';
import {Item} from "@/lib/interface/Interface";
import {paginationOptions} from "@/lib/utils/helpers";
import Spinner from "@/components/utils/Spinner";
import TableCompletedColumn from "@/lib/utils/TableCompletedColumn";


async function fetchItems() {
    const res = await fetch("http://localhost:3000/api/completed");
    const data = await res.json();
    return data;
}

export default function Completed() {
    const [items, setItems] = useState<Item[]>([]);
    const [expiredAndCompletedItems, setExpiredAndCompletedItems] = useState<Item[]>([]);
    const [filterText, setFilterText] = useState("");
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            fetchItems()
                .then((data: Item[]) => {
                    const currentTime = new Date().getTime();
                    const filteredData = data.filter((item: Item) => {
                        const endTime = new Date(item.end_time).getTime();
                        return currentTime > endTime;
                    });
                    setExpiredAndCompletedItems(filteredData);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching items:', error);
                    setLoading(false);
                });
        };

        fetchData();
    }, []);


    const columns = TableCompletedColumn();

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
                        title="Complete Auctions"
                        columns={columns}
                        data={expiredAndCompletedItems} // make sure you're using unexpiredItems
                        pagination
                        paginationPerPage={paginationOptions.perPage}
                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                        paginationComponentOptions={paginationOptions}
                        className="p-2 w-60 border rounded border-gray-200"
                    />
                </>
            )}
        </div>
    );
};
