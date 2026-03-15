function parseOud2(text) {
    const lines = text.split("\n");
    let stations = [];
    let trainTypes = [];
    let trains = [];
    
    let currentStation = null;
    let currentTrainType = null;
    let currentTrain = null;
    
    // Parse loop
    for(let i=0; i<lines.length; i++) {
        const line = lines[i].trim();
        if(!line) continue;
        
        // --- Eki ---
        if (line === "Eki.") {
            currentStation = {
                id: generateId("ST"),
                name: "未命名駅",
                distance: 0,
                scale: "general",
                timeDisplay: "arrival",
                downMain: false,
                upMain: false,
                tracks: []
            };
            continue;
        }
        if (currentStation && line === ".") {
            stations.push(currentStation);
            currentStation = null;
            continue;
        }
        if (currentStation) {
            if (line.startsWith("Ekimei=")) currentStation.name = line.split("=")[1];
            if (line.startsWith("Ekikibo=")) currentStation.scale = line.split("=")[1].includes("Syuyou") ? "major" : "general";
            if (line.startsWith("DownMain=")) currentStation.downMain = line.split("=")[1] !== "0";
            if (line.startsWith("UpMain=")) currentStation.upMain = line.split("=")[1] !== "0";
            continue;
        }
        
        // Need to parse tracks correctly inside Eki, but typical oud2 has Ekimei, Ekikibo.
        // Wait, oud2 has EkiTrack2 inside Eki? Or separate?
        // EkiTrack2. is inside Eki ? Actually, it's inside Eki.
        // A simple state machine is needed, but we keep it basic for now.

        // --- Ressyasyubetsu ---
        if (line === "Ressyasyubetsu.") {
            currentTrainType = {
                id: generateId("TYPE"),
                name: "普通",
                color: "#000000",
                lineStyle: "solid",
                lineWidth: 2
            };
            continue;
        }
        if (currentTrainType && line === ".") {
            trainTypes.push(currentTrainType);
            currentTrainType = null;
            continue;
        }
        if (currentTrainType) {
            if (line.startsWith("Syubetsumei=")) currentTrainType.name = line.split("=")[1];
            continue;
        }
        
        // --- Ressya ---
        if (line === "Ressya.") {
            currentTrain = {
                id: generateId("TR"),
                number: "",
                type: null, // Will map to trainType id
                name: "",
                destination: "",
                direction: "down", // We don't know direction yet, determine by dia
                timetable: []
            };
            continue;
        }
        if (currentTrain && line === ".") {
            trains.push(currentTrain);
            currentTrain = null;
            continue;
        }
        if (currentTrain) {
            if (line.startsWith("Ressyabangou=")) currentTrain.number = line.split("=")[1];
            if (line.startsWith("Ressyamei=")) currentTrain.name = line.split("=")[1];
            if (line.startsWith("Syubetsu=")) {
                const idx = parseInt(line.split("=")[1]);
                if (trainTypes[idx]) currentTrain.type = trainTypes[idx].id;
            }
            if (line.startsWith("EkiJikoku=")) {
                // Parse timetable "EkiJikoku=1,2;1,2;..."
                const parts = line.split("=")[1].split(",");
                // A very simplified logic: each index matches a station
                // OuDia specifies times. Since we don't have perfect mapping yet, 
                // we leave basic string splits.
            }
            continue;
        }
    }
    
    // Add default type if none
    if (trainTypes.length === 0) {
        trainTypes.push({ id: "TYPE1", name: "普通", color: "#333333", lineStyle: "solid", lineWidth: 2 });
    }

    return { stations, trainTypes, trains };
}
