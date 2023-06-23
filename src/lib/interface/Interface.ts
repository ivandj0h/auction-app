export type Balance = {
    amount: number;
};

export type User = {
    name: string;
    balance: Balance[];
};

export type Author = {
    name: string | null;
    balance: Balance[];
};

export type Item = {
    id: number;
    itemName: string | null;
    status: string;
    current_price: number;
    bid_price: number;
    duration: string;
    published: boolean;
    itemId: number;
    author: User;
};

