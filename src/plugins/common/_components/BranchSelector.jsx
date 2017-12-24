import React from "react";
// import Modal from "boron/DropModal";
import Modal from "react-modal";

const customStyles = {
  overlay: {
    filter: "alpha(opacity=60)",
    opacity: "0.5 !important",
    // position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0)"
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

/**
 * 选择分支的工具
 */
export default class BranchSelector extends React.Component {
  //   componentDidMount() {
  //     if (this.refs.BranchSelector) this.refs.BranchSelector.show();
  //   }
  render() {
    console.log(this.props);
    const { commonSelectors } = this.props;
    console.log("commonSelectors", commonSelectors);
    if (!commonSelectors) {
      return <div />;
    }
    const branches = commonSelectors.branches();
    console.log("branches", branches);
    if (!branches) {
      return <div />;
    }
    return (
      <Modal isOpen="true" style={customStyles}>
        <div className="container">
          <h2>选择分支</h2>
          <input type="file" />
        </div>
        {/* <div className="right">
          <button className="btn cancel" onClick={this.hideModal}>
            Cancel
          </button>
          <button className="btn" onClick={this.importFromFile}>
            Open file
          </button>
        </div> */}
      </Modal>
    );
  }
}
