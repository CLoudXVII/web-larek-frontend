import { IClickable } from "../../base/view";

export interface ButtonData {
  label: string; // Текст на кнопке
  disabled?: boolean; // Флаг отключения кнопки
}

export interface ButtonSettings<T> extends IClickable<T> {}
