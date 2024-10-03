export default class Tag {
    constructor(id, name, position = { r: 0, theta: 0, fi: 0 }, textColor) {
        this._id = id;
        this._name = name;
        this._position = position;
        this._textColor = textColor;
        this._type = 'tag';
    }

    // Getters and setters
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
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
