import "./HomeComponent.css"
import "../DD5App.css"
import { connect } from 'react-redux'

import { makeAction, setMode } from "../redux/actions"
import { MODES } from "../constants"

const HomeComponent = ( { setMode } ) => {
    return <div className="home-root">
        <h4 className="home-title">Outils disponibles :</h4>
        <div className="home-tool-list">
            {
                Object.values(MODES).map( (el) => {
                    return el===MODES.HOME?
                    null:
                    <input key={el} className="styled-button" type="button" value={el} onClick={
                        (e) => {
                            setMode(el);
                        }
                    }/>
                })
            }
        </div>
    </div>
}

const getHomeState = (store) => {
    return {
        
    }
}
  
const getHomeDispatch = (dispatch) => {
    return {
        setMode: makeAction(dispatch, setMode)
    }
}

export default connect(
    getHomeState, 
    getHomeDispatch,
)(HomeComponent); 