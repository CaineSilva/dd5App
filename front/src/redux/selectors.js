import { BACKEND_ADDRESS } from "../constants";

export const getNPCUrl = (store) => {
    return BACKEND_ADDRESS + ":" + String(store.common.config.backendPort) + String(store.common.config.npcRoute)
};

export const getAideddUrl = (store) => {
    return BACKEND_ADDRESS + ":" + String(store.common.config.backendPort) + String(store.common.config.aideddRoute)
}

export const getVersion = (store) => {
    return store.common.config.version
}

export const getMode = (store) => {
    return store.common.mode
}

export const getNPC = (store) => {
    return store.npc
}