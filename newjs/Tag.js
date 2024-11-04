export default class Tag {
    constructor() {
        this._name = 'New tag';
        this._position = { radius: 0, theta: 0, phi: 0 };
        this._textColor = '#ffffff';
        this._type = 'tag';
    }

    // Getters and setters
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
