function initNewProject() {
    WebDiaState.project = { name: "新規プロジェクト", created: new Date().toISOString().split('T')[0] };
    WebDiaState.line = { name: "新規路線", downAlias: "下り", upAlias: "上り" };
    WebDiaState.stations = [];
    WebDiaState.trainTypes = [
        { id: "TYPE1", name: "普通", color: "#333333", lineStyle: "solid", lineWidth: 2 }
    ];
    WebDiaState.trains = [];
    
    if (window.renderDiagram) window.renderDiagram();
    if (window.updateStationList) window.updateStationList();
}
