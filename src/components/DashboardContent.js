import React, { useState, useEffect } from "react";
import axios from "axios";
import FormOptions from "./FormOptions";
import FormBuilder from "./FormBuilder";
import { getModuleConfigs, getEleDataType } from "../utils/configUtils";

import defaultConfig from "../inputJson/defaultConfig.json";
import { useParams } from "react-router-dom";

const DashboardContent = (props) => {
	// const {
	// 	viewConfigOption,
	// 	reloadWarning = true,
	// 	displayError,
	// 	displaySuccess,
	// 	displayInfo,
	// } = props;

	const [validatedConfig, setValidatedConfig] = useState({});
	const [viewConfig, setViewConfig] = useState(true);

	const { siteKey, configKey } = useParams();

	let validator = (formData) => {
		JSON.stringify(
			{ ...formData },
			function (index, value) {
				let validatedData = {};
				// console.log("inside validator:", formData);
				for (let moduleKey in value) {
					let moduleConfig = getModuleConfigs(moduleKey);
					let formConfig = formData[moduleKey];

					if (!moduleConfig) {
						if (formConfig !== undefined) {
							if (formConfig !== undefined) {
								if (formConfig.length) {
									try {
										let evaluatedVal = eval(formConfig);
										validatedData[moduleKey] = evaluatedVal;
									} catch (err) {
										// if (err.name === "SyntaxError") {
										if (
											moduleKey === "searchBoxEl" ||
											moduleKey === "searchButtonEl"
										) {
											// console.log(formConfig);
											console.error(moduleKey, "producted this error. \n", err);
											// displayError(
											// 	`${moduleKey} produced an error.\n${err.name}: ${err.message}`
											// );
											return;
										} else {
											validatedData[moduleKey] = formConfig;
										}
									}
								}
							}
						}
					} else {
						validatedData[moduleKey] = {};
						for (let element in formConfig) {
							if (formConfig[element] !== undefined) {
								if (formConfig[element].toString().length) {
									const dataType = getEleDataType(moduleKey, element);
									switch (dataType) {
										case "element":
											try {
												validatedData[moduleKey][element] = eval(
													formConfig[element]
												);
											} catch (err) {
												// displayError(
												// 	`${moduleKey} > ${element} produced the error: \n${err.name}: ${err.message}`
												// );
												return;
											}
											break;
										case "function":
											try {
												validatedData[moduleKey][element] = eval(
													"(" + formConfig[element] + ")"
												);
											} catch (err) {
												// displayError(
												// 	`${moduleKey} > ${element} produced the error: \n${err.name}: ${err.message}`
												// );
												console.error(err);
												return;
											}
											break;
										case "number":
											try {
												validatedData[moduleKey][element] = parseInt(
													formConfig[element]
												);
											} catch (err) {
												// displayError(
												// 	`${moduleKey} > ${element} produced the error: \n${err.name}: ${err.message}`
												// );
												return;
											}
											break;
										case "object":
											try {
												validatedData[moduleKey][element] = JSON.parse(
													formConfig[element]
												);
											} catch (err) {
												// displayError(
												// 	`${moduleKey} > ${element} produced the error: \n${err.name}: ${err.message}`
												// );
												return;
											}
											break;
										case "array":
											try {
												validatedData[moduleKey][element] = eval(
													formConfig[element]
												);
											} catch (err) {
												// displayError(
												// 	`${moduleKey} > ${element} produced the error: \n${err.name}: ${err.message}`
												// );
												return;
											}
											break;
										case "boolean":
											try {
												validatedData[moduleKey][element] = eval(
													formConfig[element]
												);
											} catch (err) {
												// displayError(
												// 	`${moduleKey} > ${element} produced the error: \n${err.name}: ${err.message}`
												// );
												return;
											}
											break;
										default:
											validatedData[moduleKey][element] = formConfig[element];
											break;
									}
								}
							}
						}
					}
				}
				if (Object.keys(validatedData).length > 0) {
					setValidatedConfig(validatedData);
					localStorage.setItem(
						configKey !== undefined && configKey.length > 0
							? `config-${siteKey}-${configKey}`
							: `config`,
						JSON.stringify(formData, null, 4)
					);
					// displaySuccess("Configurations validated successfully. No errors.");
				}
			},
			4
		);
	};

	const changeMode = (viewConfig) => {
		setViewConfig(viewConfig);
		if (viewConfig) {
			const configEl = document.querySelector(".config");
			const codeEl = document.querySelector(".code");
			configEl.style.borderBottom = "2px solid cornflowerblue";
			codeEl.style.borderBottom = "2px solid #ccc";
			setViewConfig(viewConfig);
		} else {
			const configEl = document.querySelector(".config");
			const codeEl = document.querySelector(".code");
			configEl.style.borderBottom = "2px solid #ccc";
			codeEl.style.borderBottom = "2px solid cornflowerblue";
			setViewConfig(viewConfig);
		}
	};

	return (
		<div className="formMaster">
			{/* Inside formMaster of DashboardContent */}
			<FormOptions changeMode={changeMode} />
			<FormBuilder
				setValidatedConfig={setValidatedConfig}
				// hideConfigTab={hideConfigTab}
				validatedConfig={validatedConfig}
				validator={validator}
				configKey={configKey}
				siteKey={siteKey}
				viewConfig={viewConfig}
			/>
		</div>
	);
};

export default DashboardContent;
