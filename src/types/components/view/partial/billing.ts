import { IChangeable } from "../../base/view";

export interface BillingInfoData {
  paymentMethod: "online" | "offline";
  address: string;
}

export interface BillingInfoSettings extends IChangeable<BillingInfoData> {
  paymentMethod: string;
  address: string;
}
