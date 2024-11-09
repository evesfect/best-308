import {User} from "@/types/user";
import {Order} from "@/types/order";

export interface Invoice {
    invoiceId: string;
    user: User;
    order: Order;
    invoiceDate: Date;
}
