import { ADD_NPC_ACTION, ADD_NPC_LENDENDARY_ACTION, ADD_NPC_REACTION, ADD_NPC_SPELL, ADD_NPC_TRAIT, REMOVE_NPC_ACTION, REMOVE_NPC_LENDENDARY_ACTION, REMOVE_NPC_REACTION, REMOVE_NPC_SPELL, REMOVE_NPC_TRAIT, SET_NPC_ACTION_IS_ATTACK, SET_NPC_ALIGNMENT, SET_NPC_ARMOR_CLASS, SET_NPC_ARMOR_TYPE, SET_NPC_ATTRIBUTE, SET_NPC_CONDITION_IMMUNITY, SET_NPC_DAMAGE_IMMUNITY, SET_NPC_DAMAGE_RESISTANCE, SET_NPC_DAMAGE_VULNERABILITY, SET_NPC_FP, SET_NPC_HEALTH, SET_NPC_HEALTH_DIE_MODIFIER, SET_NPC_HEALTH_DIE_NUMBER, SET_NPC_HEALTH_DIE_TYPE, SET_NPC_SAVE_ROLL_MODIFIER, SET_NPC_KEYWORDS, SET_NPC_LANGUAGES, SET_NPC_LEGENDARY_ACTION_IS_ATTACK, SET_NPC_NAME, SET_NPC_PASSIVE_PERCEPTION, SET_NPC_SENSES, SET_NPC_SIZE, SET_NPC_SPEEDS, SET_NPC_SPELL_IS_ATTACK, SET_NPC_XP, UPDATE_ACTION_ATTACK_DETAILS, UPDATE_LEGENDARY_ACTION_ATTACK_DETAILS, UPDATE_NPC_ACTION, UPDATE_NPC_LENDENDARY_ACTION, UPDATE_NPC_REACTION, UPDATE_NPC_SPELL, UPDATE_NPC_TRAIT, UPDATE_SPELL_ATTACK_DETAILS, SET_NPC_SKILL, UPDATE_SPELL_DAMAGE, UPDATE_ACTION_DAMAGE, UPDATE_LEGENDARY_ACTION_DAMAGE, ADD_SPELL_DAMAGE, ADD_ACTION_DAMAGE, ADD_LEGENDARY_ACTION_DAMAGE, REMOVE_SPELL_DAMAGE, REMOVE_ACTION_DAMAGE, REMOVE_LEGENDARY_ACTION_DAMAGE, SET_NPC_DESCRIPTION, ADD_NPC_IMAGE, REMOVE_NPC_IMAGE, UPDATE_NPC_IMAGE, SET_NPC } from "../actionTypes";
import { DEFAULT_NPC, EmptyAttackDetails, FP2XP } from "../../components/npcComponent/NPCConstants";

const initialState =  Object.assign({}, DEFAULT_NPC());

