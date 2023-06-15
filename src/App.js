import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
// import "./components/unbxdStyle.css";
import "./components/general.scss";

import "unbxd-react-components/components/theme.css";
import "unbxd-react-components/components/core.css";
import FormIcons from "./components/FormIcons";
import DashboardHeader from "./components/DashboardHeader";
import DashboardContent from "./components/DashboardContent";

class App extends Component {
	render() {
		return (
			<div className="extension-body">
				{/* <FormIcons /> */}
				<DashboardHeader />
				<DashboardContent />
				{/* <div className="App">
					<div className="App-header">
						<img src={logo} className="App-logo" alt="logo" />
						<h2>Welcome to React</h2>
					</div>
					<p className="App-intro">
						To get started, edit <code>src/App.js</code> and save to reload.
					</p>
				</div> */}
			</div>
		);
	}
}

export default App;
