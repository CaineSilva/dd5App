import axios from "axios";
import React from "react"

export const GENERIC_TYPE = "Tout type";
export const GENERIC_SUBTYPE = "Tout sous type";
export const Types = {
    TEXT: "text",
    SELECT: "select",
    NUMBER: "number",
    CHECKBOX: "checkbox",
    DICE: "dice",
    TEXT_AREA: "textarea",
    A_R_COMPONENT: "A/R component",
    DAMAGE_COMPONENT: "Damage component"
};
export const AttributesNameMap = {
    "Force": "Force",
    "Dextérité": "Dexterity",
    "Constitution": "Constitution",
    "Intelligence": "Intelligence",
    "Sagesse": "Wisdom",
    "Charisme": "Charisma"
}
export const Skills = ["Acrobaties", "Arcanes", "Athlétisme", "Discrétion", "Dressage", "Escamotage", "Histoire", "Intimidation", "Investigation", "Médecine", "Nature", "Perception", "Perspicacité", "Persuasion", "Religion", "Représentation", "Survie", "Tromperie"];


export const DEFAULT_NPC = () => ({
    Name: "",
    Size: "M",
    Keywords: "",
    Alignment: "Tout Alignement",
    ArmorClass: 12,
    ArmorType: "",
    Health: 200,
    HealthDieNumber: 0,
    HealthDieType: 8,
    HealthDieModifier: 0,
    Speeds: "",
    Attributes: Object.assign([...Object.values(AttributesNameMap)].reduce((acc, current) => ({...acc, [current]: 10}), {}), {}),
    AttributeModifiers: [...Object.values(AttributesNameMap)].reduce((acc, current) => ({...acc, [current]: 0}), {}),
    SaveRollModifiers: Object.assign([...Object.values(AttributesNameMap)].reduce((acc, current) => ({...acc, [current]: 0}), {}), {}),
    Skills: Object.assign([...Skills].reduce((acc, current) => ({...acc, [current]: 0}), {}), {}),
    DamageVulnerability: "",
    DamageResistance: "",
    DamageImmunity: "",
    ConditionImmunity: "",
    Senses: "",
    PassivePerception: 12,
    Languages: "",
    FP: "0",
    XP: 0,
    Traits: [],
    Actions: [],
    Reactions: [],
    LegendaryActions: [],
    Spells: [], 
    description: "",
    DescriptionLines: [],
    Images: []    
});

export const Sizes = ["TP", "P", "M", "G", "TG", "Gig"];
export const Alignemnts = ["Loyal Bon", "Chaotique Bon", "Neutre Bon", "Loyal Neutre", "Chaotique Neutre", "Neutre", "Loyal Mauvais", "Chaotique Mauvais", "Neutre Mauvais", "Tout Alignement", "Tout Alignement Chaotique", "Tout Alignement Mauvais", "Tout Alignement Non Bon", "Tout Alignement Non Loyal", "Sans Alignement", "Chaotique Bon (75 %) Ou Neutre Mauvais (25 %)", "Neutre Bon (50 %) Ou Neutre Mauvais (50 %)"];
export const DieTypes = [4, 6, 8, 10, 12, 20];
export const AttributesDisplayNames = ["Force", "Dextérité", "Constitution", "Intelligence", "Sagesse", "Charisme"];
export const AttackTypes = ["Attaque au corps à corps avec une arme", "Attaque à distance avec une arme", "Attaque au corps à corps ou à distance avec une arme", "Attaque au corps à corps avec un sort", "Attaque à distance avec un sort"];
export const FP2XP = {"0": 0, "1/8": 25,"1/4": 50, "1/2": 100, "1": 200, "2": 450, "3": 700, "4": 1100, "5": 1800, "6": 2300, "7": 2900, "8": 3900, "9": 5000, "10": 5900, "11": 7200, "12": 8400, "13": 10000, "14": 11500, "15": 13000, "16": 15000, "17": 18000, "18": 20000, "19": 22000, "20": 25000, "21": 33000, "22": 41000, "23": 50000, "24": 62000, "25": 75000, "26": 90000, "27": 105000, "28": 120000, "29": 135000, "30": 155000};  
export const FP = [...Object.entries(FP2XP).sort(([fp1, xp1], [fp2, xp2]) => xp1-xp2).map(([fp, xp]) => fp)];
export const EmptyTrait = {
    Name: "",
    Description: "",
    showDetails: true
}
export const EmptyAction = {
    Name: "",
    Description: "",
    showDetails: true,
    IsAttack: false,
}
export const EmptyLegendaryAction = {
    Name: "",
    Description: "",
    showDetails: true,
    IsAttack: false,
}
export const EmptySpell = {
    Name: "",
    Description: "",
    showDetails: true,
    IsAttack: false,
}
export const EmptyReaction = {
    Name: "",
    Description: "",
    showDetails: true
}
export const EmptyAttackDetails = {
    Type: AttackTypes[0],
    AttackRollBonus: 0,
    Target: "",
    Reach: "",
    Damages: []
}
export const EmptyDamage = {
    DieNumber: 0,
    DieType: 6,
    DieBonus: 0,
    MeanDamage: 0,
    DamageType: ""
}

