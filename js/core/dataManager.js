const WebDiaState = {
  project: {
    name: "瀬田急行本線",
    created: "2026-03-15"
  },
  line: {
    name: "本線",
    downAlias: "下り",
    upAlias: "上り"
  },
  stations: [],
  trainTypes: [
    {
      id: "TYPE1",
      name: "普通",
      color: "#333333",
      lineStyle: "solid",
      lineWidth: 2
    }
  ],
  trains: []
};

// Utils
function generateId(prefix) {
  return prefix + '_' + Math.random().toString(36).substr(2, 9);
}
