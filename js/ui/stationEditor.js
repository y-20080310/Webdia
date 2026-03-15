function initStationEditor() {
    document.getElementById('btn-add-station').addEventListener('click', () => {
        const name = prompt("駅名を入力してください", "新駅");
        if (name) {
            WebDiaState.stations.push({
                id: generateId("ST"),
                name: name,
                distance: 0,
                tracks: ["1"]
            });
            updateStationList();
            renderDiagram();
            saveToLocalStorage();
        }
    });
}

function updateStationList() {
    const ul = document.getElementById('station-list-ul');
    if (!ul) return;
    
    ul.innerHTML = '';
    WebDiaState.stations.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s.name;
        li.dataset.id = s.id;
        li.addEventListener('click', () => {
            // Option to edit station
            const newName = prompt("駅名を変更しますか？", s.name);
            if(newName) {
                s.name = newName;
                updateStationList();
                renderDiagram();
                saveToLocalStorage();
            }
        });
        ul.appendChild(li);
    });
}