export const ComponentFactory = (className, keyText, valueBinder, valueSetter, type, argObj) => {
    switch (type) {
        case Types.TEXT:{
            return <div className={className}>
                <div className={className + "-key"}>
                    {keyText}
                </div>
                <input 
                    className={className + "-value"} 
                    type={type} 
                    value={valueBinder} 
                    onChange={ (e) => valueSetter(e.target.value) }
                />
            </div>
        }
        case Types.CHECKBOX:{
            return <div className={className + " checkbox"}>
                <div className={className + "-key"}>
                    {keyText}
                </div>
                <input 
                    className={className + "-value-input-checkox"} 
                    type={type} 
                    checked={valueBinder} 
                    onChange={ (e) => valueSetter(e.target.checked) }
                />
            </div>
        }
        case Types.NUMBER:{
            return <div className={className}>
                <div className={className + "-key"}>
                    {keyText}
                </div>
                <input 
                    className={className + "-value"} 
                    type={type} 
                    value={valueBinder} 
                    onChange={ (e) => valueSetter(parseInt(e.target.value)) }
                    min={argObj.min?String(argObj.min): 0}
                    max={argObj.max?String(argObj.max): 999}
                    step={argObj.step?String(argObj.step): 1}
                />
            </div>
        }
        case Types.SELECT: {
            return <div className={className}>
                <div className={className + "-key"}>
                    {keyText}
                </div>
                <select 
                    className={className + "-value"} 
                    value={valueBinder} 
                    onChange={ (e) => valueSetter(e.target.value) }
                >
                    {argObj.options.map(
                        ( el ) => {
                            return <option key={el} value={el} className={className + "-option"}>
                                {el}
                            </option> 
                        }
                    )}
                </select>
            </div>
        }
        case Types.DICE: {
            return <div className={className}>
                <div className={className + "-key"}>
                    {keyText}
                </div>
                <div className={className + "-die-wrapper"}>
                    <input 
                        className={className + "-value"} 
                        type={Types.NUMBER} 
                        value={valueBinder.number} 
                        onChange={ (e) => valueSetter.number(parseInt(e.target.value)) }
                        min={argObj.number.min?String(argObj.number.min): 0}
                        max={argObj.number.max?String(argObj.number.max): 999}
                        step={argObj.number.step?String(argObj.number.step): 1}
                    />
                    <select 
                        className={className + "-value"} 
                        value={valueBinder.type} 
                        onChange={ (e) => valueSetter.type(parseInt(e.target.value)) }
                    >
                        {DieTypes.map(
                            ( el ) => {
                                return <option key={el} value={el} className={className + "-option"}>
                                    {"d" + String(el)}
                                </option> 
                            }
                        )}
                    </select>
                    <span>+</span>
                    <input 
                        className={className + "-value"} 
                        type={Types.NUMBER} 
                        value={valueBinder.modifier} 
                        onChange={ (e) => valueSetter.modifier(parseInt(e.target.value)) }
                        min={argObj.modifier.min?String(argObj.modifier.min): 0}
                        max={argObj.modifier.max?String(argObj.modifier.max): 999}
                        step={argObj.modifier.step?String(argObj.modifier.step): 1}
                    />
                </div>
            </div>
        }
        case Types.TEXT_AREA: {
            return <div className={className}>
                <div className={className + "-key"}>
                    {keyText}
                </div>
                <textarea
                    className={"textarea " + className + "-value"} 
                    value={valueBinder} 
                    onChange={ (e) => valueSetter(e.target.value) }
                    rows={12}
                />
            </div>
        }
        case Types.DAMAGE_COMPONENT: {
            return <>
                <div className={className + "-damage-header"}>
                    Dégâts
                </div>
                    {
                        valueBinder.map((_el, index) => {
                            return <React.Fragment key={index}>
                                <div className={className + "-wrapper-group"} key={"dice-" + index}>
                                    {ComponentFactory(className, "Dégats " + String(index + 1), {number: valueBinder[index].DieNumber, modifier: valueBinder[index].DieBonus, type: valueBinder[index].DieType}, {type: (val)=> valueSetter.update(val, argObj.index, index, "DieType"), modifier: (val)=> valueSetter.update(val, argObj.index, index, "DieBonus"), number: (val)=> valueSetter.update(val, argObj.index, index, "DieNumber")}, Types.DICE, {modifier: {min: -30, max: 30, step: 1}, number: {min: 0, max: 30, step: 1}})}
                                </div>
                                <div className={className + "-wrapper-group"} key={"type-" + index}>
                                    {ComponentFactory(className, "Type", valueBinder[index].DamageType, (val) => valueSetter.update(val, argObj.index, index, "DamageType"), Types.TEXT)}
                                </div>
                                <div className={className + "-wrapper-group"} key={"delete-" + index}>
                                    <input
                                        type="button"
                                        className="small-button"
                                        value={"Supprimer les dégâts " + String(index+1)}
                                        style={{placeSelf: "flex-end"}}
                                        onClick={(e)=>valueSetter.delete(index, argObj.index)}
                                    />
                                </div>
                            </React.Fragment>
                        })
                    }
                    <input
                        className="small-button"
                        type="button"
                        value={"Ajouter des dégâts"}
                        onClick={ (e) => valueSetter.add(Object.assign({}, EmptyDamage), argObj.index)}
                        style={{placeSelf:"center"}}
                    />
            </>
        }
        case Types.A_R_COMPONENT: {
            return <div className={className + "-wrapper"}>
                <div className={className + "-title"}>
                        {argObj.Title}
                </div>
                <div className={className + "-content"}>
                    {
                        valueBinder.map( (_object, i) => {
                            return <div key={i} className={className + "-single"}>
                                <div key={i + "-Name"} className={className + "-wrapper-group"}>
                                    {ComponentFactory(className, "Nom", valueBinder[i].Name, (val) => valueSetter.update(val, i, "Name"), Types.TEXT)}
                                </div>
                                {valueBinder[i].showDetails?<>
                                    {argObj.hasAttack?<>
                                        <div key={i + "-IsAttack"} className={className + "-wrapper-group"}>
                                            {ComponentFactory(className, "Est une attaque ?", valueBinder[i].IsAttack, (val) => valueSetter.updateIsAttack(val, i), Types.CHECKBOX)}
                                        </div>
                                        {
                                            valueBinder[i].IsAttack?<>
                                                <div key={i + "-AttackType"} className={className + "-wrapper-group"}>
                                                    {ComponentFactory(className, "Type d'attaque", valueBinder[i].AttackDetails.Type, (val) => valueSetter.updateAttackDetails(val, i, "Type"), Types.SELECT, {options: AttackTypes})}
                                                </div>
                                                <div key={i + "-AttackBonus"} className={className + "-wrapper-group"}>
                                                    {ComponentFactory(className, "Modificateur", valueBinder[i].AttackDetails.AttackRollBonus, (val) => valueSetter.updateAttackDetails(val, i, "AttackRollBonus"), Types.NUMBER, {min: -30, max: 30, step: 1})}
                                                </div>
                                                <div key={i + "-AttackReach"} className={className + "-wrapper-group"}>
                                                    {ComponentFactory(className, "Portée", valueBinder[i].AttackDetails.Reach, (val) => valueSetter.updateAttackDetails(val, i, "Reach"), Types.TEXT)}
                                                </div>
                                                <div key={i + "-AttackTarget"} className={className + "-wrapper-group"}>
                                                    {ComponentFactory(className, "Cible", valueBinder[i].AttackDetails.Target, (val) => valueSetter.updateAttackDetails(val, i, "Target"), Types.TEXT)}
                                                </div>
                                                {ComponentFactory(className, keyText, valueBinder[i].AttackDetails.Damages, {add: valueSetter.addDamage, delete: valueSetter.deleteDamage, update: valueSetter.updateDamage}, Types.DAMAGE_COMPONENT, {index: i})}
                                            </>:null
                                        }
                                        </>:null
                                    }
                                    <div key={i + "-Description"} className={className + "-wrapper-group"}>
                                        {ComponentFactory(className, "Description", valueBinder[i].Description, (val) => valueSetter.update(val, i, "Description"), Types.TEXT_AREA)}
                                    </div></>:null
                                }
                                <div key={i + "-Delete"} className={className + "-wrapper-group"}>
                                    <input 
                                        className="small-button"
                                        type="button"
                                        onClick={() => valueSetter.update(!valueBinder[i].showDetails, i, "showDetails")}
                                        value={valueBinder[i].showDetails?"Masquer la description":"Afficher la description"}
                                    />
                                    <input 
                                        className="small-button"
                                        type="button"
                                        onClick={() => valueSetter.delete(i)}
                                        value={"Supprimer " + argObj.determined + keyText}
                                    />
                                </div>
                            </ div>
                        })
                    }
                    <div className={className + "-wrapper-group"}>
                        <input
                            className="small-button"
                            type="button"
                            value={"Ajouter " + argObj.undetermined + keyText}
                            onClick={ (e) => valueSetter.add(Object.assign({}, Object.assign({}, argObj.emptyValue)))}
                        />
                    </div>
                </div>
            </div>
        }
        default: {
            console.log("Error generating KeyValueComponent : Invalid type " + type);
        }
    }
};

