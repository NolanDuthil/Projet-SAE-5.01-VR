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
    addRoom(name) {
        let room = new Room();
        room.name = name;
        this._rooms.push(room);
        return room;
    }

    deleteRoom(roomId) {
        this._rooms = this._rooms.filter(room => room.id !== roomId);
    }

    getRoom(roomId) {
        return this._rooms.find(room => room.id === roomId);
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