import "./NPCForm.css"
import "../../DD5App.css"
import { connect } from 'react-redux'
import React, { useEffect, useState } from "react"

import { setNPCAlignment, setNPCArmorClass, setNPCArmorType, setNPCKeywords, setNPCName, setNPCSize, setNPCHealth, makeAction, setNPCHealthDieModifier, setNPCHealthDieNumber, setNPCHealthDieType, setNPCSpeeds, setNPCAttribute, setNPCSaveRollModifier, setNPCDamageImmunity, setNPCDamageVulnerability, setNPCDamageResistance, setNPCConditionImmunity, setNPCPassivePerception, setNPCSenses, setNPCLanguages, setNPCFP, setNPCXP, addNPCTrait, updateNPCTrait, removeNPCTrait, addNPCReaction, updateNPCReaction, removeNPCReaction, addNPCAction, removeNPCAction, updateNPCAction, updateNPCActionAttackDetails, updateNPCLegendaryActionAttackDetails, updateNPCSpellAttackDetails, addNPCLegendaryAction, removeNPCLegendaryAction, updateNPCLegendaryAction, addNPCSpell, removeNPCSpell, updateNPCSpell, setNPCActionIsAttack, setNPCLegendaryActionIsAttack, setNPCSpellIsAttack, addNPCSpellDamage, addNPCActionDamage, addNPCLegendaryActionDamage, updateNPCSpellDamage, updateNPCActionDamage, updateNPCLegendaryActionDamage, removeNPCSpellDamage, removeNPCActionDamage, removeNPCLegendaryActionDamage, setNPCDescription, addNPCImage, removeNPCImage, updateNPCImage, setNPC } from "../../redux/actions"
import { getNPC, getNPCUrl, getAideddUrl } from "../../redux/selectors"
import { Alignemnts, EmptyTrait, EmptyReaction, FP, ComponentFactory, Sizes, Types, EmptyAction, EmptyLegendaryAction, saveNPC, DEFAULT_NPC, GENERIC_TYPE, GENERIC_SUBTYPE } from "./NPCConstants"
// import { EmptySpell } from "./NPCConstants"
import NPCAttributeTable from "./NPCAttributeTable"
import NPCSkillTable from "./NPCSkillTable"
import { getNPCList, getNPCName, getNPCSubtype, getNPCType, hasNPCSubtype, hasNPCType, isFPValid, parseNPCFromName } from "./AideddParser"

