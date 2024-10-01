export default class Scene {
    constructor(name, image, camera = { vertical, horizontal }, tags) {
        this._name = name;
        this._image = image;
        this._camera = camera;
        this._tags = tags;
    }

    // Getters and setters
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get image() {
        return this._image;
    }

    set image(value) {
        this._image = value;
    }

    get camera() {
        return this._camera;
    }

    set camera(value) {
        this._camera = value;
    }

    get tags() {
        return this._tags;
    }

    set tags(value) {
        this._tags = value;
    }

    addTag(tag) {
        this._tags.push(tag);
    }

    updateTag(index, newTag) {
        this._tags[index] = newTag;
    }

    removeTag(index) {
        this._tags.splice(index, 1);
    }
}
