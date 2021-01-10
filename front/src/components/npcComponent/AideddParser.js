import axios from "axios";
import { GENERIC_TYPE, GENERIC_SUBTYPE, FP, DEFAULT_NPC, Alignemnts, AttributesDisplayNames, AttributesNameMap, EmptyAction, EmptyTrait, EmptyReaction, EmptyLegendaryAction, EmptyAttackDetails, AttackTypes } from "./NPCConstants";

const GET = "GET";
const NPC_URI = "/dnd-filters/monstres.php"
const NPC_SEARCH_URI = "/dnd/monstres.php?vf="
const P_TYPES = {
    TRAIT: "TRAIT",
    ACTION: "ACTION",
    REACTION: "REACTION",
    LEGENDARY_ACTION: "LEGENDARY_ACTION"
}

function getResponseFromAidedd(url, uri, method, params={}){
    let axiosConfig = {
        headers: {
            "Access-Control-Allow-Origin": "*", 
            "uri": uri,
            "method": method,
            ...params
        }
    }
    return axios.get(url, axiosConfig)
}

function escapeName(name) {
    var d = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    d = d.replace(/\W/g, "-");
    while (d.includes("--")) {
        d = d.replace("--", "-");
    }
    while (d.charAt(d.length-1) === "-") {
        d = d.substring(0, d.length-1);
    }
    return d
}

export function getNPCList(url, callBack) {
        getResponseFromAidedd(url, NPC_URI, GET ).then((response)=>{
            let template = document.createElement('template');
            template.innerHTML = response.data;
            let headers = [...template.content.querySelectorAll("thead th")].map((el) => el.innerText);
            let items = [...template.content.querySelectorAll("tbody tr")].map((row)=>{
                return [...row.querySelectorAll("td")].reduce((acc, el, index) => ({...acc, [headers[index]]: el.innerText}), {})
            });
            callBack(items);
        });
    }

export function getNPCType(npcObj) {
    let type = npcObj["Type "].split("(")[0].trim()
    return type.charAt(0).toUpperCase() + type.substring(1)
}

export function getNPCSubtype(npcObj) {
    let types = npcObj["Type "].split("(");
    if (types.length === 1) return "";
    let subtype = types[1].trim().substring(0, types[1].length-1);
    return subtype.charAt(0).toUpperCase() + subtype.substring(1)
}

export function hasNPCType(npcObj, type) {
    if (type===GENERIC_TYPE)return true;
    return getNPCType(npcObj)===type; 
}

export function hasNPCSubtype(npcObj, type) {
    if (type===GENERIC_SUBTYPE)return true;
    return getNPCSubtype(npcObj)===type; 
}

export function getNPCName(npcObj) {
    let name = npcObj["Créature "].trim()
    return name.charAt(0).toUpperCase() + name.substring(1)
}

export function getNPCFP(npcObj) {
    return npcObj["FP "].trim()
}

export function isFPValid(npcObj, min, max) {
    let fp = getNPCFP(npcObj);
    return FP.indexOf(min) <= FP.indexOf(fp) && FP.indexOf(max) >= FP.indexOf(fp);
}

function capitalize(s) {
    let r = ""
    let t = s.split(" ");
    for (var w of t) {
        r += w.charAt(0).toUpperCase() + w.substring(1) + " "
    }
    return r.substring(0, r.length-1)
}

function processWholeType(wholeType) {
    let Size = "";
    let error = false;
    let Alignment = "";
    let tmp = wholeType.split("de taille ");
    if (tmp.length === 1) {
        console.log("Size is undefined: wholeType=" + wholeType);
        error = true;
    } else {
        Size = tmp[1].split(",")[0];
    }
    tmp = wholeType.split(", ")
    if (tmp.length < 2) {
        console.log("Alignment is undefined: wholeType=" + wholeType);
        error = true;
    } else {
        Alignment = capitalize(tmp[tmp.length-1]);
        if (!Alignemnts.includes(Alignment)) {
            console.log("Missing alignment : " + Alignment)
            error = true;
        }
    }
    return [Size, wholeType.replace(Size===""?"":" de taille " + Size, "").replace(Alignment===""?"":", " + tmp[1], ""), Alignment, error];
}

