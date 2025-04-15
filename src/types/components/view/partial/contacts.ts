import { IChangeable } from "../../base/view";

export interface ContactsData {
  email: string;
  phone: string;
}

export interface ContactsSettings extends ContactsData, IChangeable<ContactsData> {}
