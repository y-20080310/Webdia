function initStationEditor() {
    document.getElementById('btn-add-station').addEventListener('click', () => {
        const name = prompt("駅名を入力してください", "新駅");
        if (name) {
            WebDiaState.stations.push({
                id: generateId("ST"),
                name: name,
                distance: 0,
                scale: "general",
                timeDisplay: "arrival",
                downMain: false,
                upMain: false,
                tracks: [{ name: "1番線", short: "1" }]
            });
            updateStationList();
            renderDiagram();
            saveToLocalStorage();
        }
    });

    document.getElementById('btn-save-station').addEventListener('click', () => {
        const id = document.getElementById('edit-station-id').value;
        const station = WebDiaState.stations.find(s => s.id === id);
        if (station) {
            station.name = document.getElementById('edit-station-name').value;
            station.scale = document.getElementById('edit-station-scale').value;
            station.downMain = document.getElementById('edit-station-downMain').checked;
            station.upMain = document.getElementById('edit-station-upMain').checked;
            
            // Collect tracks
            const trackLIs = document.querySelectorAll('#edit-station-tracks-list li');
            const newTracks = [];
            trackLIs.forEach(li => {
                const nameInput = li.querySelector('.track-name-input').value;
                const shortInput = li.querySelector('.track-short-input').value;
                newTracks.push({ name: nameInput, short: shortInput });
            });
            station.tracks = newTracks;

            updateStationList();
            renderDiagram();
            saveToLocalStorage();
            alert("駅情報を保存しました");
        }
    });

    document.getElementById('btn-add-track').addEventListener('click', () => {
        const tracksList = document.getElementById('edit-station-tracks-list');
        const li = document.createElement('li');
        li.innerHTML = `名: <input type="text" class="track-name-input" value="新番線"> 
                        短: <input type="text" class="track-short-input" value="新"> 
                        <button type="button" onclick="this.parentElement.remove()">削</button>`;
        tracksList.appendChild(li);
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
            openStationEditor(s);
        });
        ul.appendChild(li);
    });
}

function openStationEditor(station) {
    document.getElementById('editor-station').style.display = 'block';
    // hide others or not
    
    document.getElementById('edit-station-id').value = station.id;
    document.getElementById('edit-station-name').value = station.name || "";
    document.getElementById('edit-station-scale').value = station.scale || "general";
    document.getElementById('edit-station-downMain').checked = !!station.downMain;
    document.getElementById('edit-station-upMain').checked = !!station.upMain;
    
    const tracksList = document.getElementById('edit-station-tracks-list');
    tracksList.innerHTML = '';
    if (station.tracks) {
        station.tracks.forEach(t => {
            const li = document.createElement('li');
            li.innerHTML = `名: <input type="text" class="track-name-input" value="${t.name}"> 
                            短: <input type="text" class="track-short-input" value="${t.short}"> 
                            <button type="button" onclick="this.parentElement.remove()">削</button>`;
            tracksList.appendChild(li);
        });
    }
}