function parseAttackFromDescription(description) {
    let error = true;
    let details = Object.assign({}, EmptyAttackDetails);
    let remains = description;
    details.Damages = [];
    let refine = description.split(":");
    if (AttackTypes.includes(refine[0].trim())) {
        details.Type = refine[0].trim();
        remains = remains.substring(refine[0].length + 1).trim();
        refine = remains.split("au toucher,");
        details.AttackRollBonus = parseInt(refine[0].trim());
        remains = remains.replace(refine[0] + "au toucher,", "").trim();
        refine = remains.split(",");
        details.Reach = refine[0].substring("allonge".length).trim();
        remains = remains.substring(refine[0].length + 1).trim();
        refine = remains.split(".");
        details.Target = refine[0].trim();
        remains = remains.substring(refine[0].length + 1).trim();
    } else {
        console.log("Unknwon attack type " + refine[0].trim());
        error = true;
    }
    return [details, remains, error]
}

function createARFromTitleDescription(title, description, currentType, npc) {
    let current = {};
    let error = false;
    description = description.trim();
    if (description.charAt(0) === ".") {
        description = description.substring(1).trim();
    }
    switch (currentType) {
        case P_TYPES.TRAIT:
            current = Object.assign({}, EmptyTrait);
            current.Name = title;
            current.Description = description;
            npc.Traits.push(current);
            break;
        case P_TYPES.ACTION:
            current = Object.assign({}, EmptyAction);
            current.Name = title;
            if (description.startsWith("Attaque")) {
                current.IsAttack = true;
                let [details, remains] = parseAttackFromDescription(description);
                current.AttackDetails = details;
                current.Description = remains;
            } else {
                current.Description = description
            }
            npc.Actions.push(current);
            break;
        case P_TYPES.REACTION:
            current = Object.assign({}, EmptyReaction);
            current.Name = title;
            current.Description = description;
            npc.Reactions.push(current);
            break;
        case P_TYPES.LEGENDARY_ACTION:
            current = Object.assign({}, EmptyLegendaryAction);
            current.Name = title;
            if (description.startsWith("Attaque")) {
                current.IsAttack = true;
                let [details, remains] = parseAttackFromDescription(description);
                current.AttackDetails = details;
                current.Description = remains;
            }
            else {
                current.Description = description
            }
            npc.LegendaryActions.push(current);
            break;
        default:
            console.log("PANIC: currentType has invalid value");
            error = true;
            break;
    }
    return error;
}

