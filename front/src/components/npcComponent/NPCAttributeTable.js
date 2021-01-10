import "./NPCTable.css"
import "../../DD5App.css"
import { connect } from 'react-redux'
import { AttributesDisplayNames, AttributesNameMap, Types } from "./NPCConstants"
import { getNPC } from "../../redux/selectors"
import { makeAction, setNPCAttribute, setNPCSaveRollModifier } from "../../redux/actions"

const NPCAttributeTable = ( {
    npc,
    setNPCAttribute,
    setNPCSaveRollModifier
    }) => {
    return <div className="npc-table-wrapper">
                <div className="npc-table-title">
                     Caractéristiques
                </div>
                <table className="npc-table">
                    <tbody>
                        <tr>
                            <th className="npc-table-head-cell" align="center" valign="center">
                                
                            </th>
                            {
                                AttributesDisplayNames.map( (el) => {
                                    return <th 
                                        key={el}
                                        className="npc-table-head-cell"
                                        align="center" 
                                        valign="center"
                                        >
                                            {el}
                                        </th>
                                })
                            }
                        </tr>
                        <tr>
                            <th 
                                className="npc-table-head-cell"
                                align="center" 
                                valign="center"
                            >
                                Score
                            </th>
                            {
                                AttributesDisplayNames.map( (el) => {
                                    return <td className="npc-table-cell" align="center" valign="center" key={el}>
                                        <input
                                            className="npc-table-cell-value"
                                            value={npc.Attributes[AttributesNameMap[el]]}
                                            onChange={ (e) => setNPCAttribute(e.target.value, AttributesNameMap[el])}
                                            type={Types.NUMBER}
                                            min="0"
                                            max="30"
                                            step="1"
                                        /> 
                                    </td>
                                })
                            }
                        </tr>
                        <tr>
                            <th 
                                className="npc-table-head-cell"
                                align="center" 
                                valign="center"
                            >
                                Modificateur
                            </th>
                            {
                                AttributesDisplayNames.map( (el) => {
                                    return <td className="npc-table-cell" align="center" valign="center" key={el}>
                                        <input
                                            className="npc-table-cell-value readonly-cell"
                                            value={npc.AttributeModifiers[AttributesNameMap[el]]}
                                            type={Types.NUMBER}
                                            min="-30"
                                            max="30"
                                            step="1"
                                            disabled={true}
                                            style={{cursor: "default"}}
                                        />  
                                    </td>
                                })
                            }
                        </tr>
                        <tr>
                            <th 
                                className="npc-table-head-cell"
                                align="center" 
                                valign="center"
                            >
                                Modificateur de JS
                            </th>
                            {
                                AttributesDisplayNames.map( (el) => {
                                    return <td className="npc-table-cell" align="center" valign="center" key={el}>
                                        <input
                                            className="npc-table-cell-value"
                                            value={npc.SaveRollModifiers[AttributesNameMap[el]]}
                                            onChange={ (e) => setNPCSaveRollModifier(e.target.value, AttributesNameMap[el])}
                                            type={Types.NUMBER}
                                            min="-30"
                                            max="30"
                                            step="1"
                                        /> 
                                    </td>
                                })
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
}

const getNPCAttributeTableState = (store) => {
    return {
        npc: getNPC(store)
    }
}

const getNPCAttributeTableDispatch = (dispatch) => {
    return {
        setNPCAttribute: makeAction(dispatch, setNPCAttribute),
        setNPCSaveRollModifier: makeAction(dispatch, setNPCSaveRollModifier)
    }
}

export default connect(
    getNPCAttributeTableState, 
    getNPCAttributeTableDispatch
)(NPCAttributeTable); 