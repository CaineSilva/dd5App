package main

import (
	"fmt"
	"os"
	"text/template"
)

type ATTRIBUTES struct {
	Force int
	Dexterity int
	Constitution int
	Intelligence int
	Wisdom int
	Charisma int
}

type ATTRIBUTES_MODIFIERS struct {
	Force int
	Dexterity int
	Constitution int
	Intelligence int
	Wisdom int
	Charisma int
}

type TRAIT struct {
	Name string
	Description string
}

type DAMAGE struct {
	DieNumber int
	DieType int
	DieBonus int
	MeanDamage int
	DamageType string
}

type ATTACK_DETAILS struct {
	AttackRollBonus int
	Reach string
	Damages []DAMAGE
	Target string
	Type string
}

type ACTION struct {
	Name string
	Description string
	IsAttack bool
	AttackDetails ATTACK_DETAILS
}

type IMAGE struct {
	Url string
	Title string
}

type SAVE_ROLL_MODIFIER struct {
	Force int
	Dexterity int
	Constitution int
	Intelligence int
	Wisdom int
	Charisma int
}

type PNJ struct {
	Name string
	Size string
	Keywords string
	Alignment string
	ArmorClass int
	ArmorType string
	HealthPoint int
	HealthDiceNumber int
	HealthDiceType int
	HealthDiceBonus int
	Speeds string
	Attributes ATTRIBUTES
	AttributesModifiers ATTRIBUTES_MODIFIERS
	SaveRollModifier SAVE_ROLL_MODIFIER
	SaveRollModifierString string
	Skills map[string]int
	SkillModifierString string
	XP int
	FP string
	DamageVulnerability string
	DamageResistance string
	DamageImmunity string
	ConditionImmunity string
	PassivePerception int
	Senses string
	Languages string
	Traits []TRAIT
	Actions []ACTION
	Reactions []TRAIT
	LegendaryActions []ACTION
	Images []string
	DescriptionLines []string
}

func (this *PNJ) prepare() {
	//JS string
	s := ""
	if this.SaveRollModifier.Force != 0 {
		s += "For"
		if this.SaveRollModifier.Force>0{
			s+=fmt.Sprintf("+%v, ", this.SaveRollModifier.Force)
		}
	}
	if this.SaveRollModifier.Dexterity != 0 {
		s += "Dex"
		if this.SaveRollModifier.Dexterity>0{
			s+=fmt.Sprintf("+%v, ", this.SaveRollModifier.Dexterity)
		}
	}
	if this.SaveRollModifier.Constitution != 0 {
		s += "Con"
		if this.SaveRollModifier.Constitution>0{
			s+=fmt.Sprintf("+%v, ", this.SaveRollModifier.Constitution)
		}
	}
	if this.SaveRollModifier.Intelligence != 0 {
		s += "Int"
		if this.SaveRollModifier.Intelligence>0{
			s+=fmt.Sprintf("+%v, ", this.SaveRollModifier.Intelligence)
		}
	}
	if this.SaveRollModifier.Wisdom != 0 {
		s += "Sag"
		if this.SaveRollModifier.Wisdom>0{
			s+=fmt.Sprintf("+%v, ", this.SaveRollModifier.Wisdom)
		}
	}
	if this.SaveRollModifier.Charisma != 0 {
		s += "Cha"
		if this.SaveRollModifier.Charisma>0{
			s+=fmt.Sprintf("+%v, ", this.SaveRollModifier.Charisma)
		}
	}
	if s != "" {
		this.SaveRollModifierString = s[:len(s)-2]
	}
	// Skill string
	s = ""
	for key, value := range this.Skills {
		if value != 0 {
			if value > 0 {
				s += fmt.Sprintf("%v+%v, ", key, value)
			} else {
				s += fmt.Sprintf("%v%v, ", key, value)
			}
		}
	}
	if s != "" {
		this.SkillModifierString = s[:len(s)-2]
	}
}

func (this *PNJ) GenerateFile() error {
	tmpl, err := template.New("pnj.template").Funcs(template.FuncMap{"dec": func (a int)int{ return a-1 }}).ParseFiles("templates/pnj.template")
	if err != nil {
		return err
	}
	file, err := os.Create("out/" + this.Name + ".md")
	if err != nil {
		return err
	}
	this.prepare()
	err = tmpl.Execute(file, this)
	return err
}