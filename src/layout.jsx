import React from "react"
import PropTypes from "prop-types"
import Loadable from "react-loading-overlay"

export default class EditorLayout extends React.Component {

  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired
  }

  onChange = (newYaml) => {
    this.props.specActions.updateSpec(newYaml)
  }

  render() {
    // console.log(this.props);
    let { getComponent,commonSelectors } = this.props
    // console.log(commonSelectors,commonSelectors.login());
    let LoginFrame = getComponent("LoginFrame",true)

    let UIBaseLayout = getComponent("BaseLayout", true)

    let Container = getComponent("Container")
    let EditorContainer = getComponent("EditorContainer", true)
    const SplitPaneMode = getComponent("SplitPaneMode", true)

    // console.log(commonSelectors.login());
    if(LoginFrame && !commonSelectors.login()){
      return <LoginFrame/>;
    }

    const loadingText = commonSelectors.loadingText();
    return (
      <div>
        {loadingText!=null?<Loadable active="true" spinner="true" animate="true" text={loadingText}>
        </Loadable>:<div/>}
        <Container className='container'>
          <SplitPaneMode>
            <EditorContainer
              onChange={this.onChange}
              />
            <UIBaseLayout/>
        </SplitPaneMode>
      </Container>
    </div>

  )
  }

}
