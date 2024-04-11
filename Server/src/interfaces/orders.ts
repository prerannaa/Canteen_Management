export interface Order  {
    id: number;
    userId: number;
    itemId: number;
    quantity: number;
    totalPrice: number;
    remarks: string;
    createdAt: Date;
  }

export interface OrderPartial {
    itemId: number;
    remarks: string;
  }