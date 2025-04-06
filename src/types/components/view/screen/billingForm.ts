import { BillingInfoData } from "../partial/billing";

export interface BillingFormData {
  info: BillingInfoData;
  isActive: boolean;
}

export interface BillingFormSettings {
	onChange: (data: BillingInfoData) => void;
	onClose: () => void;
	onNext: () => void;
	onBack: () => void;
}
