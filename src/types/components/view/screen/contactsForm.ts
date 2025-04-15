import { ContactsData } from "../partial/contacts";

export interface ContactsFormData {
  contacts: ContactsData;
  message: string;
  isActive: boolean;
  isError: boolean;
}

export interface ContactsFormSettings {
  onChange: (data: ContactsData) => void;
  onClose: () => void;
  onNext: () => void;
}
