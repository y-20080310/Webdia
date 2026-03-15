document.addEventListener('DOMContentLoaded', () => {
    
    // load latest project if exists
    const projects = JSON.parse(localStorage.getItem('webdia_projects') || '[]');
    if (projects.length > 0) {
        // load latest
        const proj = projects[projects.length - 1];
        if (proj.data) {
            Object.assign(WebDiaState, proj.data);
        } else {
            initNewProject();
        }
    } else {
        initNewProject();
    }
    
    // Buttons setup
    document.getElementById('btn-new').addEventListener('click', () => {
        if (confirm("現在の内容を破棄して新規作成しますか？")) {
            initNewProject();
            WebDiaState.project.id = generateId("proj");
            saveToLocalStorage();
            updateStationList();
            renderDiagram();
        }
    });
    
    document.getElementById('btn-save').addEventListener('click', () => {
        saveWebDia();
    });
    
    document.getElementById('btn-open').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.webdia,.json,.oud,.oud2';
        input.onchange = (e) => {
            if (e.target.files.length > 0) {
                loadWebDiaFile(e.target.files[0]);
            }
        };
        input.click();
    });
    
    // Init Modules
    initStationEditor();
    initTrainEditor();
    initTimetableEditor();
    initDiagramEditor();
    
    // Initial UI State
    updateStationList();
    renderDiagram();
});
