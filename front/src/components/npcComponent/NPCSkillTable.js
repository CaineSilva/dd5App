import "./NPCTable.css"
import "../../DD5App.css"
import React from "react"
import { connect } from 'react-redux'
import { Skills, Types } from "./NPCConstants"
import { getNPC } from "../../redux/selectors"
import { makeAction, setNPCSkill } from "../../redux/actions"

const NPCSkillTable = ( {
    npc,
    setNPCSkill,
    }) => {
    return <div className="npc-table-wrapper">
                <div className="npc-table-title">
                     Modificateurs de Compétences
                </div>
                <table className="npc-table">
                    <tbody>
                        {[...Array(6).keys()].map((lineNumber) => {
                            return <tr key={"key" + String(lineNumber)}>
                                {Skills.map((skill, index) => {
                                    return index%6===lineNumber?<React.Fragment key={lineNumber + skill}>
                                        <th className="npc-table-head-cell" align="center" valign="center" >
                                            {skill}
                                        </th>
                                        <td className="npc-table-cell" align="center" valign="center" >
                                            <input
                                                className="npc-table-cell-value"
                                                value={npc.Skills[skill]}
                                                onChange={ (e) => setNPCSkill(e.target.value, skill)}
                                                type={Types.NUMBER}
                                                min="-30"
                                                max="30"
                                                step="1"
                                            /> 
                                        </td>
                                        </React.Fragment>:null
                                })}
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
}

const getNPCSkillTableState = (store) => {
    return {
        npc: getNPC(store),
    }
}

const getNPCSkillTableDispatch = (dispatch) => {
    return {
        setNPCSkill: makeAction(dispatch, setNPCSkill),
    }
}

export default connect(
    getNPCSkillTableState, 
    getNPCSkillTableDispatch
)(NPCSkillTable); 