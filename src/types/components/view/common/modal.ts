import { IView } from "../../base/view";

export interface ModalData<C> {
  content: C;
  isActive: boolean;
  isError?: boolean;
}

export interface ModalSettings<C> {
  content: string;
  contentView: IView<C>;
  message: string;
  isError: boolean; 
  actions: HTMLElement[];
  activeClass: string;
  messageErrorClass?: string;
  onOpen: () => void;
  onClose: () => void;
}
