package npc

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

type NPC struct {
	OutPath string
	TemplatePath string
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
	SaveRollModifiers SAVE_ROLL_MODIFIER
	SaveRollModifiersString string
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

func (this *NPC) prepare() {
	//JS string
	s := ""
	if this.SaveRollModifiers.Force != 0 {
		s += "For"
		if this.SaveRollModifiers.Force>0{
			s+=fmt.Sprintf("+%v, ", this.SaveRollModifiers.Force)
		} else {
			s+=fmt.Sprintf("%v, ", this.SaveRollModifiers.Force)
		}
	}
	if this.SaveRollModifiers.Dexterity != 0 {
		s += "Dex"
		if this.SaveRollModifiers.Dexterity>0{
			s+=fmt.Sprintf("+%v, ", this.SaveRollModifiers.Dexterity)
		} else {
			s+=fmt.Sprintf("%v, ", this.SaveRollModifiers.Dexterity)
		}

	}
	if this.SaveRollModifiers.Constitution != 0 {
		s += "Con"
		if this.SaveRollModifiers.Constitution>0{
			s+=fmt.Sprintf("+%v, ", this.SaveRollModifiers.Constitution)
		} else {
			s+=fmt.Sprintf("%v, ", this.SaveRollModifiers.Constitution)
		}
	}
	if this.SaveRollModifiers.Intelligence != 0 {
		s += "Int"
		if this.SaveRollModifiers.Intelligence>0{
			s+=fmt.Sprintf("+%v, ", this.SaveRollModifiers.Intelligence)
		} else {
			s+=fmt.Sprintf("%v, ", this.SaveRollModifiers.Intelligence)
		}
	}
	if this.SaveRollModifiers.Wisdom != 0 {
		s += "Sag"
		if this.SaveRollModifiers.Wisdom>0{
			s+=fmt.Sprintf("+%v, ", this.SaveRollModifiers.Wisdom)
		} else {
			s+=fmt.Sprintf("%v, ", this.SaveRollModifiers.Wisdom)
		}
	}
	if this.SaveRollModifiers.Charisma != 0 {
		s += "Cha"
		if this.SaveRollModifiers.Charisma>0{
			s+=fmt.Sprintf("+%v, ", this.SaveRollModifiers.Charisma)
		} else {
			s+=fmt.Sprintf("%v, ", this.SaveRollModifiers.Charisma)
		}
	}
	if s != "" {
		this.SaveRollModifiersString = s[:len(s)-2]
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

func (this *NPC) GenerateFile() error {
	tmpl, err := template.New("npc.template").Funcs(template.FuncMap{"dec": func (a int)int{ return a-1 }}).ParseFiles(this.TemplatePath + "/npc.template")
	if err != nil {
		return err
	}
	file, err := os.Create(this.OutPath + "/" + this.Name + ".md")
	defer file.Close()
	if err != nil {
		return err
	}
	this.prepare()
	err = tmpl.Execute(file, this)
	return err
}