const NPCForm = ( { 
        npcURL,
        aideddURL,
        npc, 
        setNPC,
        setNPCName, 
        setNPCSize, 
        setNPCKeywords, 
        setNPCAlignment, 
        setNPCArmorClass, 
        setNPCArmorType, 
        setNPCHealth, 
        setNPCHealthDieModifier, 
        setNPCHealthDieNumber, 
        setNPCHealthDieType,
        setNPCSpeeds,
        setNPCDamageVulnerability,
        setNPCDamageResistance,
        setNPCDamageImmunity,
        setNPCConditionImmunity,
        setNPCSenses,
        setNPCPassivePerception,
        setNPCLanguages,
        setNPCFP,
        setNPCXP,
        addNPCTrait,
        updateNPCTrait,
        removeNPCTrait,
        addNPCReaction,
        updateNPCReaction,
        removeNPCReaction,
        addNPCAction,
        removeNPCAction,
        updateNPCAction,
        updateNPCActionAttackDetails,
        setNPCActionIsAttack,
        addNPCLegendaryAction,
        removeNPCLegendaryAction,
        updateNPCLegendaryAction,
        updateNPCLegendaryActionAttackDetails,
        setNPCLegendaryActionIsAttack,
        // addNPCSpell,
        // removeNPCSpell,
        // updateNPCSpell,
        // updateNPCSpellAttackDetails,
        // setNPCSpellIsAttack,
        // addNPCSpellDamage,
        addNPCActionDamage,
        addNPCLegendaryActionDamage,
        // updateNPCSpellDamage,
        updateNPCActionDamage,
        updateNPCLegendaryActionDamage,
        // removeNPCSpellDamage,
        removeNPCActionDamage,
        removeNPCLegendaryActionDamage,
        setNPCDescription,
        addNPCImage,
        removeNPCImage,
        updateNPCImage
    } ) => {    
    
    const [aideddNPCList, setAideddNPCList] = useState([]);
    const [selectedNPCType, setSelectedNPCType] = useState(GENERIC_TYPE);
    const [selectedNPCSubtype, setSelectedNPCSubtype] = useState(GENERIC_SUBTYPE);
    const [selectedNPC, setSelectedNPC] = useState("");
    const [selectedNPCFPMin, setSelectedFPMin] = useState(FP[0]);
    const [selectedNPCFPMax, setSelectedFPMax] = useState(FP[FP.length-1]);

    useEffect(() => getNPCList(aideddURL, setAideddNPCList), [aideddURL])

    const clearAll = () => {
        setNPC(Object.assign({}, DEFAULT_NPC()));
        setSelectedNPCType(GENERIC_TYPE);
        setSelectedNPCSubtype(GENERIC_SUBTYPE);
        setSelectedNPC("");
        setSelectedFPMin(FP[0]);
        setSelectedFPMax(FP[FP.length-1]);
    }
    const importNPC = () => {
        if (selectedNPC==="") {
            alert("Vous devez sélectionner un PNJ pour devoir l'importer.")
            return
        }
        parseNPCFromName(aideddURL, selectedNPC, (val, error) => {
            setNPC(val);
            if (error) {
                alert("Une erreur a été détectée à l'import. Vérifier la console pour plus de détails.")
            } else {
                alert("Import réussi sans erreur.")
            }
        });
    }

    // setTimeout(async () => {
    //     if (aideddNPCList !== []) {
    //         for (var myNPC of aideddNPCList) {
    //             console.log(getNPCName(myNPC));
    //             parseNPCFromName(aideddURL, getNPCName(myNPC), (val, error) => {if (error)alert("ERREUR")});
    //             await new Promise(r => setTimeout(r, 1000));
    //         }
    //     }
    // }, 2000)

    return <div className="npc-root">
        <div className="npc-root-content">
            {ComponentFactory("npc-header", "Nom du PNJ", npc.Name, setNPCName, "text")}
            <div className="npc-text-attribute-wrapper">
                <div className="npc-text-attribute-title">
                        Informations générales
                </div>
                <div className="npc-text-attribute-content">
                    <div className="npc-text-attribute-wrapper-group">
                        {ComponentFactory("npc-text-attribute", "Taille", npc.Size, setNPCSize, Types.SELECT, {options: Sizes})}
                        {ComponentFactory("npc-text-attribute", "Mots clés", npc.Keywords, setNPCKeywords, Types.TEXT)}
                        {ComponentFactory("npc-text-attribute", "Alignement", npc.Alignment, setNPCAlignment, Types.SELECT, {options: Alignemnts})}
                    </div>
                    <div className="npc-text-attribute-wrapper-group">
                        {ComponentFactory("npc-text-attribute", "Classe d'armure", npc.ArmorClass, setNPCArmorClass, Types.NUMBER, {min: 0, max: 30, step: 1})}
                        {ComponentFactory("npc-text-attribute", "Type d'armure", npc.ArmorType, setNPCArmorType, Types.TEXT)}
                        {ComponentFactory("npc-text-attribute", "Vitesse", npc.Speeds, setNPCSpeeds, Types.TEXT)}
                    </div>
                    <div className="npc-text-attribute-wrapper-group">
                        {ComponentFactory("npc-text-attribute", "Points de vie", npc.Health, setNPCHealth, Types.NUMBER, {min: 0, max: 10000, step: 1})}
                        {ComponentFactory("npc-text-attribute", "Dés de vie", {type: npc.HealthDieType, number: npc.HealthDieNumber, modifier: npc.HealthDieModifier}, {type: setNPCHealthDieType, number: setNPCHealthDieNumber, modifier: setNPCHealthDieModifier}, Types.DICE, {number: {min: 0}, modifier: {min: -100, max: 100}})}
                    </div>
                </div>
            </div>
            <NPCAttributeTable/>
            <NPCSkillTable/>
            <div className="npc-text-attribute-wrapper">
                <div className="npc-text-attribute-title">
                    Informations additionnelles
                </div>
                <div className="npc-text-attribute-content">
                    <div className="npc-text-attribute-wrapper-group">
                        {ComponentFactory("npc-text-attribute", "Vulnérabilités aux dégâts", npc.DamageVulnerability, setNPCDamageVulnerability, Types.TEXT)}
                        {ComponentFactory("npc-text-attribute", "Résistances aux dégâts", npc.DamageResistance, setNPCDamageResistance, Types.TEXT)}
                    </div>
                    <div className="npc-text-attribute-wrapper-group">
                        {ComponentFactory("npc-text-attribute", "Immunités aux dégâts", npc.DamageImmunity, setNPCDamageImmunity, Types.TEXT)}
                        {ComponentFactory("npc-text-attribute", "Immunités aux conditions", npc.ConditionImmunity, setNPCConditionImmunity, Types.TEXT)}

                    </div>
                    <div className="npc-text-attribute-wrapper-group">
                        {ComponentFactory("npc-text-attribute", "Sens", npc.Senses, setNPCSenses, Types.TEXT)}
                        {ComponentFactory("npc-text-attribute", "Perception passive", npc.PassivePerception, setNPCPassivePerception, Types.NUMBER, {min: 0, max: 30, step: 1})}
                        {ComponentFactory("npc-text-attribute", "Langages", npc.Languages, setNPCLanguages, Types.TEXT)}
                    </div>
                    <div className="npc-text-attribute-wrapper-group">
                        {ComponentFactory("npc-text-attribute", "FP", npc.FP, setNPCFP, Types.SELECT, {options: FP})}
                        {ComponentFactory("npc-text-attribute", "XP", npc.XP, setNPCXP, Types.NUMBER, {min: 0, max: 999999, step: 1})}
                    </div>
                </div>
            </div>
            {
                ComponentFactory("npc-a-r-component", "trait", npc.Traits, {add: addNPCTrait, delete: removeNPCTrait, update: updateNPCTrait}, Types.A_R_COMPONENT, {Title: "Traits", emptyValue: EmptyTrait, determined: "le ", undetermined: "un " })
            }
            {
                ComponentFactory("npc-a-r-component", "action", npc.Actions, {addDamage: addNPCActionDamage, deleteDamage: removeNPCActionDamage, updateDamage: updateNPCActionDamage, add: addNPCAction, delete: removeNPCAction, update: updateNPCAction, updateIsAttack: setNPCActionIsAttack, updateAttackDetails: updateNPCActionAttackDetails, }, Types.A_R_COMPONENT, {Title: "Actions", emptyValue: EmptyAction, hasAttack: true, determined: "l'", undetermined: "une " })
            }
            {
                ComponentFactory("npc-a-r-component", "réaction", npc.Reactions, {add: addNPCReaction, delete: removeNPCReaction, update: updateNPCReaction}, Types.A_R_COMPONENT, {Title: "Réactions", emptyValue: EmptyReaction, determined: "la ", undetermined: "une " })
            }
            {
                ComponentFactory("npc-a-r-component", "action légendaire", npc.LegendaryActions, {addDamage: addNPCLegendaryActionDamage, deleteDamage: removeNPCLegendaryActionDamage, updateDamage: updateNPCLegendaryActionDamage, add: addNPCLegendaryAction, delete: removeNPCLegendaryAction, update: updateNPCLegendaryAction, updateIsAttack: setNPCLegendaryActionIsAttack, updateAttackDetails: updateNPCLegendaryActionAttackDetails, }, Types.A_R_COMPONENT, {Title: "Actions Légendaires", emptyValue: EmptyLegendaryAction, hasAttack: true, determined: "l'", undetermined: "une " })
            }
            {
                // ComponentFactory("npc-a-r-component", "sort", npc.Spells, {addDamage: addNPCSpellDamage, deleteDamage: removeNPCSpellDamage, updateDamage: updateNPCSpellDamage, add: addNPCSpell, delete: removeNPCSpell, update: updateNPCSpell, updateIsAttack: setNPCSpellIsAttack, updateAttackDetails: updateNPCSpellAttackDetails, }, Types.A_R_COMPONENT, {Title: "Sorts", emptyValue: EmptySpell, hasAttack: true, determined: "le ", undetermined: "un " })
            }
            <div className="npc-text-attribute-description-wrapper">
                <div className="npc-text-attribute-title">
                    Description
                </div>
                <div className="npc-text-attribute-description-content">
                    {ComponentFactory("npc-text-attribute-description", "", npc.description, setNPCDescription, Types.TEXT_AREA, {})}
                </div>
            </div>
            <div className="npc-text-attribute-wrapper">
                <div className="npc-text-attribute-title">
                    Images
                </div>
                <div className="npc-text-attribute-content">
                    {
                        npc.Images.map((el, index) => {
                            return <React.Fragment key={index}>
                                <div className="npc-text-attribute-wrapper-group" key={index}>
                                    {ComponentFactory("npc-text-attribute", "URL", npc.Images[index], (val) => updateNPCImage(val, index), Types.TEXT)}
                                    <input
                                        type="button"
                                        className="small-button"
                                        value={ "Supprimer l'image " + String(index + 1)}
                                        onClick={(e) => removeNPCImage(index)}
                                        style={{placeSelf: "flex-end"}}
                                    />
                                </div>
                                {npc.Images[index] !== ""?
                                <img 
                                    src={npc.Images[index]} 
                                    alt="introuvable"
                                    className="imported-image"
                                />:null
                                }
                            </React.Fragment>
                        })
                    }
                    <input
                            type="button"
                            className="small-button"
                            value="Ajouter une image"
                            onClick={(e) => addNPCImage("")}
                        />
                </div>
            </div>
            <input 
                className="small-button"
                type="button" 
                value="Sauvegarder le PNJ"
                onClick={ (e) => saveNPC(npcURL, npc) }
            />
        </div>
        <div className="npc-root-side">
            <input 
                className="small-button"
                type="button"
                value="Réinitialiser tous les champs"
                id="side-button-import"
                onClick={clearAll}
            />
            <div className="npc-root-side-title">
                    Outils d'import
            </div>
            {
                aideddNPCList.length!==0?
                <React.Fragment >
                    {ComponentFactory("npc-root-side-wrapper", "Type de PNJ", selectedNPCType, setSelectedNPCType, Types.SELECT, {options: aideddNPCList.reduce((acc, el) => acc.includes(getNPCType(el))?acc:[...acc, getNPCType(el)], [GENERIC_TYPE])})}
                    {ComponentFactory("npc-root-side-wrapper", "Sous type de PNJ", selectedNPCSubtype, setSelectedNPCSubtype, Types.SELECT, {options: aideddNPCList.reduce((acc, el) => hasNPCType(el, selectedNPCType) && !acc.includes(getNPCSubtype(el)) && getNPCSubtype(el) !== ""?[...acc, getNPCSubtype(el)]:acc, [GENERIC_SUBTYPE])})}
                    {ComponentFactory("npc-root-side-wrapper", "FP minimum", selectedNPCFPMin, setSelectedFPMin, Types.SELECT, {options: FP})}
                    {ComponentFactory("npc-root-side-wrapper", "FP maximum", selectedNPCFPMax, setSelectedFPMax, Types.SELECT, {options: FP})}
                    {ComponentFactory("npc-root-side-wrapper", "PNJ", selectedNPC, setSelectedNPC, Types.SELECT, {options: aideddNPCList.reduce((acc, el) => hasNPCType(el, selectedNPCType) && hasNPCSubtype(el, selectedNPCSubtype) && isFPValid(el, selectedNPCFPMin, selectedNPCFPMax) && !acc.includes(getNPCName(el))?[...acc, getNPCName(el)]:acc, [""])})}
                    <input
                        type="button"
                        className="small-button"
                        value="Importer le PNJ"
                        onClick={importNPC}
                    />
                </React.Fragment>:null
            }
        </div>
    </div>
}

