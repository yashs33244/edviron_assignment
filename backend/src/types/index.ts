import { PrismaClient } from '@prisma/client';

// Extend the PrismaClient type
export type PrismaClientType = PrismaClient;

// StudentInfo type
export type StudentInfoType = {
  name: string;
  id: string;
  email: string;
};

// Order type
export type OrderType = {
  id: string;
  school_id: string;
  trustee_id: string;
  student_info: StudentInfoType;
  gateway_name: string;
  custom_order_id: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// OrderStatus type
export type OrderStatusType = {
  id: string;
  collect_id: string;
  order_amount: number;
  transaction_amount: number;
  payment_mode: string | null;
  payment_details: string | null;
  bank_reference: string | null;
  payment_message: string | null;
  status: string;
  error_message: string | null;
  payment_time: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// Order with status type
export type OrderWithStatusType = OrderType & {
  orderStatus: OrderStatusType | null;
}; 