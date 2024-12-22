import { ensureElement } from '../utils/utils';
import { Component } from './base/component';

interface ISuccessActions { // описывает действия, связанные с успешным событием.
    onClick: (event: MouseEvent) => void; // Обработчик события клика
}

export interface ISuccess { // описывает данные для успешного события.
    description: number; // Значение, описывающее успешное действие
    total: string;
}
  
export class Success extends Component<ISuccess> { //управляет отображением информации об успешном событии, наследует функциональность базового класса Component
    
    protected _totalAmount: HTMLElement; // Приватные свойства для DOM-элементов: кнопка для закрытия 
    protected _closeButton: HTMLButtonElement;
  
    constructor(container: HTMLElement, actions: ISuccessActions) { // Конструктор принимает:
    
        super(container); // Вызов конструктора родительского класса
  
        this._totalAmount = ensureElement<HTMLElement>('.order-success__description', this.container); // Поиск кнопки закрытия 
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container); // и элемента описания в контейнере на основе имени блока.
  
        if (actions?.onClick) { // Если передан обработчик нажатия, добавляем его к кнопке.
            this._closeButton.addEventListener('click', actions.onClick);
        }
    }

    set total(value: string) { // Сеттер, обновляющий текст элемента описания.
		this.setText(this._totalAmount, `Списано ${value} синапсов`); // Он принимает значение числа и отображает его в формате "Списано X синапсов"
	}
}