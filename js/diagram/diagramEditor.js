let isDragging = false;
let selectedTrain = null;
let dragStartX = 0;
let initialTimetable = null;

function initDiagramEditor() {
    const svg = document.getElementById("diagram-svg");
    if (!svg) return;
    
    // PC Events
    svg.addEventListener("mousedown", onDragStart);
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);

    // Touch Events
    svg.addEventListener("touchstart", onTouchStart, {passive: false});
    document.addEventListener("touchmove", onTouchMove, {passive: false});
    document.addEventListener("touchend", onTouchEnd);
}

function getTrainById(id) {
    return WebDiaState.trains.find(t => t.id === id);
}

// ======== Mouse handlers ========

function onDragStart(event) {
    const target = event.target;
    if (target && target.classList && target.classList.contains("train-line")) {
        const trainId = target.getAttribute("data-train-id");
        selectedTrain = getTrainById(trainId);
        
        if (selectedTrain) {
            isDragging = true;
            dragStartX = event.clientX;
            // deep copy to calculate deltas
            initialTimetable = JSON.parse(JSON.stringify(selectedTrain.timetable));
        }
    }
}

function onDragMove(event) {
    if (!isDragging || !selectedTrain || !initialTimetable) return;
    
    // Calculate deltaX
    const dx = event.clientX - dragStartX;
    const deltaMinutes = Math.round(dx / 2); // 1分 = 2px
    
    // update timeline temporarily
    selectedTrain.timetable.forEach((stop, index) => {
        const initStop = initialTimetable[index];
        if (initStop.departure !== undefined && initStop.departure !== null) {
            stop.departure = initStop.departure + deltaMinutes;
        }
        if (initStop.arrival !== undefined && initStop.arrival !== null) {
            stop.arrival = initStop.arrival + deltaMinutes;
        }
    });

    renderDiagram(); // performance note: you might want to wrap this in requestAnimationFrame
}

function onDragEnd(event) {
    if (isDragging) {
        isDragging = false;
        selectedTrain = null;
        initialTimetable = null;
        saveToLocalStorage();
    }
}

// ======== Touch handlers for mobile ========

let dragStartTouchX = 0;

function onTouchStart(event) {
    const target = event.target;
    if (target && target.classList && target.classList.contains("train-line") && event.touches.length === 1) {
        const trainId = target.getAttribute("data-train-id");
        selectedTrain = getTrainById(trainId);
        
        if (selectedTrain) {
            isDragging = true;
            dragStartTouchX = event.touches[0].clientX;
            // deep copy
            initialTimetable = JSON.parse(JSON.stringify(selectedTrain.timetable));
            event.preventDefault(); // prevent scrolling
        }
    }
}

function onTouchMove(event) {
    if (!isDragging || !selectedTrain || !initialTimetable || event.touches.length !== 1) return;
    
    const dx = event.touches[0].clientX - dragStartTouchX;
    const deltaMinutes = Math.round(dx / 2);
    
    selectedTrain.timetable.forEach((stop, index) => {
        const initStop = initialTimetable[index];
        if (initStop.departure !== undefined && initStop.departure !== null) {
            stop.departure = initStop.departure + deltaMinutes;
        }
        if (initStop.arrival !== undefined && initStop.arrival !== null) {
            stop.arrival = initStop.arrival + deltaMinutes;
        }
    });

    event.preventDefault(); // prevent scrolling
    renderDiagram();
}

function onTouchEnd(event) {
    if (isDragging) {
        isDragging = false;
        selectedTrain = null;
        initialTimetable = null;
        saveToLocalStorage();
    }
}
