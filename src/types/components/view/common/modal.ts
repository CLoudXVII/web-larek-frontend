import { IView } from "../../base/view";

export interface ModalData<C> {
  content: C;
  isActive: boolean;
}

export interface ModalSettings<C> {
  close: string;
  content: string;
  contentView: IView<C>;
  message?: string;
  isError?: boolean; 
  actions: HTMLElement[];
  activeClass: string;
  onOpen: () => void;
  onClose: () => void;
}
