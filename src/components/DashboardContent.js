import React, { useState, useEffect } from "react";
import axios from "axios";
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

	// const hideConfigTab = () => {
	// 	document.querySelector(".hideConfigTab").style.display = "none";
	// 	document.querySelector(".viewConfigTab").style.display = "flex";
	// 	// document.querySelector(".formBuilder").style.width = "0%";
	// 	document.querySelector(".formBuilder").style.display = "none";
	// 	document.querySelector(".demoSite").style.width = "100%";
	// };
	// const showConfigTab = () => {
	// 	document.querySelector(".viewConfigTab").style.display = "none";
	// 	document.querySelector(".hideConfigTab").style.display = "flex";
	// 	// document.querySelector(".formBuilder").style.width = "30%";
	// 	document.querySelector(".formBuilder").style.display = "flex";
	// 	document.querySelector(".demoSite").style.width = "70%";
	// };

	// useEffect(() => {
	// 	console.log("siteKey:", siteKey, "configKey:", configKey);
	// 	if (siteKey !== undefined && configKey !== undefined) {
	// 		// console.log("retrieving configs");
	// 		// debugger;
	// 		if (localStorage.getItem(`config-${siteKey}-${configKey}`) !== null) {
	// 			let config = localStorage.getItem(`config-${siteKey}-${configKey}`);
	// 			// setFormData(JSON.parse(config));
	// 			validator(JSON.parse(config));

	// 			// displaySuccess("Retrieved and applied configurations.");
	// 		} else {
	// 			axios
	// 				.get("http://localhost:5000/retrieve", {
	// 					params: { siteKey: siteKey, configKey: configKey },
	// 				})
	// 				.then((response) => {
	// 					// handle success
	// 					if (response.data.status === "error") {
	// 						// console.log(
	// 						// 	"No saved configurations found. Applying default configurations."
	// 						// );
	// 						// setFormData(defaultConfig);
	// 						validator(defaultConfig);
	// 						// displayError(
	// 						// 	`No saved configurations found. Applying default configurations.`
	// 						// );
	// 						return;
	// 					}

	// 					// console.log("No error, continuing.");
	// 					// setFormData(response.data.config);
	// 					validator(response.data.config);
	// 					// displaySuccess("Retrieved and applied configurations.");
	// 				})
	// 				.catch((error) => {
	// 					// handle error
	// 					console.error(
	// 						"Could not retrieve the configurations as server is down."
	// 					);
	// 					// console.log(error.message);
	// 					// setFormData(defaultConfig);
	// 					validator(defaultConfig);
	// 					// displayError(
	// 					// 	`${error.message}: Server is down. Could not retrieve configurations.`
	// 					// );
	// 				});
	// 		}
	// 	} else {
	// 		// console.log(localStorage.getItem("config"));
	// 		if (localStorage.getItem("config") === null) {
	// 			// setFormData(defaultConfig);
	// 			validator(defaultConfig);
	// 			// displaySuccess("Default configurations have been applied.");
	// 			// displayInfo("Default configurations have been applied.");
	// 		} else {
	// 			let config = localStorage.getItem("config");
	// 			// setFormData(JSON.parse(config));
	// 			validator(JSON.parse(config));
	// 			// displaySuccess("Retrieved and applied saved changes.");
	// 		}
	// 	}
	// }, []);

	return (
		<div className="formMaster">
			{/* Inside formMaster of DashboardContent */}
			<FormBuilder
				setValidatedConfig={setValidatedConfig}
				// hideConfigTab={hideConfigTab}
				validatedConfig={validatedConfig}
				validator={validator}
				configKey={configKey}
				siteKey={siteKey}
			/>
		</div>
	);
};

export default DashboardContent;
