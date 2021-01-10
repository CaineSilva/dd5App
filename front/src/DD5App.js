import './DD5App.css'
import { connect } from 'react-redux'

import { makeAction, setConfig, setMode} from "./redux/actions"
import { useEffect } from 'react'
import { CONFIG_FILE_NAME, HandleError, MODES } from './constants'
import { getMode, getVersion } from './redux/selectors'
import HomeComponent from './components/HomeComponent'
import NPCForm from './components/npcComponent/NPCForm'


const AppComponent = ({ version, mode, setConfig, setMode }) =>{
    useEffect(()=>{
        fetch(CONFIG_FILE_NAME).then( ( r ) => r.json(), HandleError).then( ( data ) => setConfig(data), HandleError);
    })


    return <div className="app-root">
        <header className="app-header">
            <div className="site-name">{ mode }</div>
            {mode===MODES.HOME?null:<input className="previous styled-button" type="button" value="<" onClick={
              ( e ) => setMode(MODES.HOME)
            }/>}
        </header>
        <div className="app-content">
            {
                getComponentFromMode(mode)
            }
        </div>
        <div className="app-footer">
            <div>{"Projet DD5App Version " + version + " développé librement par Caine SILVA."}</div>
            <a className="a-on-wood" href="https://github.com/CaineSilva/dd5App">https://github.com/CaineSilva/dd5App</a>
        </div>
    </div>
}

const getComponentFromMode = (mode) => {
  switch (mode) {
    case MODES.HOME:
      return <HomeComponent/>
    case MODES.NPC:
      return <NPCForm/>
    default:
      return <HomeComponent/>
  }
}

const getAppState = (store) => {
  return {
    version: getVersion(store),
    mode: getMode(store)
  }
}

const getAppDispatch = (dispatch) => {
  return {
    setConfig: makeAction(dispatch, setConfig),
    setMode: makeAction(dispatch, setMode)
  }
}

export default connect(
    getAppState, 
    getAppDispatch
)(AppComponent); 