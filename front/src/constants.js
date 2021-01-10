export const DEFAULT_CONFIG = {
    "backendPort": 12349, 
    "npcRoute": "/npc", 
    "aideddRoute": "/aidedd",
    "version": "v2.0"
};

export const BACKEND_ADDRESS = "http://localhost";

export const CONFIG_FILE_NAME = "Config.json";

export const HandleError = (e) => console.log(e);

export const MODES = {
    HOME: "DD5App: La boîte à outil dd5 !",
    NPC: "Générateur Markdown de PNJ"
}