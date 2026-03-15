function parseOud2(text) {
    const lines = text.split("\n");
    let stations = [];
    let trains = [];
    let currentStation = null;
    let currentTrain = null;

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith("Ekimei=")) {
            stations.push({
                id: generateId("ST"),
                name: line.split("=")[1],
                distance: 0,
                tracks: ["1"]
            });
        }
        // Very basic parsing just to show intent
    });

    return { stations, trains };
}
