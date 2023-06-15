import React, { useState } from "react";

import "./builder.scss";
import FormIcons from "./FormIcons";
import FormContent from "./FormContent";
import FormCode from "./FormCode";

import authConfig from "../config/formConfig/authentication";
import searchBoxConfig from "../config/formConfig/searchBox";
import productsConfig from "../config/formConfig/products";
import facetsConfig from "../config/formConfig/facets";
import paginationConfig from "../config/formConfig/pagination";
import pageSizeConfig from "../config/formConfig/pageSize";
import sortingConfig from "../config/formConfig/sorting";
import productViewConfig from "../config/formConfig/productView";
import breadcrumbsConfig from "../config/formConfig/breadcrumbs";
import spellCheckConfig from "../config/formConfig/spellCheck";
import bannerConfig from "../config/formConfig/banners";
import variantsConfig from "../config/formConfig/variants";
import swatchesConfig from "../config/formConfig/swatches";
import noResultsConfig from "../config/formConfig/noResults";
import loaderConfig from "../config/formConfig/loader";
import othersConfig from "../config/formConfig/others";

import defaultConfig from "../inputJson/defaultConfig.json";

const FormBuilder = (props) => {
	const {
		setValidatedConfig,
		validatedConfig,
		validator,
		configKey,
		siteKey,
		viewConfig,
	} = props;

	const [formData, setFormData] = useState(defaultConfig);
	const [jsonData, setJsonData] = useState();
	const [selectedAcc, setSelectedAcc] = useState(null);
	const formConfigs = [
		authConfig,
		searchBoxConfig,
		productsConfig,
		facetsConfig,
		paginationConfig,
		pageSizeConfig,
		sortingConfig,
		productViewConfig,
		breadcrumbsConfig,
		spellCheckConfig,
		bannerConfig,
		variantsConfig,
		swatchesConfig,
		noResultsConfig,
		loaderConfig,
		othersConfig,
	];

	let showContent = (i) => {
		if (selectedAcc == i) {
			return setSelectedAcc(null);
		}
		setSelectedAcc(i);
	};

	// console.log("Rendered formBuilder");

	return (
		<div className="formBuilder">
			{viewConfig && (
				<FormIcons
					formConfigs={formConfigs}
					showContent={showContent}
					selectedAcc={selectedAcc}
				/>
			)}
			{viewConfig && (
				<FormContent
					formConfigs={formConfigs}
					selectedAcc={selectedAcc}
					setSelectedAcc={setSelectedAcc}
					setValidatedConfig={setValidatedConfig}
					validatedConfig={validatedConfig}
					validator={validator}
					siteKey={siteKey}
					configKey={configKey}
					formData={formData}
					setFormData={setFormData}
					jsonData={jsonData}
					setJsonData={setJsonData}
				/>
			)}
			{!viewConfig && (
				<FormCode
					selectedAcc={selectedAcc}
					setSelectedAcc={setSelectedAcc}
					formData={formData}
					siteKey={siteKey}
					configKey={configKey}
					setFormData={setFormData}
					jsonData={jsonData}
					setJsonData={setJsonData}
				/>
			)}
		</div>
	);
};

export default FormBuilder;
