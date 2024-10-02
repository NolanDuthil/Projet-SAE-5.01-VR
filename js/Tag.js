export default class Tag {
    constructor(id, name, position = { r: 0, theta: 0, fi: 0 }) {
        this._id = id;
        this._name = name;
        this._position = position;
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

    // Method to update position
    updatePosition(r, theta, fi) {
        this._position = { r, theta, fi };
    }
}
