import { CartData } from "./cart";

export interface SuccessData {
	description: CartData;
	isActive: boolean;
}

export interface SuccessSettings {
  description: string;
	onClose: () => void;
}
