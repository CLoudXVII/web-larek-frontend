import { IClickable } from "../../base/view";

export interface ButtonData {
  label: string;
  disabled?: boolean;
}

export interface ButtonSettings<T> extends IClickable<T> {}