const getNPCState = (store) => {
    return {
        npc: getNPC(store),
        npcURL: getNPCUrl(store),
        aideddURL: getAideddUrl(store)
    }
}

const getNPCDispatch = (dispatch) => {
    return {
        setNPC: makeAction(dispatch, setNPC),
        setNPCName: makeAction(dispatch, setNPCName),
        setNPCSize: makeAction(dispatch, setNPCSize),
        setNPCKeywords: makeAction(dispatch, setNPCKeywords),
        setNPCAlignment: makeAction(dispatch, setNPCAlignment),
        setNPCArmorClass: makeAction(dispatch, setNPCArmorClass),
        setNPCArmorType: makeAction(dispatch, setNPCArmorType),
        setNPCHealth: makeAction(dispatch, setNPCHealth),
        setNPCHealthDieModifier: makeAction(dispatch, setNPCHealthDieModifier),
        setNPCHealthDieNumber: makeAction(dispatch, setNPCHealthDieNumber),
        setNPCHealthDieType: makeAction(dispatch, setNPCHealthDieType),
        setNPCSpeeds: makeAction(dispatch, setNPCSpeeds),
        setNPCAttribute: makeAction(dispatch, setNPCAttribute),
        setNPCSaveRollModifier: makeAction(dispatch, setNPCSaveRollModifier),
        setNPCDamageVulnerability: makeAction(dispatch, setNPCDamageVulnerability),
        setNPCDamageResistance: makeAction(dispatch, setNPCDamageResistance),
        setNPCDamageImmunity: makeAction(dispatch, setNPCDamageImmunity),
        setNPCConditionImmunity: makeAction(dispatch, setNPCConditionImmunity),
        setNPCSenses: makeAction(dispatch, setNPCSenses),
        setNPCPassivePerception: makeAction(dispatch, setNPCPassivePerception),
        setNPCLanguages: makeAction(dispatch, setNPCLanguages),
        setNPCFP: makeAction(dispatch, setNPCFP),
        setNPCXP: makeAction(dispatch, setNPCXP),
        addNPCTrait: makeAction(dispatch, addNPCTrait),
        updateNPCTrait: makeAction(dispatch, updateNPCTrait),
        removeNPCTrait: makeAction(dispatch, removeNPCTrait),
        addNPCReaction: makeAction(dispatch, addNPCReaction),
        updateNPCReaction: makeAction(dispatch, updateNPCReaction),
        removeNPCReaction: makeAction(dispatch, removeNPCReaction),
        addNPCAction: makeAction(dispatch, addNPCAction),
        removeNPCAction: makeAction(dispatch, removeNPCAction),
        updateNPCAction: makeAction(dispatch, updateNPCAction),
        updateNPCActionAttackDetails: makeAction(dispatch, updateNPCActionAttackDetails),
        setNPCActionIsAttack: makeAction(dispatch, setNPCActionIsAttack),
        addNPCLegendaryAction: makeAction(dispatch, addNPCLegendaryAction),
        removeNPCLegendaryAction: makeAction(dispatch, removeNPCLegendaryAction),
        updateNPCLegendaryAction: makeAction(dispatch, updateNPCLegendaryAction),
        updateNPCLegendaryActionAttackDetails: makeAction(dispatch, updateNPCLegendaryActionAttackDetails),
        setNPCLegendaryActionIsAttack: makeAction(dispatch, setNPCLegendaryActionIsAttack),
        addNPCSpell: makeAction(dispatch, addNPCSpell),
        removeNPCSpell: makeAction(dispatch, removeNPCSpell),
        updateNPCSpell: makeAction(dispatch, updateNPCSpell),
        updateNPCSpellAttackDetails: makeAction(dispatch, updateNPCSpellAttackDetails),
        setNPCSpellIsAttack: makeAction(dispatch, setNPCSpellIsAttack),
        addNPCSpellDamage: makeAction(dispatch, addNPCSpellDamage),
        addNPCActionDamage: makeAction(dispatch, addNPCActionDamage),
        addNPCLegendaryActionDamage: makeAction(dispatch, addNPCLegendaryActionDamage),
        updateNPCSpellDamage: makeAction(dispatch, updateNPCSpellDamage),
        updateNPCActionDamage: makeAction(dispatch, updateNPCActionDamage),
        updateNPCLegendaryActionDamage: makeAction(dispatch, updateNPCLegendaryActionDamage),
        removeNPCSpellDamage: makeAction(dispatch, removeNPCSpellDamage),
        removeNPCActionDamage: makeAction(dispatch, removeNPCActionDamage),
        removeNPCLegendaryActionDamage: makeAction(dispatch, removeNPCLegendaryActionDamage),
        setNPCDescription: makeAction(dispatch, setNPCDescription),
        addNPCImage: makeAction(dispatch, addNPCImage),
        removeNPCImage: makeAction(dispatch, removeNPCImage),
        updateNPCImage: makeAction(dispatch, updateNPCImage)
    }
}

export default connect(
    getNPCState, 
    getNPCDispatch
)(NPCForm); 