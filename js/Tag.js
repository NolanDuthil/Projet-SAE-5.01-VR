import { uniqueId } from './utils.js';

export default class Tag {
    constructor() {
        this._id = uniqueId();
        this._name = 'New tag';
        this._position = { r: 20, theta: 90, phi: 0 };
        this._textColor = '#ffffff';
        this._type = 'tag';
    }

    // Getters and setters
    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get textColor() {
        return this._textColor;
    }

    set textColor(color) {
        this._textColor = color;
    }
}
