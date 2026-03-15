function loadWebDiaFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        
        if (file.name.endsWith('.oud') || file.name.endsWith('.oud2')) {
            const parsed = parseOud2(text);
            WebDiaState.stations = parsed.stations;
            WebDiaState.trains = parsed.trains;
        } else {
            loadWebDiaJson(text);
        }
        
        if (window.renderDiagram) window.renderDiagram();
        if (window.updateStationList) window.updateStationList();
    };
    reader.readAsText(file);
}

function loadWebDiaJson(text) {
    try {
        const json = JSON.parse(text);
        WebDiaState.project = json.project || WebDiaState.project;
        WebDiaState.line = json.line || WebDiaState.line;
        WebDiaState.stations = json.stations || [];
        WebDiaState.trainTypes = json.trainTypes || [];
        WebDiaState.trains = json.trains || [];
    } catch (e) {
        console.error("Failed to parse .webdia JSON", e);
    }
}
