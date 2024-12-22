import {IEvents} from './base/events';
import { ensureElement } from '../utils/utils';
import { IForm } from "../types/index";
import { Component } from './base/component';

export class Form<T> extends Component<IForm> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) { //для уведомления о изменении значения поля формы.
        this.events.emit('input:validate', {
            field,
            value
        });
    }

    set valid(value: boolean) { //устанавливает значение свойства disabled кнопки отправки формы в зависимости от значения valid
        this._submit.disabled = !value;
    }

    set errors(value: string) { //устанавливает текст ошибки в элементе с классом .form__errors.
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IForm) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}

