function saveWebDia() {
    const data = JSON.stringify(WebDiaState, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${WebDiaState.project.name || "project"}.webdia`;
    a.click();
}

function saveToLocalStorage() {
    const projects = JSON.parse(localStorage.getItem('webdia_projects') || '[]');
    const existingIndex = projects.findIndex(p => p.id === WebDiaState.project.id);
    const projectData = {
        id: WebDiaState.project.id || generateId("proj"),
        name: WebDiaState.project.name,
        updated: new Date().toISOString(),
        data: WebDiaState
    };
    
    if (existingIndex >= 0) {
        projects[existingIndex] = projectData;
    } else {
        projects.push(projectData);
    }
    
    localStorage.setItem('webdia_projects', JSON.stringify(projects));
    console.log("Saved to LocalStorage");
}
