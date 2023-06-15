import React from "react";
import "./options.scss";

const FormOptions = (props) => {
	const { changeMode } = props;
	return (
		<div className="formOptions">
			<div className="config" onClick={() => changeMode(true)}>
				Config
			</div>
			<div className="code" onClick={() => changeMode(false)}>
				Code
			</div>
		</div>
	);
};

export default FormOptions;
