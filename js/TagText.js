import Tag from './Tag.js';

export default class TagText extends Tag {
    constructor(id, name, legend, position = { r: 0, theta: 0, fi: 0 }) {
        super(id, name, position);
        this._legend = legend;
        this._type = "text";
    }

    // Getters and setters for legend
    get legend() {
        return this._legend;
    }

    set legend(value) {
        this._legend = value;
    }
}