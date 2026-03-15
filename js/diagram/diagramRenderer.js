function timeToX(time) {
    return time * 2;
}

function stationToY(index) {
    return index * 100;
}

function clearDiagram(svg) {
    while(svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
}

function drawTimeGrid(svg) {
    for (let t = 0; t < 1440; t += 60) {
        const x = timeToX(t);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x);
        line.setAttribute("x2", x);
        line.setAttribute("y1", 0);
        line.setAttribute("y2", 3000); // 描画領域の高さ
        line.setAttribute("stroke", "#eee");
        svg.appendChild(line);
        
        // 時刻ラベル
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x + 5);
        text.setAttribute("y", 20);
        text.setAttribute("fill", "#999");
        text.setAttribute("font-size", "12px");
        text.textContent = `${Math.floor(t/60)}:00`;
        svg.appendChild(text);
    }
}

function drawStations(svg, stations) {
    stations.forEach((s, i) => {
        const y = stationToY(i) + 50; // オフセットを追加
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", 0);
        line.setAttribute("x2", 3000);
        line.setAttribute("y1", y);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "#ccc");
        svg.appendChild(line);
        
        // 駅名ラベル
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", 10);
        text.setAttribute("y", y - 5);
        text.setAttribute("fill", "#666");
        text.setAttribute("font-size", "14px");
        text.textContent = s.name;
        svg.appendChild(text);
    });
}

function generateTrainPath(train, stations) {
    let points = [];
    train.timetable.forEach(stop => {
        const stationIndex = stations.findIndex(s => s.id === stop.stationId);
        if (stationIndex === -1) return;
        
        const time = stop.departure !== undefined && stop.departure !== null ? stop.departure : stop.arrival;
        if (time === undefined || time === null) return;
        
        points.push({
            x: timeToX(time),
            y: stationToY(stationIndex) + 50
        });
    });
    return points;
}

function drawTrain(svg, train, points) {
    if (points.length === 0) return;
    
    const path = points.map(p => `${p.x},${p.y}`).join(" ");
    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("points", path);
    polyline.setAttribute("stroke", train.type && WebDiaState.trainTypes.find(t=>t.id===train.type)?.color || "#333");
    polyline.setAttribute("stroke-width", train.type && WebDiaState.trainTypes.find(t=>t.id===train.type)?.lineWidth || 2);
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("data-train-id", train.id);
    polyline.classList.add("train-line");
    
    svg.appendChild(polyline);
}

function renderDiagram() {
    const svg = document.getElementById("diagram-svg");
    if (!svg) return;
    
    // update svg height based on station count
    const h = Math.max(3000, WebDiaState.stations.length * 100 + 200);
    svg.setAttribute("height", h);

    clearDiagram(svg);
    drawTimeGrid(svg);
    drawStations(svg, WebDiaState.stations);
    
    WebDiaState.trains.forEach(train => {
        const points = generateTrainPath(train, WebDiaState.stations);
        drawTrain(svg, train, points);
    });
}