export function parseNPCFromName(url, NPCName, callBack) {
    getResponseFromAidedd(url, NPC_SEARCH_URI + escapeName(NPCName), GET).then((response) => {
        let error = false;
        let npc = Object.assign({}, DEFAULT_NPC());
        let missing = [];
        let template = document.createElement('template');
        template.innerHTML = response.data;
        let block = template.content.querySelector(".jaune");
        if (block === null) {
            alert("Impossible d'importer le pnj à l'adresse : " + NPC_SEARCH_URI + escapeName(NPCName));
            return
        }
        npc.Name = block.querySelector("h1").innerText;
        block = block.querySelector(".sansSerif");
        let [s, k, a, e] =  processWholeType(block.querySelector(".type em").innerText);
        error = error & e;
        npc.Alignment = a;
        npc.Keywords = k;
        npc.Size = s;
        let items = block.querySelectorAll(".red strong");
        for (let item of items) {
            switch (item.innerText.trim()) {
                case "Classe d'armure": {
                   let rawVal = item.nextSibling.data;
                   let refine = rawVal.split(' (');
                   if (refine.length >2) {
                       console.log("Unable to parse AC " + rawVal);
                       error = true;
                        
                   } else if (refine.length === 2) {
                       npc.ArmorClass = parseInt(refine[0].trim());
                       npc.ArmorType = refine[1].trim().substring(0, refine[1].trim().length-1);
                   } else {
                       npc.ArmorClass = parseInt(refine[0].trim());
                   }
                   break;
                }
                case "Points de vie": {
                    let rawVal = item.nextSibling.data;
                    let refine = rawVal.split(' (');
                    if (refine.length >2) {
                        console.log("Unable to parse Health " + rawVal);
                        error = true;
                         
                    } else if (refine.length === 2) {
                        npc.Health = parseInt(refine[0].trim());
                        refine = refine[1].trim().substring(0,refine[1].trim().length-1).split("d");
                        if (refine.length !==2) {
                            console.log("Unable to parse HealthDice " + refine)
                            error = true;
                        } else {
                            npc.HealthDieNumber = parseInt(refine[0]);
                            refine = refine[1].trim().split(" + ");
                            if (refine.length > 2) {
                                console.log('Unable to parse HealthDice bonus ' + refine);
                                error = true;
                            } else if (refine.length === 2) {
                                npc.HealthDieType = parseInt(refine[0].trim());
                                npc.HealthDieModifier = parseInt(refine[1].trim());
                            } else {
                                npc.HealthDieType = parseInt(refine[0].trim());
                            }
                        }
                    } else {
                        npc.Health = parseInt(refine[0].trim());
                    }
                    break;
                }
                case "Vitesse": {
                    npc.Speeds = item.nextSibling.data.trim();
                    break;
                }
                case "FOR": {
                    let rawVal = item.nextSibling.nextSibling.data;
                    let refine = rawVal.split("(");
                    if (refine.length !== 2) {
                        console.log("Unable to parse Force " + refine)
                        error = true;
                    } else {
                        npc.Attributes.Force = parseInt(refine[0].trim());
                        npc.AttributeModifiers.Force = parseInt(refine[1].trim().substring(0,refine[1].trim().length - 1));
                    }
                    break;
                }
                case "DEX": {
                    let rawVal = item.nextSibling.nextSibling.data;
                    let refine = rawVal.split("(");
                    if (refine.length !== 2) {
                        console.log("Unable to parse Dexterity " + refine)
                        error = true
                    } else {
                        npc.Attributes.Dexterity = parseInt(refine[0].trim());
                        npc.AttributeModifiers.Dexterity = parseInt(refine[1].trim().substring(0,refine[1].trim().length - 1));
                    }
                    break;
                }
                case "CON": {
                    let rawVal = item.nextSibling.nextSibling.data;
                    let refine = rawVal.split("(");
                    if (refine.length !== 2) {
                        console.log("Unable to parse Constitution " + refine);
                        error = true;
                    } else {
                        npc.Attributes.Constitution = parseInt(refine[0].trim());
                        npc.AttributeModifiers.Constitution = parseInt(refine[1].trim().substring(0,refine[1].trim().length - 1));
                    }
                    break;
                }
                case "INT": {
                    let rawVal = item.nextSibling.nextSibling.data;
                    let refine = rawVal.split("(");
                    if (refine.length !== 2) {
                        console.log("Unable to parse Intelligence " + refine)
                        error = true;
                    } else {
                        npc.Attributes.Intelligence = parseInt(refine[0].trim());
                        npc.AttributeModifiers.Intelligence = parseInt(refine[1].trim().substring(0,refine[1].trim().length - 1));
                    }
                    break;
                }
                case "SAG": {
                    let rawVal = item.nextSibling.nextSibling.data;
                    let refine = rawVal.split("(");
                    if (refine.length !== 2) {
                        console.log("Unable to parse Wisdom " + refine)
                        error = true;
                    } else {
                        npc.Attributes.Wisdom = parseInt(refine[0].trim());
                        npc.AttributeModifiers.Wisdom = parseInt(refine[1].trim().substring(0,refine[1].trim().length - 1));
                    }
                    break;
                }
                case "CHA": {
                    let rawVal = item.nextSibling.nextSibling.data;
                    let refine = rawVal.split("(");
                    if (refine.length !== 2) {
                        console.log("Unable to parse Charisma " + refine)
                        error = true;
                    } else {
                        npc.Attributes.Charisma = parseInt(refine[0].trim());
                        npc.AttributeModifiers.Charisma = parseInt(refine[1].trim().substring(0,refine[1].trim().length - 1));
                    }
                    break;
                }
                case "Jets de sauvegarde": {
                    let rawVal = item.nextSibling.data.trim();
                    let refine = rawVal.split(", ");
                    for (let unit of refine) {
                        let att = unit.trim().substring(0,3);
                        let value = parseInt(unit.trim().replace(att, ""));
                        let actualAtt = AttributesDisplayNames.reduce((acc, name) => name.substring(0,3)===att?AttributesNameMap[name]:acc, "");                    
                        if (actualAtt === "") {
                            console.log("Unable to parse SaveRollModifier " + att);
                            error = true;
                        } else {
                            npc.SaveRollModifiers[actualAtt] = value;
                        }
                    }
                    break;
                }
                case "Compétences": {
                    let rawVal = item.nextSibling.data.trim();
                    let refine = rawVal.split(",");
                    for (let unit of refine) {
                        let runit = unit.trim().split(' ');
                        if (runit.length < 2) {
                            console.log("Unable to parse skill " + runit);
                            error = true;
                        } else {
                            npc.Skills[runit[0].trim()] = parseInt(runit[1].trim());
                        }
                    }
                    break;
                }
                case "Résistances aux dégâts": {
                    npc.DamageResistance = item.nextSibling.data.trim();
                    break;
                }
                case "Vulnérabilités aux dégâts": {
                    npc.DamageVulnerability = item.nextSibling.data.trim();
                    break;
                }
                case "Immunités aux dégâts": {
                    npc.DamageImmunity = item.nextSibling.data.trim();
                    break;
                }
                case "Immunités aux conditions": {
                    npc.ConditionImmunity = item.nextSibling.data.trim();
                    break;
                }
                case "Sens": {
                    let rawVal = item.nextSibling.data.trim();
                    let refine = rawVal.split("Perception passive ");
                    if (refine.length === 1 && rawVal.includes("Perception passive ")) {
                        npc.PassivePerception = parseInt(refine[0].trim());
                    }
                    else if (refine.length === 1){
                        npc.Sense = rawVal;
                    } else if (refine.length === 2) {
                        npc.Senses = refine[0].trim().substring(0, refine[0].trim().length - 1).trim();
                        npc.PassivePerception = parseInt(refine[1].trim());
                    } else {
                        console.log("Unable to parse senses " + rawVal);
                        error = true;
                    }
                    break;
                }
                case "Langues":{
                    npc.Languages = item.nextSibling.data;
                    break;
                }
                case "Puissance": {
                    let rawVal = item.nextSibling.data.trim();
                    let refine = rawVal.split("(");
                    if (refine.length !== 2) {
                        console.log("Unable to parse FP and XP " + rawVal);
                        error = true;
                    } else {
                        npc.FP = refine[0].trim();
                        npc.XP = parseInt(refine[1].replace("PX)", "").trim());
                    }
                    break;
                }
                default:
                    console.log("Missing item case \"" + item.innerText + "\"");
                    missing.push(item);
                    error = true;
            }
        }
        let par = block.querySelector("p").previousSibling;
        let currentType = P_TYPES.TRAIT;
        let name = "";
        let description = "";
        do {
            par = par.nextSibling;
            switch (par.nodeName) {
                case "P":{
                    if (par.childNodes.length > 1) {
                        if (par.childNodes[0].nodeName === "STRONG") {
                            if (name !== "") {
                                let e = createARFromTitleDescription(name, description, currentType, npc);
                                error = error & e;
                                name = "";
                                description = "";
                            }
                            name = par.childNodes[0].innerText.trim();
                        }
                        for (let child of [...par.childNodes].slice(1)) {
                            switch (child.nodeName) {
                                case "EM":
                                    description += child.innerText.trim() + " ";
                                    break;
                                case "#text":
                                    description += child.data.trim() + " ";
                                    break;
                                case "A":
                                    description += child.innerText.trim() + " ";
                                    break
                                default:
                                    console.log("unknown child type " + child.nodeName);
                                    error = true;
                                    break;
                            }
                        }
                    } else {
                        switch (par.childNodes[0].nodeName) {
                            case "#text":
                                description += par.childNodes[0].data.trim() + " ";
                                break;
                            case "A":
                                description += par.childNodes[0].innerText.trim() + " ";
                                break
                            default:
                                console.log("unknown child type " + par.childNodes[0].nodeName);
                                error = true;
                                break;
                        }
                    }
                    break;
                }
                case "#text": {
                    description += "\n" + par.data + " ";
                    break;
                }
                case "DIV": {
                    let e = createARFromTitleDescription(name, description, currentType, npc);
                    error = error & e;
                    name = "";
                    description = "";
                    switch (par.innerText.trim()) {
                        case "ACTIONS":
                            currentType = P_TYPES.ACTION;
                            break;
                        case "ACTIONS LÉGENDAIRES":
                            currentType = P_TYPES.LEGENDARY_ACTION;
                            break;
                        case "REACTIONS":
                            currentType = P_TYPES.REACTION;
                            break;
                        default:
                            break;
                    }
                    break;
                }
                case "EM": {
                    description += par.innerText + " ";
                    break;
                }
                case "BR": {
                    description += " ";
                    break;
                }
                default:
                    console.log("Unknown node type when parsing traits, actions, reactions and legendary actions " + par.nodeName);
                    error = true;
                    break;
            }
        } while (par.nextSibling !== null)
        if (name !== "") {
            let e = createARFromTitleDescription(name, description, currentType, npc);
            error = error & e;
        }
        let image = template.content.querySelector(".picture img");
        if (image !== null){
            let src = image.attributes.getNamedItem("src")
            if (src !== "")npc.Images.push(src.nodeValue);
        }
        image = template.content.querySelector(".picture amp-img");
        if (image !== null){
            let src = image.attributes.getNamedItem("src")
            if (src !== "")npc.Images.push(src.nodeValue);
        }
        let descriptionText = template.content.querySelector(".description");
        if (descriptionText !== null)npc.description = descriptionText.innerText
        if (missing.length !== 0)console.log(missing);
        callBack(npc, error);
    })
}