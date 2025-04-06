import { ContactsData } from "../partial/contacts";

export interface ContactsFormData {
  contacts: ContactsData;
  isActive: boolean;
}

export interface ContactsFormSettings {
  onChange: (data: ContactsData) => void;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
}
