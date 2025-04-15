import { BillingInfoData } from "../partial/billing";

export interface BillingFormData {
  info: BillingInfoData;
	message: string;
  isActive: boolean;
	isError: boolean;
}

export interface BillingFormSettings {
	onChange: (data: BillingInfoData) => void;
	onClose: () => void;
	onNext: () => void;
}