export const checkNPC = (npc) => {
    var mandatory = "";
        var warning = "";
        if (npc.Name === "") {
            mandatory += "Le nom ne peut pas être vide !\n";
        }
        if (npc.Keywords === "") {
            warning += "Vous n'avez pas précisé de mot-clé.";
        }
        if (npc.ArmorClass < 0 || npc.ArmorClass > 30 || isNaN(npc.ArmorClass)) {
            mandatory += "La classe d'armure est invalide (0 <= CA <= 30).\n";
        }
        if (npc.Health < 0 || isNaN(npc.Health)) {
            mandatory += "Les points de vies sont invalide (0 <= PV).\n";
        }
        if (npc.HealthDieNumber < 0 || isNaN(npc.HealthDieNumber)) {
            mandatory += "Le nombre de dés de vie doit être un nombre positif ou nul.\n";
        }
        if (isNaN(npc.HealthDieModifier)) {
            mandatory += "Le bonus de dés de vie doit être un nombre.\n";
        }
        if (npc.Speeds === "") {
            warning += "Vous n'avez pas préciser de vitesse.\n";
        }
        for (let [key, value] of Object.entries(npc.Attributes)){
            if (value < 0 || value > 30 || isNaN(value)) {
                mandatory += "La valeur de " + key + " est invalide (0 <= " + key.slice(0,3) + " <= 30).\n";
            }
        }
        for (let [key, value] of Object.entries(npc.SaveRollModifiers)){
            if (value < -30 || value > 30 || isNaN(value)) {
                mandatory += "La valeur de modificateur JS de " + key + " est invalide (-30 <= mod JS " + key.slice(0,3) + " <= 30).\n";
            }
        }
        for (let [key, value] of Object.entries(npc.Skills)){
            if (value < -30 || value > 30 || isNaN(value)) {
                mandatory += "La valeur de modificateur de " + key + " est invalide (-30 <= mod " + key + " <= 30).\n";
            }
        }
        if (isNaN(npc.XP) || npc.XP < 0) {
            mandatory += "La valeur xp est obligatoire et doit être positive.\n"
        }
        for (let index=0; index < npc.Traits.length; index++){
            if (npc.Traits[index].Name === ""){
                if (npc.Traits[index].Description === "") {
                    warning += "Le trait numéro " + String(index+1) + " n'a ni nom ni description.\n";

                } else {
                    mandatory += "Le trait numéro " + String(index+1) + " ne porte pas de nom. Celui-ci est obligatoire.\n";
                }
            } else if (npc.Traits[index].Description === "") {
                warning += "Le trait " + npc.Traits[index].Name + " n'a pas de description.\n";
            }
        }
        for (let index=0; index < npc.Actions.length; index++){
            if (npc.Actions[index].Name === ""){
                if (npc.Actions[index].Description === "" && !npc.Actions[index].IsAttack) {
                    warning += "L'action numéro " + String(index+1) + " n'a ni nom ni description.\n";

                } else {
                    mandatory += "L'action numéro " + String(index+1) + " ne porte pas de nom. Celui-ci est obligatoire.\n";
                }
            } else if (npc.Actions[index].Description === "" && !npc.Actions[index].IsAttack) {
                warning += "L'action " + npc.Actions[index].Name + " n'a pas de description et n'est pas une attaque.\n";
            }
        }
        for (let index=0; index < npc.Reactions.length; index++){
            if (npc.Reactions[index].Name === ""){
                if (npc.Reactions[index].Description === "") {
                    warning += "La réaction numéro " + String(index+1) + " n'a ni nom ni description.\n";
                } else {
                    mandatory += "La réaction numéro " + String(index+1) + " ne porte pas de nom. Celui-ci est obligatoire.\n";
                }
            } else if (npc.Reactions[index].Description === "") {
                warning += "La réaction " + npc.Reactions[index].Name + " n'a pas de description.\n";
            }
        }
        for (let index=0; index < npc.LegendaryActions.length; index++){
            if (npc.LegendaryActions[index].Name === ""){
                if (npc.LegendaryActions[index].Description === "" && !npc.LegendaryActions[index].IsAttack) {
                    warning += "L'action légendaire numéro " + String(index+1) + " n'a ni nom ni description.\n";

                } else {
                    mandatory += "L'action légendaire numéro " + String(index+1) + " ne porte pas de nom. Celui-ci est obligatoire.\n";
                }
            } else if (npc.LegendaryActions[index].Description === "" && !npc.LegendaryActions[index].IsAttack) {
                warning += "L'action légendaire " + npc.LegendaryActions[index].Name + " n'a pas de description et n'est pas une attaque.\n";
            }
        }
        return [mandatory, warning];
}

