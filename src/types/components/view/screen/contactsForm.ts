import { ContactsData } from "../partial/contacts";

export interface ContactsFormData {
  contacts: ContactsData;
  isActive: boolean;
}

export interface BillingFormSettings {
  onChange: (data: ContactsData) => void;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
}
