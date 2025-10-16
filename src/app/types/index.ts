export interface IPhone {
  _id?: string;
  model: string;
  memory: string;
  brand: string;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContract {
  _id?: string;
  phoneModel: string;
  price: number;
  downPayment: number;
  monthlyPayment: number;
  months: number;
  paymentDay: number;
  startDate: Date;
  nextPaymentDate: Date;
  paidMonths: number;
  status: "active" | "completed" | "cancelled";
}

export interface ICustomer {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  passport: string;
  address: string;
  contracts: IContract[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPaymentNotification {
  _id?: string;
  customerId: string;
  contractId: string;
  paymentDate: Date;
  amount: number;
  sent: boolean;
  sentAt?: Date;
}

export interface ITodayPayment {
  customer: string;
  phone: string;
  email: string;
  phoneModel: string;
  amount: number;
  contractId: string;
  customerId: string;
}
