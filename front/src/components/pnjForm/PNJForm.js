import axios from "axios";
import { useEffect, useState } from "react"
import "./PNJForm.css"

function PNJForm() {
    const [config, setConfig] = useState(undefined);
    const [isEditor, setIsEditor] = useState(true);
    const [name, setName] = useState("");
    const [size, setSize] = useState("M");
    const [keywords, setKeywords] = useState("");
    const [alignment, setAlignment] = useState("Tout Alignement");
    const [armorClass, setArmorClass] = useState(12);
    const [armorType, setArmorType] = useState("armure naturelle");
    const [healthPoint, setHealthPoint] = useState(0);
    const [healthDiceNumber, setHealthDiceNumber] = useState(0);
    const [healthDiceType, setHealthDiceType] = useState(6);
    const [healthDiceBonus, setHealthDiceBonus] = useState(0);
    const [speed, setSpeed] = useState("");
    const [attributes, setAttributes] = useState({"Force": 10, "Dextérité": 10, "Constitution": 10, "Intelligence": 10, "Sagesse": 10, "Charisme": 10})
    const [attributesModifier, setAttributesModifier] = useState({"Force": 0, "Dextérité": 0, "Constitution": 0, "Intelligence": 0, "Sagesse": 0, "Charisme": 0})
    const [jsModifier, setjsModifier] = useState({"Force": 0, "Dextérité": 0, "Constitution": 0, "Intelligence": 0, "Sagesse": 0, "Charisme": 0})
    const [skills, setSkills] = useState({"Acrobaties": 0, "Arcanes": 0, "Athlétisme": 0, "Discrétion": 0, "Dressage": 0, "Escamotage": 0, "Histoire": 0, "Intimidation": 0, "Investigation": 0, "Médecine": 0, "Nature": 0, "Perception": 0, "Perspicacité": 0, "Persuasion": 0, "Religion": 0, "Représentation": 0, "Survie": 0, "Tromperie": 0});
    const [xp, setXP] = useState(0);
    const [fp, setFP] = useState("0");
    const [damageVulnerability, setDamageVulnerability] = useState("");
    const [damageResistance, setDamageResistance] = useState("");
    const [damageImmunity, setDamageImmunity] = useState("");
    const [conditionImmunity, setConditionImmunity] = useState("");
    const [senses, setSenses] = useState("");
    const [passivePerception, setPassivePerception] = useState(12);
    const [languages, setLanguages] = useState("commun");
    const [showingTrait, setShowingTrait] = useState(true);
    const [traits, setTraits] = useState([]);
    const [showingActions, setShowingActions] = useState(true);
    const [actions, setActions] = useState([]);
    const [showingReactions, setShowingReactions] = useState(true);
    const [reactions, setReactions] = useState([]);
    const [showingLegendaryActions, setShowingLegendaryActions] = useState(true);
    const [legendaryActions, setLegendaryActions] = useState([]);
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [spells, setSpells] = useState([]);
    const [selectedSpell, setSelectedSpell] = useState(DefaultSpellSelect);
    const [showingSpells, setShowingSpells] = useState(true);
    const [SpellList, setSpellList] = useState([]);

    useEffect(()=>{
        fetch("Config.json").then((r)=>r.json()).then((data)=>setConfig(data));
    }, []);
    useEffect(()=>{
        if (config !== undefined) {
            fetchSpellList();
        }
    }, [config])
    useEffect(()=>{
        let mod = {};
        for (var key of Object.keys(attributes)) {
            mod[key] = Math.floor((attributes[key]-10)/2);
        }
        setAttributesModifier(mod);
    }, [attributes])
    useEffect(()=>{
        setXP(FP[fp]);
    }, [fp]);

    const checkNPC = ()=>{
        var mandatory = "";
        var warning = "";
        if (name === "") {
            mandatory += "Le nom ne peut pas être vide !\n";
        }
        if (keywords === "") {
            warning += "Vous n'avez pas précisé de mot-clé.";
        }
        if (armorClass < 0 || armorClass > 30 || isNaN(armorClass)) {
            mandatory += "La classe d'armure est invalide (0 <= CA <= 30).\n";
            setArmorClass(12);
        }
        if (healthPoint < 0 || isNaN(healthPoint)) {
            mandatory += "Les points de vies sont invalide (0 <= PV).\n";
            setHealthPoint(0);
        }
        if (healthDiceNumber < 0) {
            mandatory += "Le nombre de dés de vie doit être positif ou nul.\n";
            setHealthDiceNumber(0);
        }
        if (isNaN(healthDiceNumber)) {
            setHealthDiceNumber(0);
        }
        if (isNaN(healthDiceBonus)) {
            setHealthDiceBonus(0);
        }
        if (speed === "") {
            warning += "Vous n'avez pas préciser de vitesse.\n";
        }
        for (let [key, value] of Object.entries(attributes)){
            if (value < 0 || value > 30 || isNaN(value)) {
                mandatory += "La valeur de " + key + " est invalide (0 <= " + key.slice(0,3) + " <= 30).\n";
                setAttributes((old)=>{
                    var a = Object.assign({}, old);
                    a[key] = 10;
                    return a;
                });
            }
        }
        for (let [key, value] of Object.entries(jsModifier)){
            if (value < -30 || value > 30) {
                mandatory += "La valeur de modificateur JS de " + key + " est invalide (-30 <= mod JS " + key.slice(0,3) + " <= 30).\n";
                setjsModifier((old)=>{
                    var a = Object.assign({}, old);
                    a[key] = 0;
                    return a;
                });
            }
            if (isNaN(value)){
                setjsModifier((old)=>{
                    var a = Object.assign({}, old);
                    a[key] = 0;
                    return a;
                });
            }
        }
        for (let [key, value] of Object.entries(skills)){
            if (value < -30 || value > 30) {
                mandatory += "La valeur de modificateur de " + key + " est invalide (-30 <= mod " + key + " <= 30).\n";
                setSkills((old)=>{
                    var a = Object.assign({}, old);
                    a[key] = 0;
                    return a;
                });
            }
            if (isNaN(value)){
                setSkills((old)=>{
                    var a = Object.assign({}, old);
                    a[key] = 0;
                    return a;
                });
            }
        }
        if (isNaN(xp) || xp < 0) {
            mandatory += "La valeur xp est obligatoire et doit être positive.\n"
            setXP(FP[fp]);
        }
        for (let index=0; index < traits.length; index++){
            if (traits[index].Name === ""){
                if (traits[index].Description === "") {
                    setTraits((old)=>{
                        return [...old].slice(0, index).concat([...old].slice(index+1,old.length));
                    });
                } else {
                    mandatory += "Le trait numéro " + String(index+1) + " ne porte pas de nom. Celui-ci est obligatoire.\n";
                }
            } else if (traits[index].Description === "") {
                warning += "Le trait " + traits[index].Name + " n'a pas de description.\n";
            }
        }
        for (let index=0; index < actions.length; index++){
            if (actions[index].Name === ""){
                if (actions[index].Description === "" && !actions[index].IsAttack) {
                    setActions((old)=>{
                        return [...old].slice(0, index).concat([...old].slice(index+1,old.length));
                    });
                } else {
                    mandatory += "L'action numéro " + String(index+1) + " ne porte pas de nom. Celui-ci est obligatoire.\n";
                }
            } else if (actions[index].Description === "" && !actions[index].IsAttack) {
                warning += "L'action " + actions[index].Name + " n'a pas de description et n'est pas une attaque.\n";
            }
        }
        for (let index=0; index < reactions.length; index++){
            if (reactions[index].Name === ""){
                if (reactions[index].Description === "") {
                    setReactions((old)=>{
                        return [...old].slice(0, index).concat([...old].slice(index+1,old.length));
                    });
                } else {
                    mandatory += "La réaction numéro " + String(index+1) + " ne porte pas de nom. Celui-ci est obligatoire.\n";
                }
            } else if (reactions[index].Description === "") {
                warning += "La réaction " + reactions[index].Name + " n'a pas de description.\n";
            }
        }
        for (let index=0; index < legendaryActions.length; index++){
            if (legendaryActions[index].Name === ""){
                if (legendaryActions[index].Description === "" && !legendaryActions[index].IsAttack) {
                    setLegendaryActions((old)=>{
                        return [...old].slice(0, index).concat([...old].slice(index+1,old.length));
                    });
                } else {
                    mandatory += "L'action légendaire numéro " + String(index+1) + " ne porte pas de nom. Celui-ci est obligatoire.\n";
                }
            } else if (legendaryActions[index].Description === "" && !legendaryActions[index].IsAttack) {
                warning += "L'action légendaire " + legendaryActions[index].Name + " n'a pas de description et n'est pas une attaque.\n";
            }
        }
        return [mandatory, warning];
    }
    const clearAll = ()=>{
        setIsEditor(true);
        setName("");
        setSize("M");
        setKeywords("");
        setAlignment("Tout Alignement");
        setArmorClass(12);
        setArmorType("armure naturelle");
        setHealthPoint(0);
        setHealthDiceNumber(0);
        setHealthDiceType(6);
        setHealthDiceBonus(0);
        setSpeed("");
        setAttributes({"Force": 10, "Dextérité": 10, "Constitution": 10, "Intelligence": 10, "Sagesse": 10, "Charisme": 10});
        setAttributesModifier({"Force": 0, "Dextérité": 0, "Constitution": 0, "Intelligence": 0, "Sagesse": 0, "Charisme": 0});
        setjsModifier({"Force": 0, "Dextérité": 0, "Constitution": 0, "Intelligence": 0, "Sagesse": 0, "Charisme": 0});
        setSkills({"Acrobaties": 0, "Arcanes": 0, "Athlétisme": 0, "Discrétion": 0, "Dressage": 0, "Escamotage": 0, "Histoire": 0, "Intimidation": 0, "Investigation": 0, "Médecine": 0, "Nature": 0, "Perception": 0, "Perspicacité": 0, "Persuasion": 0, "Religion": 0, "Représentation": 0, "Survie": 0, "Tromperie": 0});
        setXP(0);
        setFP("0");
        setDamageVulnerability("");
        setDamageResistance("");
        setDamageImmunity("");
        setConditionImmunity("");
        setSenses("");
        setPassivePerception(12);
        setLanguages("commun");
        setShowingTrait(true);
        setShowingActions(true);
        setTraits([]);
        setActions([]);
        setReactions([]);
        setShowingReactions(true);
        setShowingLegendaryActions(true);
        setLegendaryActions([]);
        setDescription("");
        setImages([]);
        setSpells([]);
        setSelectedSpell(DefaultSpellSelect)
    }  
    const createNewNPC = ()=>{
        setIsEditor(true);
        clearAll();
    }
    const saveNPC = ()=>{
        var [mandatory, warning] = checkNPC();
        if (mandatory !== "") {
            alert("Le personnage n'est pas valide. Merci de corriger les points suivants : \n" + mandatory.slice(0,mandatory.length-1));
            return
        }
        var ok = true;
        if (warning !== "") {
            ok = window.confirm("Le personnage contient les avertissements suivants : \n" + warning + "Voulez-vous continuer malgré tout ?");
        }
        if (ok) {
            var npc = {};
            npc.Name = name;
            npc.Size = size;
            npc.Keywords = keywords;
            npc.Alignment = alignment;
            npc.ArmorClass = armorClass;
            npc.Armortype = armorType;
            npc.HealthPoint = healthPoint;
            npc.HealthDiceNumber = healthDiceNumber;
            npc.HealthDiceBonus = healthDiceBonus;
            npc.Speeds = speed;
            npc.Attributes = {"Force": attributes.Force, "Dexterity": attributes.Dextérité, "Constitution": attributes.Constitution, "Intelligence": attributes.Intelligence, "Wisdom": attributes.Sagesse, "Charisma": attributes.Charisme};
            npc.AttributesModifiers = {"Force": attributesModifier.Force, "Dexterity": attributesModifier.Dextérité, "Constitution": attributesModifier.Constitution, "Intelligence": attributesModifier.Intelligence, "Wisdom": attributesModifier.Sagesse, "Charisma": attributesModifier.Charisme};
            npc.SaveRollModifier = {"Force": jsModifier.Force, "Dexterity": jsModifier.Dextérité, "Constitution": jsModifier.Constitution, "Intelligence": jsModifier.Intelligence, "Wisdom": jsModifier.Sagesse, "Charisma": jsModifier.Charisme};
            npc.Skills = skills;
            npc.XP = xp;
            npc.FP = fp;
            npc.DamageVulnerability = damageVulnerability;
            npc.DamageResistance = damageResistance;
            npc.DamageImmunity = damageImmunity;
            npc.ConditionImmunity = conditionImmunity;
            npc.Senses = senses;
            npc.PassivePerception = passivePerception;
            npc.Languages = languages;
            npc.Traits = traits;
            npc.Actions = actions;
            for (let index=0;index<npc.Actions.length;index++){
                if (npc.Actions[index].IsAttack){
                    for (let dindex=0; dindex < npc.Actions[index].AttackDetails.Damages.length; dindex++){
                        npc.Actions[index].AttackDetails.Damages[dindex].MeanDamage = Math.floor(npc.Actions[index].AttackDetails.Damages[dindex].DieNumber*(npc.Actions[index].AttackDetails.Damages[dindex].DieType+1)/2 + npc.Actions[index].AttackDetails.Damages[dindex].DieBonus);
                    }
                }
            }
            npc.Reactions = reactions;
            npc.LegendaryActions = legendaryActions;
            for (let index=0;index<npc.LegendaryActions.length;index++){
                if (npc.LegendaryActions[index].IsAttack){
                    for (let dindex=0; dindex < npc.LegendaryActions[index].AttackDetails.Damages.length; dindex++){
                        npc.LegendaryActions[index].AttackDetails.Damages[dindex].MeanDamage = Math.floor(npc.LegendaryActions[index].AttackDetails.Damages[dindex].DieNumber*(npc.LegendaryActions[index].AttackDetails.Damages[dindex].DieType+1)/2 + npc.LegendaryActions[index].AttackDetails.Damages[dindex].DieBonus);
                    }
                }
            }
            npc.DescriptionLines = description===""?[]:description.split("\n");
            npc.Images = images;
            let axiosConfig = {
                headers: {
                    "Access-Control-Allow-Origin": "*", 
                }
            }
            axios.post("http://localhost:" + String(config.backendPort) + config.npcRoute, npc, axiosConfig).then((response) => {
                if (window.confirm("Génération réussi. La fiche de personnage se trouve dans le dossier \"out\" du répertoire du programme. Voulez-vous réinitialiser la fiche de personnage ?")) {
                    clearAll();
                    // setIsEditor(false);
                }
            }, (error) => {
                window.alert("Erreur lors de la génération. Regardez la console et le terminal de l'application pour plus d'information.")
                console.log(error);
            });
        }
    }
    const getObjectFromSelectedSpell = ()=>{
        if (selectedSpell === DefaultSpellSelect){
            setSpells((old)=>{
                let a = [...old];
                return a.concat({"Name": "", "Description": ""});
            });
            return
        }
        let axiosConfig = {
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "uri": "/dnd/sorts.php?vf=" + formatSpellName(selectedSpell),
                "method": "GET",
            }
        }
        axios.get("http://localhost:" + config.backendPort + config.aideddRoute, axiosConfig).then((r)=>{
            var obj = {"Name": "", "Description": ""};
            var template = document.createElement('template');
            template.innerHTML = r.data;
            var block = template.content.querySelector(".bloc");
            obj.Name= block.querySelector(".entete h1").innerText;
            for (var ele of block.querySelectorAll(".entete div")) {
                obj.Description += ele.innerText + "\n";
            }
            obj.Description += "\n";
            var descNodes = block.querySelector(".description").childNodes;
            for (var el of descNodes) {
                if (el.nodeName === "#text"){
                    obj.Description += el.data;
                }
                else if (el.nodeName === "BR") {
                    obj.Description += "\n";
                }
                else if (el.nodeName === "STRONG") {
                   obj.Description += el.innerText;
                }
            }
            setSpells((old)=>{
                let a = [...old];
                return a.concat(Object.assign({}, obj));
            })
        })
    }
    const fetchSpellList=()=>{
        let axiosConfig = {
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "uri": "/regles/sorts",
                "method": "GET",
            }
        }
        axios.get("http://localhost:" + config.backendPort + config.aideddRoute, axiosConfig).then((r)=>{
            var template = document.createElement('template');
            template.innerHTML = r.data;
            var contents = template.content.querySelectorAll(".main .inner.typography.line .content-container.unit.size4of5.lastUnit a");
            var l = []
            for (var el of contents){
                if (el.href.includes("vf=")){
                    l.push(el.innerText)
                }
            }
            setSpellList([...l]);
        });
    }

    return <div className="root">
        <div className="content">
            <input className="button" type="button" value="Réinitialiser tous les champs" onClick={createNewNPC}/>
            {isEditor?
            <>
                <div className="sheetHeader">
                    <div className="headerFieldTitle">Nom du PNJ</div>
                    <input type="text" className="headerField" value={name} onChange={(e)=>setName(e.target.value)}/>
                </div>
                <div className="keywordFields">
                    <div className="keywordFieldTitle">Taille</div>
                    <select value={size} onChange={(e)=>setSize(e.target.value)}> 
                        {Sizes.map((el)=>{
                            return <option key={el} value={el}>{el}</option>
                        })}
                    </select>
                    <div className="keywordFieldTitle">Mots clés</div>
                    <input type="text" className="keywordField" value={keywords} onChange={(e)=>setKeywords(e.target.value)}/>
                    <div className="keywordFieldTitle">Alignement</div>
                    <select value={alignment} onChange={(e)=>setAlignment(e.target.value)}> 
                        {Aligments.map((el)=>{
                            return <option key={el} value={el}>{el}</option>
                        })}
                    </select>
                </div>
                <div className="mainSheet">
                    <div className="mainSheetLine">
                        <div className="mainSheetLineTitle">Classe d'armure</div>
                        <input type="number" min="0" max="30" className="mainSheetLineFieldNumber" value={armorClass} onChange={(e)=>setArmorClass(parseInt(e.target.value, 10))}/>
                        <div className="mainSheetLineTitle">Type d'armure</div>
                        <input type="text" className="mainSheetLineField" value={armorType} onChange={(e)=>setArmorType(e.target.value)}/>
                    </div>
                    <div className="mainSheetLine">
                        <div className="mainSheetLineTitle">Point de vie</div>
                        <input type="number" min="0" className="mainSheetLineFieldNumber" value={healthPoint} onChange={(e)=>setHealthPoint(parseInt(e.target.value, 10))}/>
                        <div className="mainSheetLineTitle">(</div>
                        <input type="number" min="0" className="mainSheetLineFieldNumber" value={healthDiceNumber} onChange={(e)=>setHealthDiceNumber(parseInt(e.target.value, 10))}/>
                        <div className="mainSheetLineTitle">d</div>
                        <select value={healthDiceType} onChange={(e)=>setHealthDiceType(e.target.value)}> 
                            {DiceTypes.map((el)=>{
                                return <option key={el} value={el}>{el}</option>
                            })}
                        </select>
                        <div className="mainSheetLineTitle">+</div>
                        <input type="number" className="mainSheetLineFieldNumber" value={healthDiceBonus} onChange={(e)=>setHealthDiceBonus(parseInt(e.target.value, 10))}/>
                        <div className="mainSheetLineTitle">)</div>
                    </div>
                    <div className="mainSheetLine">
                        <div className="mainSheetLineTitle">Vitesse</div>
                        <input type="text" className="mainSheetLineField" value={speed} onChange={(e)=>setSpeed(e.target.value)}/>
                    </div>
                </div>
                <table className="attributeTable">
                    <tbody>
                        <tr>
                            <th className="tableLineTitle"></th>
                            {Attributes.map((el)=>{
                                return <th key={el}>{el}</th>
                            })}
                        </tr>
                        <tr>
                            <th className="tableLineTitle">Score</th>
                            {Attributes.map((el)=>{
                                return <td key={el}>
                                    <input type="number" min={0} max={30} value={attributes[el]} onChange={(e)=>setAttributes((old)=>{
                                        let a = Object.assign({}, attributes);
                                        a[el] = parseInt(e.target.value, 10);
                                        return a;
                                    })}/>
                                </td>
                            })}
                        </tr>
                        <tr>
                            <th className="tableLineTitle">Modificateur</th>
                            {Attributes.map((el)=>{
                                return <td key={el}>{attributesModifier[el]>=0?"+" + String(attributesModifier[el]):attributesModifier[el]}</td>
                            })}
                        </tr>
                        <tr>
                            <th className="tableLineTitle">Modificateur JS</th>
                            {Attributes.map((el)=>{
                                return <td key={el}>
                                    <input type="number" min={-30} max={30} value={jsModifier[el]} onChange={(e)=>{
                                        setjsModifier((old)=>{
                                            let a = Object.assign({}, jsModifier);
                                            a[el] = parseInt(e.target.value, 10);
                                            return a;
                                        });
                                    }}/>
                                </td>
                            })}
                        </tr>
                    </tbody>
                </table>
                <table className="attributeTable">
                    <tbody>
                        {[...Array(6).keys()].map((i)=>{
                            return <tr key={i}>
                            {Skills.map((el, index)=>{
                                if (index%6===i){
                                    return <td key={el}>
                                        <div className="twoElementCell">
                                            <div>{el}</div>
                                            <input type="number" max="30" min="-30" value={skills[el]} onChange={(e)=>setSkills((old)=>{
                                                let a = Object.assign({}, skills);
                                                a[el] = parseInt(e.target.value, 10);
                                                return a;
                                            })}/>
                                        </div>
                                    </td>    
                                }
                                return undefined;
                            })}
                        </tr>
                        })}
                    </tbody>
                </table>
                <div className="mainSheet">
                    <div className="mainSheetLine">
                        <div className="mainSheetLineTitle">Vulnérabilité aux dégâts</div>
                        <input type="text" className="mainSheetLineField" value={damageVulnerability} onChange={(e)=>setDamageVulnerability(e.target.value)}/>
                    </div>
                    <div className="mainSheetLine">
                        <div className="mainSheetLineTitle">Résistance aux dégâts</div>
                        <input type="text" className="mainSheetLineField" value={damageResistance} onChange={(e)=>setDamageResistance(e.target.value)}/>
                    </div>
                    <div className="mainSheetLine">
                        <div className="mainSheetLineTitle">Immunité aux dégâts</div>
                        <input type="text" className="mainSheetLineField" value={damageImmunity} onChange={(e)=>setDamageImmunity(e.target.value)}/>
                    </div>
                    <div className="mainSheetLine">
                        <div className="mainSheetLineTitle">Immunité aux conditions</div>
                        <input type="text" className="mainSheetLineField" value={conditionImmunity} onChange={(e)=>setConditionImmunity(e.target.value)}/>
                    </div>
                    <div className="mainSheetLine">
                        <div className="mainSheetLineTitle">Sens</div>
                        <input type="text" className="mainSheetLineField" value={senses} onChange={(e)=>setSenses(e.target.value)}/>
                        <div className="mainSheetLineTitle">Perception passive</div>
                        <input type="number" min="0" max="30" className="mainSheetLineFieldNumber" value={passivePerception} onChange={(e)=>setPassivePerception(parseInt(e.target.value, 10))}/>
                    </div>
                    <div className="mainSheetLine">
                        <div className="mainSheetLineTitle">Langues</div>
                        <input type="text" className="mainSheetLineField" value={languages} onChange={(e)=>setLanguages(e.target.value)}/>
                    </div>
                    <div className="mainSheetLine">
                        <div className="mainSheetLineTitle">facteur de puissance</div>
                        <select value={fp} onChange={(e)=>setFP(e.target.value)}> 
                            {[...Object.keys(FP)].map((el)=>{
                                return <option key={el} value={el}>{el}</option>
                            })}
                        </select>
                        <div className="mainSheetLineTitle">XP</div>
                        <input type="number" min="0" max="200000" className="mainSheetLineFieldNumber" value={xp} onChange={(e)=>setXP(parseInt(e.target.value, 10))}/>
                    </div>
                </div>
                <div className="traitWrapper">
                        <div className="header">
                            <div className="headerTitle">Traits</div>
                            <div className="expandButton" onClick={(e)=>setShowingTrait(!showingTrait)}>{showingTrait?"-":"+"}</div>
                        </div>
                        {showingTrait?
                            <div className="traitContent">
                                {traits.map((el, index)=>{
                                    return <div className="singleTrait" key={index}>
                                                <div className="traitLine">
                                                    <div>Nom du trait</div>
                                                    <input type="text" value={el.Name} onChange={(e)=>setTraits((old)=>{
                                                        let a = [...traits];
                                                        a[index].Name = e.target.value;
                                                        return a;
                                                    })}/>
                                                </div>
                                                <div className="traitLine">
                                                    <div>Description</div>
                                                    <textarea value={el.Description} onChange={(e)=>setTraits((old)=>{
                                                        let a = [...traits];
                                                        a[index].Description = e.target.value;
                                                        return a;
                                                    })}/>
                                                </div>
                                                <input type="button" value="Supprimer le trait" className="deleteTrait" onClick={(e)=>setTraits((old)=>{
                                                    let a = [...traits.slice(0, index)].concat([...traits].slice(index+1,traits.length));
                                                    return a
                                                })}/>
                                    </div>
                                })}
                                <input type="button" className="addTrait" value="Ajouter un trait" onClick={(e)=>setTraits((old)=>{
                                    let a = [...old];
                                    return a.concat({Name: "", Description: ""});
                                })}/>
                            </div>:null 
                        }
                </div>
                <div className="traitWrapper">
                        <div className="header">
                            <div className="headerTitle">Actions</div>
                            <div className="expandButton" onClick={(e)=>setShowingActions(!showingActions)}>{showingActions?"-":"+"}</div>
                        </div>
                        {showingActions?
                            <div className="traitContent">
                                {actions.map((el, index)=>{
                                    return <div className="singleTrait" key={index}>
                                                <div className="traitLine">
                                                    <div>Nom de l'action</div>
                                                    <input type="text" value={el.Name} onChange={(e)=>setActions((old)=>{
                                                        let a = [...actions];
                                                        a[index].Name = e.target.value;
                                                        return a;
                                                    })}/>
                                                </div>
                                                <div className="traitLine">
                                                    <input type="checkbox" className="actionCheckbox" checked={el.IsAttack} onChange={(e)=>{setActions((old)=>{
                                                        let a = [...actions];
                                                        a[index].IsAttack = e.target.checked;
                                                        if (e.target.checked){
                                                            a[index].AttackDetails = {"Type": "Attaque avec une arme de mêlée", "AttackRollBonus": 0, "Reach": "", "Damages": [], "Target": ""};
                                                        }
                                                        return a;
                                                    })}}/>
                                                    <div>L'action est une attaque</div>
                                                </div>
                                                {actions[index].IsAttack?
                                                <>
                                                    <div className="traitLine">
                                                        <div>Type d'attaque</div>
                                                        <select className="attackTypeCombo" value={actions[index].AttackDetails.Type} onChange={(e)=>setActions((old)=>{
                                                            let a = [...actions];
                                                            a[index].AttackDetails.Type = e.target.value;
                                                            return a;
                                                        })}>
                                                            {AttackTypes.map((type)=>{
                                                                return <option key={type}>{type}</option>
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="traitLine">
                                                        <div>Bonus au jet d'attaque</div>
                                                        <input type="number" min="-30" max="30" className="attackBonus" value={actions[index].AttackDetails.AttackRollBonus} onChange={(e)=>{setActions((old)=>{
                                                            let a = [...actions];
                                                            a[index].AttackDetails.AttackRollBonus = parseInt(e.target.value, 10);
                                                            return a;
                                                        })}}/>
                                                    </div>
                                                    <div className="traitLine">
                                                        <div>Portée</div>
                                                        <input type="text" value={actions[index].AttackDetails.Reach} onChange={(e)=>{setActions((old)=>{
                                                            let a = [...actions];
                                                            a[index].AttackDetails.Reach = e.target.value;
                                                            return a;
                                                        })}}/>
                                                    </div>
                                                    <div className="traitLine">
                                                        <div>Cible</div>
                                                        <input type="text" value={actions[index].AttackDetails.Target} onChange={(e)=>{setActions((old)=>{
                                                            let a = [...actions];
                                                            a[index].AttackDetails.Target = e.target.value;
                                                            return a;
                                                        })}}/>
                                                    </div>
                                                    {actions[index].AttackDetails.Damages.map((d, dindex, dlist)=>{
                                                        return <div className="attackDamageLine">
                                                            <input type="number" className="damageNumber" value={d.DieNumber} onChange={(e)=>setActions((old)=>{
                                                                let a = [...actions];
                                                                dlist[dindex].DieNumber = parseInt(e.target.value, 10);
                                                                a[index].AttackDetails.Damages = dlist;
                                                                return a;
                                                            })}/>
                                                            <div>D</div>
                                                            <select value={d.DieType} onChange={(e)=>setActions((old)=>{
                                                                let a = [...actions];
                                                                dlist[dindex].DieType = parseInt(e.target.value, 10);
                                                                a[index].AttackDetails.Damages = dlist;
                                                                return a;
                                                            })}>
                                                                {DiceTypes.map((dice)=>{
                                                                    return <option key={dice} value={dice}>{dice}</option>
                                                                })}
                                                            </select>
                                                            <div>+</div>
                                                            <input type="number" className="damageNumber" value={d.DieBonus} onChange={(e)=>setActions((old)=>{
                                                                let a = [...actions];
                                                                dlist[dindex].DieBonus = parseInt(e.target.value, 10);
                                                                a[index].AttackDetails.Damages = dlist;
                                                                return a;
                                                            })}/>
                                                            <div>Type</div>
                                                            <input type="text" value={d.DamageType} onChange={(e)=>setActions((old)=>{
                                                                let a = [...actions];
                                                                dlist[dindex].DamageType = e.target.value;
                                                                a[index].AttackDetails.Damages = dlist;
                                                                return a;
                                                            })}/>
                                                            <input type="button" value="Supprimer" onClick={(e)=>setActions((old)=>{
                                                                var actionstmp = [...old];
                                                                var actiontmp = Object.assign({}, actionstmp[index]);
                                                                var detailstmp = Object.assign({}, actiontmp.AttackDetails);
                                                                var damagetmp = [...detailstmp.Damages];
                                                                damagetmp = [...damagetmp.slice(0, dindex)].concat([...damagetmp.slice(dindex+1, dlist.length)]);
                                                                detailstmp.Damages = damagetmp;
                                                                actiontmp.AttackDetails = detailstmp;
                                                                actionstmp[index] = actiontmp;
                                                                return actionstmp;
                                                            })}/>
                                                        </div>
                                                    })}
                                                    <input type="button" value="Ajouter des dégâts" onClick={(e)=>{setActions((old)=>{
                                                        var actionstmp = [...old];
                                                        var actiontmp = Object.assign({}, actionstmp[index]);
                                                        var detailstmp = Object.assign({}, actiontmp.AttackDetails);
                                                        var damagetmp = [...detailstmp.Damages];
                                                        damagetmp.push({"DieNumber": 0, "DieType": 6, "DieBonus": 0, "MeanDamage": 0, "DamageType": ""});
                                                        detailstmp.Damages = damagetmp;
                                                        actiontmp.AttackDetails = detailstmp;
                                                        actionstmp[index] = actiontmp;
                                                        return actionstmp;
                                                    })}}/>
                                                </>:null}
                                                <div className="traitLine">
                                                    <div>Description</div>
                                                    <textarea value={el.Description} onChange={(e)=>setActions((old)=>{
                                                        let a = [...actions];
                                                        a[index].Description = e.target.value;
                                                        return a;
                                                    })}/>
                                                </div>
                                                <input type="button" value="Supprimer l'action" className="deleteTrait" onClick={(e)=>setActions((old)=>{
                                                    let a = [...actions.slice(0, index)].concat([...actions].slice(index+1,actions.length));
                                                    return a
                                                })}/>
                                    </div>
                                })}
                                <input type="button" className="addTrait" value="Ajouter une action" onClick={(e)=>setActions((old)=>{
                                    let a = [...old];
                                    return a.concat({Name: "", Description: "", IsAttack: false});
                                })}/>
                            </div>:null 
                        }
                </div>
                <div className="traitWrapper">
                        <div className="header">
                            <div className="headerTitle">Réactions</div>
                            <div className="expandButton" onClick={(e)=>setShowingReactions(!showingReactions)}>{showingReactions?"-":"+"}</div>
                        </div>
                        {showingReactions?
                            <div className="traitContent">
                                {reactions.map((el, index)=>{
                                    return <div className="singleTrait" key={index}>
                                                <div className="traitLine">
                                                    <div>Nom de la réaction</div>
                                                    <input type="text" value={el.Name} onChange={(e)=>setReactions((old)=>{
                                                        let a = [...reactions];
                                                        a[index].Name = e.target.value;
                                                        return a;
                                                    })}/>
                                                </div>
                                                <div className="traitLine">
                                                    <div>Description</div>
                                                    <textarea value={el.Description} onChange={(e)=>setReactions((old)=>{
                                                        let a = [...reactions];
                                                        a[index].Description = e.target.value;
                                                        return a;
                                                    })}/>
                                                </div>
                                                <input type="button" value="Supprimer la réaction" className="deleteTrait" onClick={(e)=>setReactions((old)=>{
                                                    let a = [...reactions.slice(0, index)].concat([...reactions].slice(index+1,reactions.length));
                                                    return a
                                                })}/>
                                    </div>
                                })}
                                <input type="button" className="addTrait" value="Ajouter une réaction" onClick={(e)=>setReactions((old)=>{
                                    let a = [...old];
                                    return a.concat({Name: "", Description: ""});
                                })}/>
                            </div>:null 
                        }
                </div>
                <div className="traitWrapper">
                        <div className="header">
                            <div className="headerTitle">Actions légendaires</div>
                            <div className="expandButton" onClick={(e)=>setShowingLegendaryActions(!showingLegendaryActions)}>{showingLegendaryActions?"-":"+"}</div>
                        </div>
                        {showingLegendaryActions?
                            <div className="traitContent">
                                {legendaryActions.map((el, index)=>{
                                    return <div className="singleTrait" key={index}>
                                                <div className="traitLine">
                                                    <div>Nom de l'action légendaire</div>
                                                    <input type="text" value={el.Name} onChange={(e)=>setLegendaryActions((old)=>{
                                                        let a = [...legendaryActions];
                                                        a[index].Name = e.target.value;
                                                        return a;
                                                    })}/>
                                                </div>
                                                <div className="traitLine">
                                                    <input type="checkbox" className="actionCheckbox" checked={el.IsAttack} onChange={(e)=>{setLegendaryActions((old)=>{
                                                        let a = [...legendaryActions];
                                                        a[index].IsAttack = e.target.checked;
                                                        if (e.target.checked){
                                                            a[index].AttackDetails = {"Type": "Attaque avec une arme de mêlée", "AttackRollBonus": 0, "Reach": "", "Damages": [], "Target": ""};
                                                        }
                                                        return a;
                                                    })}}/>
                                                    <div>L'action légendaire est une attaque</div>
                                                </div>
                                                {legendaryActions[index].IsAttack?
                                                <>
                                                    <div className="traitLine">
                                                        <div>Type d'attaque</div>
                                                        <select className="attackTypeCombo" value={legendaryActions[index].AttackDetails.Type} onChange={(e)=>setLegendaryActions((old)=>{
                                                            let a = [...legendaryActions];
                                                            a[index].AttackDetails.Type = e.target.value;
                                                            return a;
                                                        })}>
                                                            {AttackTypes.map((type)=>{
                                                                return <option key={type}>{type}</option>
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="traitLine">
                                                        <div>Bonus au jet d'attaque</div>
                                                        <input type="number" min="-30" max="30" className="attackBonus" value={legendaryActions[index].AttackDetails.AttackRollBonus} onChange={(e)=>{setLegendaryActions((old)=>{
                                                            let a = [...legendaryActions];
                                                            a[index].AttackDetails.AttackRollBonus = parseInt(e.target.value, 10);
                                                            return a;
                                                        })}}/>
                                                    </div>
                                                    <div className="traitLine">
                                                        <div>Portée</div>
                                                        <input type="text" value={legendaryActions[index].AttackDetails.Reach} onChange={(e)=>{setLegendaryActions((old)=>{
                                                            let a = [...legendaryActions];
                                                            a[index].AttackDetails.Reach = e.target.value;
                                                            return a;
                                                        })}}/>
                                                    </div>
                                                    <div className="traitLine">
                                                        <div>Cible</div>
                                                        <input type="text" value={legendaryActions[index].AttackDetails.Target} onChange={(e)=>{setLegendaryActions((old)=>{
                                                            let a = [...legendaryActions];
                                                            a[index].AttackDetails.Target = e.target.value;
                                                            return a;
                                                        })}}/>
                                                    </div>
                                                    {legendaryActions[index].AttackDetails.Damages.map((d, dindex, dlist)=>{
                                                        return <div className="attackDamageLine">
                                                            <input type="number" className="damageNumber" value={d.DieNumber} onChange={(e)=>setLegendaryActions((old)=>{
                                                                let a = [...legendaryActions];
                                                                dlist[dindex].DieNumber = parseInt(e.target.value, 10);
                                                                a[index].AttackDetails.Damages = dlist;
                                                                return a;
                                                            })}/>
                                                            <div>D</div>
                                                            <select value={d.DieType} onChange={(e)=>setLegendaryActions((old)=>{
                                                                let a = [...legendaryActions];
                                                                dlist[dindex].DieType = parseInt(e.target.value, 10);
                                                                a[index].AttackDetails.Damages = dlist;
                                                                return a;
                                                            })}>
                                                                {DiceTypes.map((dice)=>{
                                                                    return <option key={dice} value={dice}>{dice}</option>
                                                                })}
                                                            </select>
                                                            <div>+</div>
                                                            <input type="number" className="damageNumber" value={d.DieBonus} onChange={(e)=>setLegendaryActions((old)=>{
                                                                let a = [...legendaryActions];
                                                                dlist[dindex].DieBonus = parseInt(e.target.value, 10);
                                                                a[index].AttackDetails.Damages = dlist;
                                                                return a;
                                                            })}/>
                                                            <div>Type</div>
                                                            <input type="text" value={d.DamageType} onChange={(e)=>setLegendaryActions((old)=>{
                                                                let a = [...legendaryActions];
                                                                dlist[dindex].DamageType = e.target.value;
                                                                a[index].AttackDetails.Damages = dlist;
                                                                return a;
                                                            })}/>
                                                            <input type="button" value="Supprimer" onClick={(e)=>setLegendaryActions((old)=>{
                                                                var actionstmp = [...old];
                                                                var actiontmp = Object.assign({}, actionstmp[index]);
                                                                var detailstmp = Object.assign({}, actiontmp.AttackDetails);
                                                                var damagetmp = [...detailstmp.Damages];
                                                                damagetmp = [...damagetmp.slice(0, dindex)].concat([...damagetmp.slice(dindex+1, dlist.length)]);
                                                                detailstmp.Damages = damagetmp;
                                                                actiontmp.AttackDetails = detailstmp;
                                                                actionstmp[index] = actiontmp;
                                                                return actionstmp;
                                                            })}/>
                                                        </div>
                                                    })}
                                                    <input type="button" value="Ajouter des dégâts" onClick={(e)=>{setLegendaryActions((old)=>{
                                                        var actionstmp = [...old];
                                                        var actiontmp = Object.assign({}, actionstmp[index]);
                                                        var detailstmp = Object.assign({}, actiontmp.AttackDetails);
                                                        var damagetmp = [...detailstmp.Damages];
                                                        damagetmp.push({"DieNumber": 0, "DieType": 6, "DieBonus": 0, "MeanDamage": 0, "DamageType": ""});
                                                        detailstmp.Damages = damagetmp;
                                                        actiontmp.AttackDetails = detailstmp;
                                                        actionstmp[index] = actiontmp;
                                                        return actionstmp;
                                                    })}}/>
                                                </>:null}
                                                <div className="traitLine">
                                                    <div>Description</div>
                                                    <textarea value={el.Description} onChange={(e)=>setLegendaryActions((old)=>{
                                                        let a = [...legendaryActions];
                                                        a[index].Description = e.target.value;
                                                        return a;
                                                    })}/>
                                                </div>
                                                <input type="button" value="Supprimer l'action légendaire" className="deleteTrait" onClick={(e)=>setLegendaryActions((old)=>{
                                                    let a = [...legendaryActions.slice(0, index)].concat([...legendaryActions].slice(index+1,legendaryActions.length));
                                                    return a
                                                })}/>
                                    </div>
                                })}
                                <input type="button" className="addTrait" value="Ajouter une action légendaire" onClick={(e)=>setLegendaryActions((old)=>{
                                    let a = [...old];
                                    return a.concat({Name: "", Description: "", IsAttack: false});
                                })}/>
                            </div>:null 
                        }
                </div>
                <div className="traitWrapper">
                        <div className="header">
                            <div className="headerTitle">Sorts</div>
                            <div className="expandButton" onClick={(e)=>setShowingSpells(!showingSpells)}>{showingSpells?"-":"+"}</div>
                        </div>
                        {showingSpells?
                            <div className="traitContent">
                                {spells.map((el, index)=>{
                                    return <div className="singleTrait" key={index}>
                                                <div className="traitLine">
                                                    <div>Nom du sort</div>
                                                    <input type="text" value={el.Name} onChange={(e)=>setSpells((old)=>{
                                                        let a = [...spells];
                                                        a[index].Name = e.target.value;
                                                        return a;
                                                    })}/>
                                                </div>
                                                <div className="traitLine">
                                                    <div>Description</div>
                                                    <textarea value={el.Description} onChange={(e)=>setSpells((old)=>{
                                                        let a = [...spells];
                                                        a[index].Description = e.target.value;
                                                        return a;
                                                    })}/>
                                                </div>
                                                <input type="button" value="Supprimer le sort" className="deleteTrait" onClick={(e)=>setSpells((old)=>{
                                                    let a = [...spells.slice(0, index)].concat([...spells].slice(index+1,spells.length));
                                                    return a
                                                })}/>
                                    </div>
                                })}
                                <select className="attackTypeCombo" value={selectedSpell} onChange={(e)=>setSelectedSpell(e.target.value)}>
                                    <option value={DefaultSpellSelect}>{DefaultSpellSelect}</option>
                                    {SpellList.map((el)=>{
                                        return <option key={el} value={el}>{el}</option>
                                    })}
                                </select>
                                <input type="button" className="addTrait" value="Ajouter un sort" onClick={(e)=>getObjectFromSelectedSpell()}/>
                            </div>:null 
                        }
                </div>
                <div className="blockquote">
                    <div>Description</div>
                    <textarea className="descriptionArea" value={description} onChange={(e)=>setDescription(e.target.value)}/>
                </div>
                {
                    images.map((el, index)=>{
                        return <>
                        <div className="mainLine">
                            <div>Url</div>
                            <input type="text" value={el} onChange={(e)=>setImages((old)=>{
                                let a = [...old];
                                a[index] = e.target.value;
                                return a;
                            })}/>
                        </div>
                        {el !== ""?<img src={el} alt="introuvable"/>:undefined}
                        <input type="button" className="button" value="Supprimer" onClick={()=>setImages((old)=>{
                            return [...old].slice(0,index).concat([...old].slice(index+1, old.length));
                        })}/>
                        </>
                    })
                }
                <input type="button" className="button" value="Ajouter une image" onClick={()=>setImages((old)=>{
                    let a = [...old];
                    a.push("");
                    return a
                })}/>
                <input type="button" className="button" value="Sauvegarder le pnj" onClick={()=>saveNPC}/>
            </>
        :null}
        </div>
    </div>
}

const Filters = {
    "Filtre1[]": ["b", "c", "s", "w", "p", "r", "k", "a"],
    "Filtre2[]": ["abjuration", "divination", "enchantement", "évocation", "illusion", "invocation", "nécromancie", "transmutation"],
    "nivMin": "0",
    "nivMax": "9",
    "source[]": "base",
    "filtrer": "FILTRER"
}
const Sizes = ["TP", "P", "M", "G", "TG", "Gig"];
const Aligments = ["Loyal Bon", "Chaotique Bon", "Neutre bon", "Loyal Neutre", "Chaotique Neutre", "Neutre", "Loyal Mauvais", "Chaotique Mauvais", "Neutre Mauvais", "Tout Alignement"];
const DiceTypes = [4, 6, 8, 10, 12, 20, 100];
const Attributes = ["Force", "Dextérité", "Constitution", "Intelligence", "Sagesse", "Charisme"];
const Skills = ["Acrobaties", "Arcanes", "Athlétisme", "Discrétion", "Dressage", "Escamotage", "Histoire", "Intimidation", "Investigation", "Médecine", "Nature", "Perception", "Perspicacité", "Persuasion", "Religion", "Représentation", "Survie", "Tromperie"];
const FP = {"0": 0, "1/8": 25,"1/4": 50, "1/2": 100, "1": 200, "2": 450, "3": 700, "4": 1100, "5": 1800, "6": 2300, "7": 2900, "8": 3900, "9": 5000, "10": 5900, "11": 7200, "12": 8400, "13": 10000, "14": 11500, "15": 13000, "16": 15000, "17": 18000, "18": 20000, "19": 22000, "20": 25000, "21": 33000, "22": 41000, "23": 50000, "24": 62000, "25": 75000, "26": 90000, "27": 105000, "28": 120000, "29": 135000, "30": 155000};  
const AttackTypes = ["Attaque avec une arme de mêlée", "Attaque avec une arme à distance", "Attaque avec un sort"];
const DefaultSpellSelect = "Sort personnalisé";
const formatSpellName = (name)=>{
    var d = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return d.replace(/\W/g, "-");
}

export default PNJForm;