export const saveNPC = (url, npc) => {
    var [mandatory, warning] = checkNPC(npc);
        if (mandatory !== "") {
            alert("Le personnage n'est pas valide. Merci de corriger les points suivants : \n" + mandatory.slice(0,mandatory.length-1));
            return
        }
        var ok = true;
        if (warning !== "") {
            ok = window.confirm("Le personnage contient les avertissements suivants : \n" + warning + "Voulez-vous continuer malgré tout ?");
        }
        if (ok) {
            var sentNPC = Object.assign({}, npc);
            sentNPC.DesciptionLines = npc.description.split("\n");
            for (let index=0; index < sentNPC.Actions.length; index++) {
                if (sentNPC.Actions[index].IsAttack) {
                    for (let dindex=0; dindex<sentNPC.Actions[index].AttackDetails.Damages.length; dindex++) {
                        sentNPC.Actions[index].AttackDetails.Damages[dindex].MeanDamage = Math.floor(sentNPC.Actions[index].AttackDetails.Damages[dindex].DieNumber*(sentNPC.Actions[index].AttackDetails.Damages[dindex].DieType+1)/2 + sentNPC.Actions[index].AttackDetails.Damages[dindex].DieBonus)
                    }
                }
            }
            console.log(sentNPC);
            let axiosConfig = {
                headers: {
                    "Access-Control-Allow-Origin": "*", 
                }
            }
            axios.post(url, sentNPC, axiosConfig).then((response) => {
                window.alert("Génération réussi. La fiche de personnage se trouve dans le dossier \"out\" du répertoire du programme.");                
            }, (error) => {
                window.alert("Erreur lors de la génération. Regardez la console et le terminal de l'application pour plus d'information.")
                console.log(error);
            });
        }
}  