const npc = (old = initialState, action) => {
  switch (action.type) {
    case SET_NPC_NAME: {
      let s = Object.assign({}, old);
      s.Name = action.payload;
      return s
    }
    case SET_NPC_SIZE: {
      let s = Object.assign({}, old);
      s.Size = action.payload;
      return s
    }
    case SET_NPC_KEYWORDS: {
      let s = Object.assign({}, old);
      s.Keywords = action.payload;
      return s
    }
    case SET_NPC_ALIGNMENT: {
      let s = Object.assign({}, old);
      s.Alignment = action.payload;
      return s
    }
    case SET_NPC_ARMOR_CLASS: {
      let s = Object.assign({}, old);
      s.ArmorClass = action.payload;
      return s
    }
    case SET_NPC_ARMOR_TYPE: {
      let s = Object.assign({}, old);
      s.ArmorType = action.payload;
      return s
    }
    case SET_NPC_HEALTH: {
      let s = Object.assign({}, old);
      s.Health = action.payload;
      return s
    }
    case SET_NPC_HEALTH_DIE_MODIFIER: {
      let s = Object.assign({}, old);
      s.HealthDieModifier = action.payload;
      return s
    }
    case SET_NPC_HEALTH_DIE_NUMBER: {
      let s = Object.assign({}, old);
      s.HealthDieNumber = action.payload;
      return s
    }
    case SET_NPC_HEALTH_DIE_TYPE: {
      let s = Object.assign({}, old);
      s.HealthDieType = action.payload;
      return s
    }
    case SET_NPC_SPEEDS: {
      let s = Object.assign({}, old);
      s.Speeds = action.payload;
      return s
    }
    case SET_NPC_ATTRIBUTE: {
      let s = Object.assign({}, old);
      let a = Object.assign({}, s.Attributes);
      let am = Object.assign({}, s.AttributeModifiers);
      a[action.payload.id] = parseInt(action.payload.val);
      am[action.payload.id] = Math.floor((action.payload.val-10)/2);
      s.Attributes = a;
      s.AttributeModifiers = am;
      return s 
    }
    case SET_NPC_SKILL: {
      let s = Object.assign({}, old);
      let a = Object.assign({}, s.Skills);
      a[action.payload.id] = parseInt(action.payload.val);
      s.Skills = a;
      return s 
    }
    case SET_NPC_SAVE_ROLL_MODIFIER: {
      let s = Object.assign({}, old);
      let a = Object.assign({}, s.SaveRollModifiers);
      a[action.payload.id] = parseInt(action.payload.val);
      s.SaveRollModifiers = a;
      return s 
    }
    case SET_NPC_DAMAGE_VULNERABILITY: {
      let s = Object.assign({}, old);
      s.DamageVulnerability = action.payload;
      return s
    }
    case SET_NPC_DAMAGE_RESISTANCE: {
      let s = Object.assign({}, old);
      s.DamageResistance = action.payload;
      return s
    }
    case SET_NPC_DAMAGE_IMMUNITY: {
      let s = Object.assign({}, old);
      s.DamageImmunity = action.payload;
      return s
    }
    case SET_NPC_CONDITION_IMMUNITY: {
      let s = Object.assign({}, old);
      s.ConditionImmunity = action.payload;
      return s
    }
    case SET_NPC_SENSES: {
      let s = Object.assign({}, old);
      s.Senses = action.payload;
      return s
    }
    case SET_NPC_PASSIVE_PERCEPTION: {
      let s = Object.assign({}, old);
      s.PassivePerception = parseInt(action.payload);
      return s
    }
    case SET_NPC_LANGUAGES: {
      let s = Object.assign({}, old);
      s.Languages = action.payload;
      return s
    }
    case SET_NPC_FP: {
      let s = Object.assign({}, old);
      s.FP = action.payload;
      s.XP = FP2XP[action.payload];
      return s
    }
    case SET_NPC_XP: {
      let s = Object.assign({}, old);
      s.XP = action.payload;
      return s
    }
    case UPDATE_NPC_TRAIT: {
      let s = Object.assign({}, old);
      let a = [...s.Traits];
      let o = Object.assign({}, a[action.payload.index]);
      o[action.payload.field] = action.payload.val;
      a[action.payload.index] = o;
      s.Traits = a;
      return s 
    }
    case UPDATE_NPC_SPELL: {
      let s = Object.assign({}, old);
      let a = [...s.Spells];
      let o = Object.assign({}, a[action.payload.index]);
      o[action.payload.field] = action.payload.val;
      a[action.payload.index] = o;
      s.Spells = a;
      return s 
    }
    case UPDATE_NPC_ACTION: {
      let s = Object.assign({}, old);
      let a = [...s.Actions];
      let o = Object.assign({}, a[action.payload.index]);
      o[action.payload.field] = action.payload.val;
      a[action.payload.index] = o;
      s.Actions = a;
      return s 
    }
    case UPDATE_NPC_LENDENDARY_ACTION: {
      let s = Object.assign({}, old);
      let a = [...s.LegendaryActions];
      let o = Object.assign({}, a[action.payload.index]);
      o[action.payload.field] = action.payload.val;
      a[action.payload.index] = o;
      s.LegendaryActions = a;
      return s 
    }
    case UPDATE_NPC_REACTION: {
      let s = Object.assign({}, old);
      let a = [...s.Reactions];
      let o = Object.assign({}, a[action.payload.index]);
      o[action.payload.field] = action.payload.val;
      a[action.payload.index] = o;
      s.Reactions = a;
      return s 
    }
    case ADD_NPC_TRAIT: {
      let s = Object.assign({}, old);
      let a = [...s.Traits];
      a.push(action.payload)
      s.Traits = a;
      return s 
    }
    case ADD_NPC_ACTION: {
      let s = Object.assign({}, old);
      let a = [...s.Actions];
      a.push(action.payload)
      s.Actions = a;
      return s 
    }
    case ADD_NPC_REACTION: {
      let s = Object.assign({}, old);
      let a = [...s.Reactions];
      a.push(action.payload)
      s.Reactions = a;
      return s 
    }
    case ADD_NPC_LENDENDARY_ACTION: {
      let s = Object.assign({}, old);
      let a = [...s.LegendaryActions];
      a.push(action.payload)
      s.LegendaryActions = a;
      return s 
    }
    case ADD_NPC_SPELL: {
      let s = Object.assign({}, old);
      let a = [...s.Spells];
      a.push(action.payload)
      s.Spells = a;
      return s 
    }
    case REMOVE_NPC_TRAIT: {
      let s = Object.assign({}, old);
      let a = [...s.Traits];
      a.splice(action.payload, 1)
      s.Traits = a;
      return s 
    }
    case REMOVE_NPC_ACTION: {
      let s = Object.assign({}, old);
      let a = [...s.Actions];
      a.splice(action.payload, 1)
      s.Actions = a;
      return s 
    }
    case REMOVE_NPC_REACTION: {
      let s = Object.assign({}, old);
      let a = [...s.Reactions];
      a.splice(action.payload, 1)
      s.Reactions = a;
      return s 
    }
    case REMOVE_NPC_LENDENDARY_ACTION: {
      let s = Object.assign({}, old);
      let a = [...s.LegendaryActions];
      a.splice(action.payload)
      s.LegendaryActions = a;
      return s 
    }
    case REMOVE_NPC_SPELL: {
      let s = Object.assign({}, old);
      let a = [...s.Spells];
      a.splice(action.payload)
      s.Spells = a;
      return s 
    }
    case SET_NPC_SPELL_IS_ATTACK: {
      let s = Object.assign({}, old);
      let a = [...s.Spells];
      let o = Object.assign({}, a[action.payload.index]);
      o.IsAttack = action.payload.val;
      o.AttackDetails = Object.assign({}, EmptyAttackDetails);
      a[action.payload.index] = o;
      s.Spells = a;
      return s 
    }
    case SET_NPC_ACTION_IS_ATTACK: {
      let s = Object.assign({}, old);
      let a = [...s.Actions];
      let o = Object.assign({}, a[action.payload.index]);
      o.IsAttack = action.payload.val;
      o.AttackDetails = Object.assign({}, EmptyAttackDetails);
      a[action.payload.index] = o;
      s.Actions = a;
      return s 
    }
    case SET_NPC_LEGENDARY_ACTION_IS_ATTACK: {
      let s = Object.assign({}, old);
      let a = [...s.LegendaryActions];
      let o = Object.assign({}, a[action.payload.index]);
      o.IsAttack = action.payload.val;
      o.AttackDetails = Object.assign({}, EmptyAttackDetails);
      a[action.payload.index] = o;
      s.LegendaryActions = a;
      return s 
    }
    case UPDATE_ACTION_ATTACK_DETAILS: {
      let s = Object.assign({}, old);
      let a = [...s.Actions];
      let o = Object.assign({}, a[action.payload.index]);
      let d = Object.assign({}, o.AttackDetails)
      d[action.payload.field] = action.payload.val;
      o.AttackDetails = d;
      a[action.payload.index] = o;
      s.Actions = a;
      return s 
    }
    case UPDATE_LEGENDARY_ACTION_ATTACK_DETAILS: {
      let s = Object.assign({}, old);
      let a = [...s.LegendaryActions];
      let o = Object.assign({}, a[action.payload.index]);
      let d = Object.assign({}, o.AttackDetails)
      d[action.payload.field] = action.payload.val;
      o.AttackDetails = d;
      a[action.payload.index] = o;
      s.LegendaryActions = a;
      return s 
    }
    case UPDATE_SPELL_ATTACK_DETAILS: {
      let s = Object.assign({}, old);
      let a = [...s.Spells];
      let o = Object.assign({}, a[action.payload.index]);
      let d = Object.assign({}, o.AttackDetails)
      d[action.payload.field] = action.payload.val;
      o.AttackDetails = d;
      a[action.payload.index] = o;
      s.Spells = a;
      return s 
    }
    case UPDATE_SPELL_DAMAGE: {
      let s = Object.assign({}, old);
      let a = [...s.Spells];
      let o = Object.assign({}, a[action.payload.index]);
      let d = Object.assign({}, o.AttackDetails)
      let dl = [...d.Damages];
      let dd = Object.assign({}, dl[action.payload.damageIndex]);
      dd[action.payload.field] = action.payload.val;
      dl[action.payload.damageIndex] = dd;
      d.Damages = dl
      o.AttackDetails = d;
      a[action.payload.index] = o;
      s.Spells = a;
      return s 
    }
    case UPDATE_ACTION_DAMAGE: {
      let s = Object.assign({}, old);
      let a = [...s.Actions];
      let o = Object.assign({}, a[action.payload.index]);
      let d = Object.assign({}, o.AttackDetails)
      let dl = [...d.Damages];
      let dd = Object.assign({}, dl[action.payload.damageIndex]);
      dd[action.payload.field] = action.payload.val;
      dl[action.payload.damageIndex] = dd;
      d.Damages = dl
      o.AttackDetails = d;
      a[action.payload.index] = o;
      s.Actions = a;
      return s 
    }
    case UPDATE_LEGENDARY_ACTION_DAMAGE: {
      let s = Object.assign({}, old);
      let a = [...s.LegendaryActions];
      let o = Object.assign({}, a[action.payload.index]);
      let d = Object.assign({}, o.AttackDetails)
      let dl = [...d.Damages];
      let dd = Object.assign({}, dl[action.payload.damageIndex]);
      dd[action.payload.field] = action.payload.val;
      dl[action.payload.damageIndex] = dd;
      d.Damages = dl
      o.AttackDetails = d;
      a[action.payload.index] = o;
      s.LegendaryActions = a;
      return s 
    }
    case ADD_SPELL_DAMAGE: {
      let s = Object.assign({}, old);
      let a = [...s.Spells];
      let o = Object.assign({}, a[action.payload.index]);
      let d = Object.assign({}, o.AttackDetails)
      let dl = [...d.Damages];
      dl.push(action.payload.val)
      d.Damages = dl
      o.AttackDetails = d;
      a[action.payload.index] = o;
      s.Spells = a;
      return s 
    }
    case ADD_ACTION_DAMAGE: {
      let s = Object.assign({}, old);
      let a = [...s.Actions];
      let o = Object.assign({}, a[action.payload.index]);
      let d = Object.assign({}, o.AttackDetails)
      let dl = [...d.Damages];
      dl.push(action.payload.val)
      d.Damages = dl
      o.AttackDetails = d;
      a[action.payload.index] = o;
      s.Actions = a;
      return s 
    }
    case ADD_LEGENDARY_ACTION_DAMAGE: {
      let s = Object.assign({}, old);
      let a = [...s.LegendaryActions];
      let o = Object.assign({}, a[action.payload.index]);
      let d = Object.assign({}, o.AttackDetails)
      let dl = [...d.Damages];
      dl.push(action.payload.val)
      d.Damages = dl
      o.AttackDetails = d;
      a[action.payload.index] = o;
      s.LegendaryActions = a;
      return s 
    }
    case REMOVE_SPELL_DAMAGE: {
      let s = Object.assign({}, old);
      let a = [...s.Spells];
      let o = Object.assign({}, a[action.payload.index]);
      let d = Object.assign({}, o.AttackDetails)
      let dl = [...d.Damages];
      dl.splice(action.payload.val, 1)
      d.Damages = dl
      o.AttackDetails = d;
      a[action.payload.index] = o;
      s.Spells = a;
      return s 
    }
    case REMOVE_ACTION_DAMAGE: {
      let s = Object.assign({}, old);
      let a = [...s.Actions];
      let o = Object.assign({}, a[action.payload.index]);
      let d = Object.assign({}, o.AttackDetails)
      let dl = [...d.Damages];
      dl.splice(action.payload.val, 1)
      d.Damages = dl
      o.AttackDetails = d;
      a[action.payload.index] = o;
      s.Actions = a;
      return s 
    }
    case REMOVE_LEGENDARY_ACTION_DAMAGE: {
      let s = Object.assign({}, old);
      let a = [...s.LegendaryActions];
      let o = Object.assign({}, a[action.payload.index]);
      let d = Object.assign({}, o.AttackDetails)
      let dl = [...d.Damages];
      dl.splice(action.payload.val, 1)
      d.Damages = dl
      o.AttackDetails = d;
      a[action.payload.index] = o;
      s.LegendaryActions = a;
      return s
    }
    case SET_NPC_DESCRIPTION: {
      let s = Object.assign({}, old);
      s.description = action.payload;
      return s
    }
    case ADD_NPC_IMAGE: {
      let s = Object.assign({}, old);
      let i = [...s.Images];
      i.push(action.payload);
      s.Images = i;
      return s
    }
    case REMOVE_NPC_IMAGE: {
      let s = Object.assign({}, old);
      let i = [...s.Images];
      i.splice(action.payload, 1);
      s.Images = i;
      return s
    }
    case UPDATE_NPC_IMAGE: {
      let s = Object.assign({}, old);
      let i = [...s.Images];
      i[action.payload.index] = action.payload.val
      s.Images = i;
      return s
    }
    case SET_NPC: {
      return Object.assign({}, action.payload);
    }
    default: {
      return old;
    }
  }
};

export default npc;
