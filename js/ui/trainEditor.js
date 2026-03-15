function initTrainEditor() {
    document.getElementById('btn-add-train').addEventListener('click', () => {
        const typeId = WebDiaState.trainTypes.length > 0 ? WebDiaState.trainTypes[0].id : null;
        const newTrain = {
            id: generateId("TR"),
            number: "New",
            type: typeId,
            name: "",
            destination: "",
            direction: "down",
            timetable: []
        };
        WebDiaState.trains.push(newTrain);
        updateTrainList();
        renderDiagram();
        saveToLocalStorage();
        openTrainEditor(newTrain);
    });

    document.getElementById('btn-save-train').addEventListener('click', () => {
        const id = document.getElementById('edit-train-id').value;
        const train = WebDiaState.trains.find(t => t.id === id);
        if (train) {
            train.number = document.getElementById('edit-train-number').value;
            train.name = document.getElementById('edit-train-name').value;
            train.destination = document.getElementById('edit-train-destination').value;
            train.direction = document.getElementById('edit-train-direction').value;
            train.type = document.getElementById('edit-train-type').value;

            updateTrainList();
            renderDiagram();
            saveToLocalStorage();
            alert("列車情報を保存しました");
        }
    });
}

function updateTrainList() {
    const ul = document.getElementById('train-list-ul');
    if (!ul) return;
    
    ul.innerHTML = '';
    WebDiaState.trains.forEach(t => {
        const li = document.createElement('li');
        li.textContent = `${t.number} ${t.name} (${t.direction === 'down'?'下':'上'})`;
        li.dataset.id = t.id;
        li.addEventListener('click', () => {
            openTrainEditor(t);
            openTimetableEditor(t);
        });
        ul.appendChild(li);
    });
    
    // Update type select
    const typeSelect = document.getElementById('edit-train-type');
    if (typeSelect) {
        typeSelect.innerHTML = '';
        WebDiaState.trainTypes.forEach(ty => {
            const opt = document.createElement('option');
            opt.value = ty.id;
            opt.textContent = ty.name;
            typeSelect.appendChild(opt);
        });
    }
}

function openTrainEditor(train) {
    document.getElementById('editor-train').style.display = 'block';
    
    document.getElementById('edit-train-id').value = train.id;
    document.getElementById('edit-train-number').value = train.number || "";
    document.getElementById('edit-train-name').value = train.name || "";
    document.getElementById('edit-train-destination').value = train.destination || "";
    document.getElementById('edit-train-direction').value = train.direction || "down";
    
    // delay for option populate if needed, but it should be populated via updateTrainList
    setTimeout(() => {
        document.getElementById('edit-train-type').value = train.type || "";
    }, 0);
}
