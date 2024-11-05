import Room from './Room.js';

export default class Experience {
    constructor() {
        this._rooms = []; // Array of Room objects
    }

    // Getters and setters
    get rooms() {
        return this._rooms;
    }

    set rooms(rooms) {
        this._rooms = rooms;
    }

    // Rooms Methods
    addRoom(name, src360, position = { vertical: 0, horizontal: 0 }) {
        let room = new Room();
        room.name = name;
        room.src360 = src360;
        room.position = position;
        this._rooms.push(room);
        return room;
    }

    deleteRoom(roomName) {
        this._rooms = this._rooms.filter(room => room.name !== roomName);
    }

    getRoom(roomName) {
        return this._rooms.find(room => room.name === roomName);
    }

    // Experience Methods
    exportExperience() {
        return JSON.stringify(this);
    }

    importExperience(json) {
        let obj = JSON.parse(json);
        this._rooms = obj.rooms;
    }
}