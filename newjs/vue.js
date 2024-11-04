export function populateRoomList(roomsInstances, updateRoomDetails) {
    const roomsContainer = document.getElementById('rooms');
    roomsContainer.innerHTML = ''; // Vider le conteneur

    roomsInstances.forEach(room => {
        const roomItem = document.createElement('div');
        roomItem.classList.add('main__bottom_panel__left_side__rooms__item');

        const roomImage = document.createElement('img');
        roomImage.src = room.image ? "./uploaded_images/" + room.image : "./assets/grey-background.avif";
        roomImage.alt = room.name;
        roomImage.classList.add('main__bottom_panel__left_side__rooms__item__image');

        const roomLabel = document.createElement('div');
        roomLabel.classList.add('main__bottom_panel__left_side__rooms__item__label');
        roomLabel.textContent = room.name;

        roomItem.appendChild(roomImage);
        roomItem.appendChild(roomLabel);

        roomItem.addEventListener('click', () => {
            updateRoomDetails(room);
        });

        roomsContainer.appendChild(roomItem);
    });
}

export function updateRoomDetailsView(selectedRoom, updateCameraRotation, loadTagDetails, hideTags) {
    const roomNameInput = document.getElementById('room-name');
    const cameraVerticalInput = document.getElementById('camera-vertical');
    const cameraHorizontalInput = document.getElementById('camera-horizontal');
    const tagSelect = document.getElementById('tags-select');

    roomNameInput.value = selectedRoom.name;
    const roomImage = selectedRoom.image ? "./uploaded_images/" + selectedRoom.image : "./assets/grey-background.avif";
    document.getElementById('image-360').setAttribute('src', roomImage);

    cameraVerticalInput.value = selectedRoom.camera.vertical;
    cameraHorizontalInput.value = selectedRoom.camera.horizontal;

    tagSelect.innerHTML = '';
    const tags = selectedRoom.tags || [];
    tags.forEach((tag, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = tag.name;
        tagSelect.appendChild(option);
    });

    updateCameraRotation();
    if (tags.length > 0) {
        loadTagDetails(tags, 0);
    } else {
        hideTags();
    }
}