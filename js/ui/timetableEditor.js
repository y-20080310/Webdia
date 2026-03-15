let currentTimetableTrainId = null;

function initTimetableEditor() {
    document.getElementById('btn-save-timetable').addEventListener('click', () => {
        if (!currentTimetableTrainId) return;
        
        const train = WebDiaState.trains.find(t => t.id === currentTimetableTrainId);
        if (!train) return;
        
        const tbody = document.getElementById('timetable-tbody');
        const rows = tbody.querySelectorAll('tr');
        
        const newTimetable = [];
        rows.forEach(row => {
            const arr = row.querySelector('.time-arr').value;
            const dep = row.querySelector('.time-dep').value;
            const trk = row.querySelector('.track-sel').value;
            const pass = row.querySelector('.pass-chk').checked;
            const stId = row.dataset.stationId;
            
            // Only add to timetable if times are set, or passed
            if (arr || dep || pass) {
                newTimetable.push({
                    stationId: stId,
                    arrival: arr ? parseInt(arr) : null,
                    departure: dep ? parseInt(dep) : null,
                    track: trk || "1",
                    pass: pass
                });
            }
        });
        
        train.timetable = newTimetable;
        renderDiagram();
        saveToLocalStorage();
        alert("時刻表を保存しました");
    });
}

function openTimetableEditor(train) {
    document.getElementById('editor-timetable').style.display = 'block';
    currentTimetableTrainId = train.id;
    document.getElementById('timetable-title').textContent = `時刻表編集: ${train.number}`;
    
    const tbody = document.getElementById('timetable-tbody');
    tbody.innerHTML = '';
    
    // Let's list all stations for now (in order)
    WebDiaState.stations.forEach(st => {
        const stop = train.timetable.find(tt => tt.stationId === st.id) || {};
        
        const tr = document.createElement('tr');
        tr.dataset.stationId = st.id;
        
        let trackOptions = '';
        if (st.tracks && st.tracks.length > 0) {
            st.tracks.forEach(trk => {
                const sel = (stop.track === trk.short) ? "selected" : "";
                trackOptions += `<option value="${trk.short}" ${sel}>${trk.name}</option>`;
            });
        } else {
            trackOptions = `<option value="1">1番線</option>`;
        }
        
        tr.innerHTML = `
            <td>${st.name}</td>
            <td><input type="number" class="time-arr" style="width: 60px" value="${stop.arrival !== null && stop.arrival !== undefined ? stop.arrival : ''}"></td>
            <td><input type="number" class="time-dep" style="width: 60px" value="${stop.departure !== null && stop.departure !== undefined ? stop.departure : ''}"></td>
            <td><select class="track-sel">${trackOptions}</select></td>
            <td><input type="checkbox" class="pass-chk" ${stop.pass ? "checked" : ""}></td>
        `;
        tbody.appendChild(tr);
    });
}
