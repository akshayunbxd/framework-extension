import React from "react";
import { Dropdown } from "unbxd-react-components";

import "./header.scss";

const DashboardHeader = (props) => {
	return (
		<div className="dashHead">
			<div className="desc">
				<a className="logoWrapper" href="/">
					<div className="logo"></div>
				</a>
				<h1>SDK WORKBENCH</h1>
			</div>
			<Dropdown
				// label="SDK Version"
				name="version"
				className="versionDropdown"
				appearance="block"
				noSelectionLabel="Version"
				onChange={() => console.log("Changed SDK version")}
				options={[
					{
						id: 1,
						name: "v2.0.38",
					},
					{
						id: 2,
						name: "v2.0.37",
					},
				]}
			/>
			{/* <div className="userConfigs">
				<a
					className="version"
					href="https://unbxd.github.io/search-JS-library/docs/CHANGELOG.html#v2030"
					target="_blank"
				>
					v2.0.30
				</a>
			</div> */}
		</div>
	);
};

export default DashboardHeader;
