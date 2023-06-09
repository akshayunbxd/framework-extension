import React, { useEffect, useRef, useState } from "react";
import FormWrapper from "./FormWrapper";
// import axios from "axios";
// import { useParams } from "react-router-dom";

import "./content.scss";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import defaultConfig from "../inputJson/defaultConfig.json";
// import demoConfig from "../../../demo.json";
import {
	Button,
	Modal,
	Input,
	InlineModal,
	InlineModalActivator,
	InlineModalBody,
} from "unbxd-react-components";
import CustomInput from "./formElements/CustomInput";
import CustomCheck from "./formElements/CustomCheck";
import CustomRadio from "./formElements/CustomRadio";
import axios from 'axios';

const FormContent = (props = {}) => {
	const {
		formConfigs,
		selectedAcc,
		setSelectedAcc,
		setValidatedConfig,
		validatedConfig,
		// displayError,
		// displaySuccess,
		// displayInfo,
		validator,
		siteKey,
		configKey,
	} = props;

	// let masterConfig = {};

	const [ formData, setFormData ] = useState({});
	const [ jsonData, setJsonData ] = useState();
	const [ fsCodeEditorData, setFSCodeEditorData ] = useState(null);
	const [ publishedBuilderLink, setPublishedBuilderLink ] = useState("");
	const [ publishedPreviewLink, setPublishedPreviewLink ] = useState("");
	const [ customFileNameBool, setCustomFileNameBool ] = useState("NO");
	// const [customFileNameBool, setCustomFileNameBool] = useState(false);
	const [ customFileName, setCustomFileName ] = useState(
		configKey !== undefined && configKey.length > 0 ? configKey : ""
	);

	// console.log("formData:", formData);

	const confirmModalRef = useRef();
	const viewJSONModalRef = useRef();
	const publishSuccessModalRef = useRef();
	const importCodeModalRef = useRef();

	let [ publishPopUp, setPublishPopUp ] = useState(false);
	let [ publishStatus, setPublishStatus ] = useState(false);

	const inputJSONFile = useRef(null);

	// const updateMasterConfig = (formConfigs) => {
	// 	formConfigs.map((formConfig = {}, i) => {
	// 		if (formConfig.moduleKey) {
	// 			masterConfig = {
	// 				...masterConfig,
	// 				[formConfig.moduleKey]: { ...formConfig.config },
	// 			};
	// 		}
	// 	});
	// };
	// updateMasterConfig(formConfigs); // this should be inside a hooks
	const updateFormData = (data = {}, moduleKey = null) => {
		// setCodeChangeStatus(true);
		if (moduleKey) {
			setFormData({
				...formData,
				[ moduleKey ]: { ...formData[ moduleKey ], ...data },
			});
			console.log("if condition updateFormData");
			setJsonData(
				exportAllJS("import", {
					...formData,
					[ moduleKey ]: { ...formData[ moduleKey ], ...data },
				})
			);
		} else {
			console.log("else condition updateFormData");
			setFormData({ ...formData, ...data });
			setJsonData(exportAllJS("import", { ...formData, ...data }));
		}
	};

	useEffect(() => {
		// console.log("siteKey:", siteKey, "configKey:", configKey);
		if (siteKey !== undefined && configKey !== undefined) {
			// console.log("retrieving configs");
			// debugger;
			if (localStorage.getItem(`config-${siteKey}-${configKey}`) !== null) {
				let config = localStorage.getItem(`config-${siteKey}-${configKey}`);
				console.log("useEffect localstorage defined");
				setFormData(JSON.parse(config));
				setJsonData(exportAllJS("import", JSON.parse(config)));
				// validator(JSON.parse(config));
				// displaySuccess("Retrieved and applied configurations.");
			} else {
				axios
					.get("http://localhost:5000/retrieve", {
						params: { siteKey: siteKey, configKey: configKey },
					})
					.then((response) => {
						// handle success
						if (response.data.status === "error") {
							// console.log(
							// 	"No saved configurations found. Applying default configurations."
							// );
							console.log("useEffect axios error defined");
							setFormData(defaultConfig);
							setJsonData(exportAllJS("import", defaultConfig));
							// displayError(
							// 	`No saved configurations found. Applying default configurations.`
							// );
							return;
						}

						// console.log("No error, continuing.");
						console.log("useEffect axios noerror defined");
						setFormData(response.data.config);
						setJsonData(exportAllJS("import", response.data.config));
						// displaySuccess("Retrieved and applied configurations.");
					})
					.catch((error) => {
						// handle error
						console.error(
							"Could not retrieve the configurations as server is down."
						);
						// console.log(error.message);
						setFormData(defaultConfig);
						setJsonData(exportAllJS("import", defaultConfig));
						// displayError(
						// 	`${error.message}: Server is down. Could not retrieve configurations.`
						// );
					});
			}
		} else {
			// console.log(localStorage.getItem("config"));
			if (localStorage.getItem("config") === null) {
				console.log("useEffect nolocalStorage undefined");
				setFormData(defaultConfig);
				setJsonData(exportAllJS("import", defaultConfig));
				// displayInfo("Default configurations have been applied.");
			} else {
				let config = localStorage.getItem("config");
				console.log("useEffect localStorage undefined");
				setFormData(JSON.parse(config));
				setJsonData(exportAllJS("import", JSON.parse(config)));
				// (config);
				// displaySuccess("Retrieved and applied saved changes.");
			}
		}
	}, []);

	const handlePublishStatus = () => {
		setPublishPopUp(false);
		confirmModalRef.current.hideModal();
		publishSuccessModalRef.current.showModal();
	};

	const handlePublish = () => {
		setPublishPopUp(true);
		if (siteKey !== undefined && configKey !== undefined) {
			const customConfig = {
				headers: {
					"Content-Type": "application/json",
				},
			};
			const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
				JSON.stringify(formData, null, 4)
			)}`;
			const link = document.createElement("a");
			link.href = jsonString;
			link.download = `${formData.siteKey}${configKey !== undefined && configKey.length > 0 ? `-${configKey}` : ""
				}.json`;
			// link.download = "configurations.json";
			link.click();
			axios
				.post(
					"http://localhost:5000/upload",
					JSON.stringify(
						{
							data: "Hello backend defined",
							config: formData,
							siteKey: siteKey,
							configKey:
								customFileNameBool === "NO" ? configKey : customFileName,
						},
						null,
						4
					),
					customConfig
				)
				.then((res) => {
					setPublishStatus(true);
					// setCodeChangeStatus(false);
					setPublishedBuilderLink(
						`http://localhost:3030/builder/${siteKey}/${customFileNameBool === "NO" ? configKey : customFileName
						}`
					);
					setPublishedPreviewLink(
						`http://localhost:3030/preview/${siteKey}/${customFileNameBool === "NO" ? configKey : customFileName
						}`
					);
				})
				.catch((err) => {
					setPublishStatus(false);
					console.error("Error:", err.message);
				});
		} else {
			let { siteKey } = formData;
			let configKey = customFileName;
			// let configKey = Date.now().toString();
			const customConfig = {
				headers: {
					"Content-Type": "application/json",
				},
			};
			const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
				JSON.stringify(formData, null, 4)
			)}`;
			const link = document.createElement("a");
			link.href = jsonString;
			link.download = `${formData.siteKey}${configKey !== undefined && configKey.length > 0 ? `-${configKey}` : ""
				}.json`;
			// link.download = "configurations.json";
			link.click();
			axios
				.post(
					"http://localhost:5000/upload",
					JSON.stringify(
						{
							data: "Hello backend undefined",
							config: formData,
							siteKey: siteKey,
							configKey: configKey,
						},
						null,
						4
					),
					customConfig
				)
				.then((res) => {
					setPublishStatus(true);
					// console.log(res.data);
					// setCodeChangeStatus(false);
					setPublishedBuilderLink(
						`http://localhost:3030/builder/${siteKey}/${configKey}`
					);
					setPublishedPreviewLink(
						`http://localhost:3030/preview/${siteKey}/${configKey}`
					);
				})
				.catch((err) => {
					setPublishStatus(false);
					console.error("Error:", err.message);
				});
		}
		setTimeout(handlePublishStatus, 2000);
	};

	const copyJSON = () => {
		navigator.clipboard.writeText(JSON.stringify(formData, null, 4));
		// document.querySelector(".viewMoreDropdown").style.display = "none";
		viewJSONModalRef.current.hideModal();
		// console.log("Copied JSON!");
		// displaySuccess("Copied JSON!");
	};

	const copyPublishedLink = (inputID, copyIconID) => {
		const copyIcon = document.getElementById(copyIconID);
		copyIcon.style.backgroundImage =
			"url('https://png.pngtree.com/png-clipart/20190516/original/pngtree-check-mark-icon-design-template-vector-isolated-png-image_4085369.jpg')";
		copyIcon.style.pointerEvents = "none";

		const inputEl = document.getElementById(inputID);
		inputEl.select();
		navigator.clipboard.writeText(inputEl.value);

		console.log("Copied text:", inputEl.value);
	};

	const exportIndividualJS = (code) => {
		let configObjInner = "\t{\n";
		for (let key of Object.keys(code)) {
			// console.log(key, typeof code[key]);
			if (typeof code[ key ] === "string") {
				// console.log("string:", key);
				try {
					const ele = JSON.parse(code[ key ]);
					// console.log("JSON.parse:", key);
					configObjInner += `\t\t${key}: ${code[ key ]}, \n`;
				} catch (arrErr) {
					try {
						//element
						const ele = eval(code[ key ]);
						// console.log("eval:", key, code[key]);
						configObjInner += `\t\t${key}: \`${code[ key ]}\`, \n`;
						// console.log("eval element:", key);
					} catch (eleErr) {
						try {
							//function
							const ele = eval("(" + code[ key ] + ")");
							// console.log("eval func:", key);
							configObjInner += `\t\t${key}: ${code[ key ]}, \n`;
							// console.log("eval function:", key);
						} catch (funcErr) {
							// console.log("not in eval:", key);
							configObjInner += `\t\t${key}: \`${code[ key ]}\`, \n`;
							// console.log("not in eval:", key);
						}
					}
				}
			} else if (typeof code[ key ] === "number") {
				configObjInner += `\t\t${key}: ${code[ key ].toString()}, \n`;
			} else if (typeof code[ key ] === "boolean") {
				configObjInner += `\t\t${key}: ${code[ key ].toString()}, \n`;
			}
		}
		configObjInner += "\t}";
		// console.log("configObjInner:", configObjInner);
		return configObjInner;
	};

	const exportAllJS = (cond, code) => {
		// console.log("in export:", cond, code);

		// console.log("configObj:", configObj)

		if (cond === "export") {
			// console.log("configObj:", configObj);
			let configObj = `{\n`;
			for (let key of Object.keys(formData)) {
				// console.log(key);
				if (typeof formData[ key ] === "string") {
					try {
						//element
						const ele = eval(formData[ key ]);
						configObj += `\t${key}: \`${formData[ key ]}\`, \n`;
					} catch (eleErr) {
						configObj += `\t${key}: \`${formData[ key ]}\`, \n`;
					}
				} else if (typeof formData[ key ] === "object") {
					// console.log(`***********\n${key}`);
					configObj += `\t${key}: ${exportIndividualJS(formData[ key ])}, \n`;
					// console.log(`\n***********`);
					// exportIndividualJSON(formData[key]);
				}
			}
			configObj += "}";

			const exportString = `const config = ${configObj}`;
			const jsonString = `data:text/javascript;chatset=utf-8,${encodeURIComponent(
				exportString
			)}`;
			const link = document.createElement("a");
			link.href = jsonString;
			link.download = `${formData.siteKey}${configKey !== undefined && configKey.length > 0 ? `-${configKey}` : ""
				}.js`;
			// link.download = "configurations.json";
			link.click();
		} else {
			// console.log("importing:", configObj, code);
			// setJsonData(configObj);
			let configObj = `{\n`;
			for (let key of Object.keys(code)) {
				// console.log(key);
				if (typeof code[ key ] === "string") {
					try {
						//element
						const ele = eval(code[ key ]);
						configObj += `\t${key}: \`${code[ key ]}\`, \n`;
					} catch (eleErr) {
						configObj += `\t${key}: \`${code[ key ]}\`, \n`;
					}
				} else if (typeof code[ key ] === "object") {
					configObj += `\t${key}: ${exportIndividualJS(code[ key ])}, \n`;
					// exportIndividualJSON(formData[key]);
				}
			}
			configObj += "}";
			return configObj;
		}
	};

	const downloadJSON = () => {
		// document.getElementById("viewMoreDropdown").style.display = "none";
		const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
			JSON.stringify(formData, null, 4)
		)}`;
		const link = document.createElement("a");
		link.href = jsonString;
		link.download = `${formData.siteKey}${configKey !== undefined && configKey.length > 0 ? `-${configKey}` : ""
			}.json`;
		// link.download = "configurations.json";
		link.click();
	};

	const resetJSON = () => {
		console.log("Configurations have been reset.");
		// displayInfo(
		// 	"Configurations have been reset. Default configurations have been applied."
		// );
		// document.getElementById("viewMoreDropdown").style.display = "none";
		viewJSONModalRef.current.hideModal();
		setSelectedAcc(null);
		setFormData(defaultConfig);
		setJsonData(exportAllJS("import", defaultConfig));
		validator(defaultConfig);
	};

	const convertJsonToJs = (code) => {
		console.log("code:", code);
	};

	const evaluateIndividual = (config) => {
		const configString = {};
		for (let conf in config) {
			// console.log(config[conf], typeof config[conf]);
			if (typeof config[ conf ] === "function") {
				configString[ `${conf}` ] = config[ conf ].toString();
			} else if (typeof config[ conf ] === "boolean") {
				configString[ `${conf}` ] = config[ conf ].toString();
			} else if (typeof config[ conf ] === "number") {
				configString[ `${conf}` ] = config[ conf ].toString();
			} else if (typeof config[ conf ] === "object") {
				console.log("config[conf]:", conf, config[ conf ], typeof config[ conf ]);
				if (config[ conf ]) {
					// if (config[conf].id !== undefined && config[conf].id.length > 0) {
					// 	configString[
					// 		`${conf}`
					// 	] = `document.getElementById("${config[conf].id}")`;
					// } else if (config[conf].className !== undefined) {
					// 	// console.log("config[conf] className:", config[conf]);
					// 	configString[`${conf}`] = `document.querySelector(".${config[
					// 		conf
					// 	].className.replaceAll(" ", ".")}")`;
					// } else {
					configString[ `${conf}` ] = JSON.stringify(config[ conf ]);
					// }
				}
			} else if (typeof config[ conf ] === "string") {
				configString[ `${conf}` ] = config[ conf ];
			}
		}
		// console.log(configString);
		return configString;
	};

	const evaluateAll = (configs) => {
		const stringifiedConfig = {};
		for (let config in configs) {
			console.log(config, ":", configs[ config ], typeof configs[ config ]);
			if (typeof configs[ config ] === "string") {
				stringifiedConfig[ `${config}` ] = configs[ config ];
			} else if (typeof configs[ config ] === "object") {
				stringifiedConfig[ `${config}` ] = evaluateIndividual(configs[ config ]);
			}
		}
		// console.log(
		// 	"stringifiedConfig:",
		// 	JSON.stringify(stringifiedConfig, null, 4)
		// );
		return JSON.stringify(stringifiedConfig, null, 4);
	};

	const applyImportedCode = (code) => {
		console.log("code type:", typeof code);
		try {
			const parsedCode = JSON.parse(code);
			setFormData(parsedCode);
			validator(parsedCode);
			// setJsonData();
			setSelectedAcc(null);
			// console.log("parsedCode");
		} catch (err) {
			const validatedCode = eval(`(${code})`);
			const parsedCode = evaluateAll(validatedCode);
			setFormData(JSON.parse(parsedCode));
			validator(JSON.parse(parsedCode));
			// setJsonData();
			setSelectedAcc(null);
			// console.log("validatedCode");
		}
	};

	const inputFileChange = (e) => {
		const jsonFile = e.target.files[ 0 ];
		let encodedData;
		let fileReader = new FileReader();
		fileReader.readAsDataURL(jsonFile);
		fileReader.onload = (e) => {
			try {
				encodedData = e.target.result.replace(
					"data:application/json;base64,",
					""
				);
				// console.log("typeof atob:", typeof window.atob(encodedData));

				exportAllJS("import", window.atob(encodedData));
				setJsonData(
					exportAllJS("import", JSON.parse(window.atob(encodedData)))
				);
				// convertJsonToJs(window.atob(encodedData));
				// setJsonData(window.atob(encodedData));
				// setFormData(JSON.parse(window.atob(encodedData)));
				// validator(JSON.parse(window.atob(encodedData)));
				// console.log("encodedData:", JSON.parse(window.atob(encodedData)));
				setSelectedAcc(null);
			} catch (err) {
				// displayError("File Type does not seem to be in the form of .json");

				e.target.value = "";
				return;
			}
		};
		e.target.value = "";
	};

	const testApiCall = () => {
		const customConfig = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		axios.post(
			"http://localhost:5050/bundleScripts",
			JSON.stringify(
				{
					config: formData,
					version: 'v2.0.38'
				},
				null,
				4
			),
			customConfig
		).then((response) => {
			console.log('response from testApi', response);
			// chrome.tabs.query(
			// 	{ active: true, currentWindow: true },
			// 	(tabs) => {
			// 		chrome.tabs.sendMessage(tabs[ 0 ].id, {
			// 			message: "apply_changes",
			// 			config: formData
			// 		});
			// 	}
			// );
		})
	}

	return (
		<div className="formContent">
			<div className="components" id="components">
				{selectedAcc == null && (
					<div className="notSelected">
						<span className="logo"></span>Select any configuration and edit the
						values. Click on 'Apply Changes' to update the demo site with the
						new values.
						<div className="instructions">
							Instructions:
							<ol>
								<li>Click on any of the icons to view the configurations.</li>
								<li>
									To apply custom configurations, change any of the
									configuration.
								</li>
								<li>
									Click on "Apply Changes" button to apply the configurations to
									the RHS.
								</li>
								<li>
									To publish the configurations, click on "More Options" -
									"Upload to CDN", and get two unique URLs - one to the Builder
									site and one to the Preview site.
								</li>
							</ol>
						</div>
					</div>
				)}

				{formConfigs.map((formConfig = {}, i) => {
					return (
						<>
							{selectedAcc === i && (
								<div className="component" key={i}>
									{/* {console.log(
										formConfig.moduleKey
											? formData[formConfig.moduleKey]
											: formData
									)} */}
									<div className="header">
										<div className="name">{formConfig.moduleName}</div>
										<div className="desc">{formConfig.moduleDesc}</div>
									</div>
									<FormWrapper
										fsCodeEditorData={fsCodeEditorData}
										setFSCodeEditorData={setFSCodeEditorData}
										updateFormData={updateFormData}
										moduleConfig={formConfig}
										formData={
											formConfig.moduleKey
												? formData[ formConfig.moduleKey ]
												: formData
										}
									/>
								</div>
							)}
						</>
					);
				})}
				<div className="btnSection">
					<InlineModal
						activatorAction="click"
						className="viewMoreDropdown"
						halign="left"
						isModalOpen={false}
					// onModalStateChange={function noRefCheck() {}}
					>
						<InlineModalActivator>
							<div>More Options</div>
						</InlineModalActivator>
						<InlineModalBody>
							<div
								className="viewCode"
								onClick={() => {
									setSelectedAcc(null);
									viewJSONModalRef.current.showModal();
								}}
							>
								<span></span>
								View Code
							</div>

							<div
								className="uploadToCDN"
								onClick={() => {
									// document.getElementById("viewMoreDropdown").style.display =
									// 	"none";
									confirmModalRef.current.showModal();
								}}
							>
								<span></span>
								Create Demo Site
							</div>
						</InlineModalBody>
					</InlineModal>
					<button
						id="applyBtn"
						onClick={() => {
							// validator(formData);
							testApiCall()
							// console.log('button clicked')
							// chrome.tabs.query(
							// 	{ active: true, currentWindow: true },
							// 	(tabs) => {
							// 		chrome.tabs.sendMessage(tabs[0].id, {
							// 			message: "apply_changes",
							// 			config: formData
							// 		});
							// 	}
							// );
						}}
						className="RCB-btn-primary"
					>
						Apply Changes
					</button>
				</div>
			</div>

			{/* <Modal
				title="Create Demo Site"
				ref={confirmModalRef}
				showClose={true}
				className="confirmModal"
				onClose={() => {
					setPublishPopUp(false);
					setCustomFileNameBool("NO");
					setCustomFileName(
						configKey !== undefined && configKey.length > 0 ? configKey : ""
					);
					// setCustomFileNameBool(false);
					// setCustomFileName(configKey.length > 0 ? configKey : "");
				}}
			>
				{!publishPopUp && (
					<div>
						<div className="confirm-modal-body">
							Are you sure you want to create demo site?
							
							{siteKey !== undefined && configKey !== undefined ? (
								<>
									
									<CustomRadio
										appearance="block"
										className="fileSaveName"
										// label="Save configurations under new filename?"
										name="fileSaveName"
										options={[
											{
												id: "NO",
												name: "Overwriting existing configurations.",
											},
											{
												id: "YES",
												name: "Create new demo site with these configurations.",
											},
										]}
										value={customFileNameBool}
										defaultValue={"NO"}
										// checked={customFileName == "NO"}
										onChange={(val) => {
											setCustomFileNameBool(val);
										}}
									/>
									{customFileNameBool === "YES" && (
										<CustomInput
											name="customFileName"
											label="Enter the filename:"
											className="customFileName"
											defaultValue={configKey}
											// defaultValue={
											// 	customFileNameBool === "NO" ? `${configKey}` : ""
											// }
											value={customFileName}
											onChange={(val) => {
												// console.log(val);
												setCustomFileName(val.replaceAll(" ", "-"));
											}}
											readOnly={customFileNameBool === "NO" ? true : false}
										/>
									)}
								</>
							) : (
								<CustomInput
									name="customFileName"
									label="Enter the filename:"
									onChange={(val) => {
										setCustomFileName(val.replaceAll(" ", "-"));
									}}
									value={customFileName}
									defaultValue={customFileName}
								/>
							)}
							<div className="confirmFileName">
								<div>
									The preview of your demo site would be at: <br />
								</div>
								<div>
									<span className="icon"></span>
									<span>
										http://localhost:3030/preview/{formData.siteKey}/
										{customFileName}
									</span>
								</div>
							</div>
							{customFileNameBool === "NO" && (
								<div className="warning">
									<div className="iconWrapper">
										<div className="icon"></div>
									</div>
									<div className="message">
										If a file with the same name exists, the content of this
										file will be overwritten with these configurations.
									</div>
								</div>
							)}
						</div>
						<div className="modal-footer">
							<Button
								appearance="link"
								className="cancel"
								onClick={() => {
									setPublishPopUp(false);
									confirmModalRef.current.hideModal();
									setCustomFileName(
										configKey !== undefined && configKey.length > 0
											? configKey
											: ""
									);
								}}
							>
								Cancel
							</Button>
							<Button
								appearance="primary"
								className="publish-configs"
								onClick={() => {
									if (customFileName.length > 0) {
										handlePublish();
									} else {
										// displayError("Filename must have 1 or more characters.");
										return;
									}
								}}
							>
								Create Demo Site
							</Button>
						</div>
					</div>
				)}
				{publishPopUp && (
					<div className="confirm-modal-body">
						Publishing...
						<div className="loading">
							<img
								src="https://i.pinimg.com/originals/49/23/29/492329d446c422b0483677d0318ab4fa.gif"
								alt="Loading"
							></img>
						</div>
					</div>
				)}
			</Modal> */}
			{/* <Modal
				title={
					publishStatus == "true"
						? "Publish Successful"
						: "Publish Unsuccessful"
				}
				ref={publishSuccessModalRef}
				showClose={true}
				className="publishSuccess"
				onClose={() => {
					setPublishStatus(false);
				}}
			>
				{publishStatus == true ? (
					<div>
						<div className="confirm-modal-body">
							The demo site with these configurations can now be visited at:
							<div className="links">
								<div className="builder">
									<Input
										id="builder-cdn-link"
										name="builder-cdn-link"
										readOnly
										label="Link to Builder site:"
										defaultValue={publishedBuilderLink}
									/>
									<div
										id="copyIcon-builder"
										className="copyIcon"
										onClick={() => {
											copyPublishedLink("builder-cdn-link", "copyIcon-builder");
										}}
									></div>
									<a
										id="openNewTab"
										className="openNewTab"
										href={publishedBuilderLink}
										target="_blank"
									></a>
								</div>
								<div className="preview">
									<Input
										id="preview-cdn-link"
										name="preview-cdn-link"
										readOnly
										label="Link to Preview Site:"
										defaultValue={publishedPreviewLink}
									/>
									<div
										id="copyIcon-preview"
										className="copyIcon"
										onClick={() => {
											copyPublishedLink("preview-cdn-link", "copyIcon-preview");
										}}
									></div>
									<a
										id="openNewTab"
										className="openNewTab"
										href={publishedPreviewLink}
										target="_blank"
									></a>
								</div>
							</div>
							<div className="info">
								Validation of the configs might take upto 5 minutes in the
								server. So if the configurations don't seem to be applied, try
								again after some time.
							</div>
						</div>
						<div className="modal-footer">
							<Button
								appearance="link"
								className="cancel"
								onClick={() => {
									setPublishStatus(false);
									publishSuccessModalRef.current.hideModal();
								}}
							>
								Close
							</Button>
						</div>
					</div>
				) : (
					<div>
						<div className="confirm-modal-body">
							Could not publish the configurations. Please try again later.
						</div>
						<div className="modal-footer">
							<Button
								appearance="link"
								className="cancel"
								onClick={() => {
									setPublishStatus(false);
									publishSuccessModalRef.current.hideModal();
								}}
							>
								Close
							</Button>
						</div>
					</div>
				)}
			</Modal> */}
			<Modal
				title="Configurations Code"
				ref={viewJSONModalRef}
				showClose={true}
				className="configModal"
				onClose={() => { }}
			>
				<div className="confirm-modal-body">
					<div className="btnSection">
						<Button
							appearance="primary"
							onClick={() => {
								inputJSONFile.current.click();
							}}
						>
							Import JSON file
						</Button>
						<input
							type="file"
							onChange={inputFileChange}
							ref={inputJSONFile}
							style={{ display: "none" }}
						/>
						<Button appearance="primary" onClick={() => exportAllJS("export")}>
							Download as JS
						</Button>
						<Button appearance="primary" onClick={() => downloadJSON()}>
							Download as JSON
						</Button>
						<Button appearance="primary" onClick={() => copyJSON()}>
							Copy Code
						</Button>
						<Button appearance="primary" onClick={() => resetJSON()}>
							Reset Code
						</Button>
					</div>
					<div className="formjson" id="formjson">
						<CodeMirror
							// readOnly={true}
							id="jsonCode"
							className="jsonCode"
							value={jsonData}
							// value={exportAllJS("import", formData)}
							// value={JSON.stringify(formData, null, 4)}
							placeholder="Insert code here..."
							height="100%"
							width="100%"
							extensions={[ javascript({ json: true }) ]}
							onChange={(code) => setJsonData(code)}
						/>
					</div>
				</div>
				<div className="modal-footer">
					{/* <Button
						appearance="secondary"
						className="export"
						onClick={() => exportAllJS("export")}
					>
						<span></span>Export as JS
					</Button>
					<Button
						appearance="secondary"
						className="download"
						onClick={() => downloadJSON()}
					>
						<span></span>Download as JSON
					</Button>
					<Button
						appearance="secondary"
						className="copy"
						onClick={() => copyJSON()}
					>
						<span></span>Copy
					</Button> */}
					<Button
						appearance="primary"
						className="update-json"
						onClick={() => {
							applyImportedCode(jsonData);
							viewJSONModalRef.current.hideModal();
						}}
					>
						Close
					</Button>
				</div>
			</Modal>
			<Modal
				title="Import Code"
				ref={importCodeModalRef}
				showClose={true}
				className="importCode"
				onClose={() => {
					// setCustomFileNameBool(false);
					// setCustomFileName(configKey.length > 0 ? configKey : "");
					// setJsonData();
				}}
			>
				<div className="confirm-modal-body">
					<div className="importFile">
						<Button
							appearance="primary"
							onClick={() => {
								inputJSONFile.current.click();
							}}
						>
							Import a JSON file
						</Button>
						<input
							type="file"
							onChange={inputFileChange}
							ref={inputJSONFile}
							style={{ display: "none" }}
						/>
					</div>
					OR
					<div className="importCodeEditor">
						<label className="RCB-form-el-label" htmlFor="importCodeMirror">
							Enter Code here:
						</label>
						<CodeMirror
							name="importCodeMirror"
							id="importCodeMirror"
							className="importCodeMirror"
							value={jsonData}
							placeholder="Insert code here..."
							height="100%"
							width="100%"
							extensions={[ javascript({ json: true }) ]}
							onChange={(code) => setJsonData(code)}
						/>
					</div>
				</div>
				<div className="modal-footer">
					<Button
						appearance="link"
						className="download"
						onClick={() => {
							importCodeModalRef.current.hideModal();
							// setJsonData();
						}}
					>
						Cancel
					</Button>

					<Button
						appearance="primary"
						className="update-json"
						onClick={() => {
							applyImportedCode(jsonData);
							importCodeModalRef.current.hideModal();
						}}
					>
						Update
					</Button>
				</div>
			</Modal>
		</div>
	);
};

export default FormContent;
