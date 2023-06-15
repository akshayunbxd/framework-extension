import React, { useRef, useState } from "react";
import { Button } from "unbxd-react-components";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

import defaultConfig from "../inputJson/defaultConfig.json";
import "./code.scss";

const FormCode = (props) => {
	const {
		selectedAcc,
		setSelectedAcc,
		formData,
		setFormData,
		jsonData,
		setJsonData,
		siteKey,
		configKey
	} = props;

	const inputJSONFile = useRef(null);

	const inputFileChange = (e) => {
		const jsonFile = e.target.files[0];
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
				setFormData(JSON.parse(window.atob(encodedData)));
				// setJsonData(
				// 	exportAllJS("import", JSON.parse(window.atob(encodedData)))
				// );
				// convertJsonToJs(window.atob(encodedData));
				// setJsonData(window.atob(encodedData));
				// setFormData(JSON.parse(window.atob(encodedData)));
				// validator(JSON.parse(window.atob(encodedData)));
				// console.log("encodedData:", JSON.parse(window.atob(encodedData)));
				setSelectedAcc(null);
			} catch (err) {
				// displayError("File Type does not seem to be in the form of .json");
				console.log('err arrrrrr', err)
				e.target.value = "";
				return;
			}
		};
		e.target.value = "";
	};

	const exportIndividualJS = (code) => {
		let configObjInner = "\t{\n";
		for (let key of Object.keys(code)) {
			// console.log(key, typeof code[key]);
			if (typeof code[key] === "string") {
				// console.log("string:", key);
				try {
					const ele = JSON.parse(code[key]);
					// console.log("JSON.parse:", key);
					configObjInner += `\t\t${key}: ${code[key]}, \n`;
				} catch (arrErr) {
					try {
						//element
						const ele = eval(code[key]);
						// console.log("eval:", key, code[key]);
						configObjInner += `\t\t${key}: \`${code[key]}\`, \n`;
						// console.log("eval element:", key);
					} catch (eleErr) {
						try {
							//function
							const ele = eval("(" + code[key] + ")");
							// console.log("eval func:", key);
							configObjInner += `\t\t${key}: ${code[key]}, \n`;
							// console.log("eval function:", key);
						} catch (funcErr) {
							// console.log("not in eval:", key);
							configObjInner += `\t\t${key}: \`${code[key]}\`, \n`;
							// console.log("not in eval:", key);
						}
					}
				}
			} else if (typeof code[key] === "number") {
				configObjInner += `\t\t${key}: ${code[key].toString()}, \n`;
			} else if (typeof code[key] === "boolean") {
				configObjInner += `\t\t${key}: ${code[key].toString()}, \n`;
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
				if (typeof formData[key] === "string") {
					try {
						//element
						const ele = eval(formData[key]);
						configObj += `\t${key}: \`${formData[key]}\`, \n`;
					} catch (eleErr) {
						configObj += `\t${key}: \`${formData[key]}\`, \n`;
					}
				} else if (typeof formData[key] === "object") {
					// console.log(`***********\n${key}`);
					configObj += `\t${key}: ${exportIndividualJS(formData[key])}, \n`;
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
			link.download = `${formData.siteKey}${
				configKey !== undefined && configKey.length > 0 ? `-${configKey}` : ""
			}.js`;
			// link.download = "configurations.json";
			link.click();
		} else {
			// console.log("importing:", configObj, code);
			// setJsonData(configObj);
			let configObj = `{\n`;
			for (let key of Object.keys(code)) {
				// console.log(key);
				if (typeof code[key] === "string") {
					try {
						//element
						const ele = eval(code[key]);
						configObj += `\t${key}: \`${code[key]}\`, \n`;
					} catch (eleErr) {
						configObj += `\t${key}: \`${code[key]}\`, \n`;
					}
				} else if (typeof code[key] === "object") {
					configObj += `\t${key}: ${exportIndividualJS(code[key])}, \n`;
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
		link.download = `${formData.siteKey}${
			configKey !== undefined && configKey.length > 0 ? `-${configKey}` : ""
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
		// viewJSONModalRef.current.hideModal();
		setSelectedAcc(null);
		setFormData(defaultConfig);
		// setJsonData(exportAllJS("import", defaultConfig));
		// validator(defaultConfig);
	};

	const applyImportedCode = (code) => {
		console.log("code type:", typeof code, code);
		try {
			console.log("parsing...");
			const parsedCode = JSON.parse(code);
			setFormData(parsedCode);
			// validator(parsedCode);
			// setJsonData();
			setSelectedAcc(null);
			// console.log("parsedCode");
		} catch (err) {
			console.log("evaluating");
			const escapedCode = `{
				loader: {
					el: \`document.getElementById("loaderEl")\`
				}
			}`;
			let evalSub = new Function("a", "return " + escapedCode);
			console.log(evalSub(escapedCode));
			// console.log(new Function("return " + escapedCode)());
			// console.log("validatedCode:", validatedCode);
			// const validatedCode = eval(`(${code})`);
			// const parsedCode = evaluateAll(validatedCode);
			// setFormData(JSON.parse(parsedCode));
			// validator(JSON.parse(parsedCode));
			// setJsonData();
			// setSelectedAcc(null);
			// console.log("validatedCode");
		}
	};

	const copyJSON = () => {
		navigator.clipboard.writeText(JSON.stringify(formData, null, 4));
		// document.querySelector(".viewMoreDropdown").style.display = "none";
		viewJSONModalRef.current.hideModal();
		// console.log("Copied JSON!");
		// displaySuccess("Copied JSON!");
	};

	return (
		<div className="formCode">
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
					// value={jsonData}
					// value={exportAllJS("import", formData)}
					value={JSON.stringify(formData, null, 4)}
					placeholder="Insert code here..."
					height="100%"
					width="100%"
					extensions={[javascript({ json: true })]}
					onChange={(code) => {
						setFormData(JSON.parse(code));
						// setJsonData(code);
					}}
				/>
			</div>
		</div>
	);
};

export default FormCode;
