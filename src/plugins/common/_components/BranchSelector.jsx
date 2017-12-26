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

class Branch extends React.Component {
  constructor(props, context) {
    super(props, context);
    // this.state = {
    //   // 登录名
    //   selectBranch: ""
    // };
    // // 绑定事件
    this.selectMe = this.selectMe.bind(this);
  }

  render() {
    const { name, selectBranch, onSelect } = this.props;
    if (name == selectBranch) return <h1>{name}</h1>;
    return <h3 onClick={this.selectMe}>{name}</h3>;
  }
  selectMe() {
    const { name, onSelect } = this.props;
    onSelect(name);
  }
}

/**
 * 选择分支的工具
 */
export default class BranchSelector extends React.Component {
  //   componentDidMount() {
  //     if (this.refs.BranchSelector) this.refs.BranchSelector.show();
  //   }

  constructor(props, context) {
    super(props, context);
    this.state = {
      // 登录名
      selectBranch: ""
    };

    // // 绑定事件
    this.selectBranch = this.selectBranch.bind(this);
    this.ok = this.ok.bind(this);
  }

  selectBranch(name) {
    console.log("to name:", name);
    this.setState({
      selectBranch: name
    });
  }

  /**
   * 选好了
   */
  ok() {
    const { commonActions } = this.props;
    const { selectBranch } = this.state;
    commonActions.clearBranches();
    // 如果选择了就推送 不然哼
    if (selectBranch != "") {
      commonActions.selectBranch(selectBranch);
    }
  }

  render() {
    const { commonSelectors, commonActions } = this.props;
    const { selectBranch } = this.state;
    console.log("commonSelectors", commonSelectors);
    if (!commonSelectors) {
      return <div />;
    }
    const branches = commonSelectors.branches();
    console.log("branches", branches);
    if (!branches) {
      return <div />;
    }
    var rows = branches.map(name => (
      <Branch
        name={name}
        selectBranch={selectBranch}
        onSelect={this.selectBranch}
      />
    ));
    if (rows.length == 0) rows = <p>暂无分支</p>;

    return (
      <Modal isOpen="true" style={customStyles}>
        <div className="container">
          <h2>选择分支</h2>
          {rows}
        </div>
        <div className="buttons">
          <button className="btn cancel" onClick={commonActions.clearBranches}>
            Cancel
          </button>
          <button className="btn" onClick={this.ok}>
            Ok
          </button>
        </div>
      </Modal>
    );
  }
}
