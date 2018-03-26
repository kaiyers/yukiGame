let searchURL = window.location.search;
searchURL = searchURL.substring(1, searchURL.length);
args = searchURL.split("&");
let workspacePath = args[0].split("=")[1];
let proType = args[1].split("=")[1];
let langIndex = args[2].split("=")[1];
console.log(workspacePath, proType, langIndex);

let langConfig = require("./../lang/extension.js").Lang.panel;

//面板的语言包
function getPanelLang(index) {
    return langConfig[index][langIndex];
}

function lang(text) {
    var res;
    if (arguments.length < 2) {
        res = text;
    } else {
        for (var i = 0, n = arguments.length; i < n; i++) {
            text = text.replace("{" + i + "}", arguments[i + 1]);
        }
        res = text;
    }
    return res;
}



// const {spawn} = require("child_process");
const child_process = require("child_process");
const spawn = child_process.spawn;
const {remote} = require("electron");
const {shell} = require('electron');
const path = require("path");
const fs = require("fs");
const PfSelVal = ["web", "wxgame", "qqwanyiwan"];
const DftJsonType = "json,atlas,ls,lh,lmat,lav";
const KeyStore = "pub2Obj";
const PathPubSet = path.join(workspacePath, ".laya", "pubset.json");

init();

function init() {
	initPanelLang();
	initPanel();

	let pub2Obj = getStorageItem();
	let pf = pub2Obj.pf || 0;
	selPf.selectedIndex = pf;
	setPanel(pf, pub2Obj[pf]);

	selPf.onchange = function(e) {
		pub2Obj = getStorageItem();
		pf = selPf.selectedIndex;
		setPanel(pf, pub2Obj[pf]);
    }

    btnBrowseSrc.onmousedown = function(e) {
        remote.dialog.showOpenDialog({
            properties: ["openDirectory", 'createDirectory']
        }, function(p) {
            if (p) {
                inputSrcDir.value = p[0];
            }
        });
    }

    btnBrowsePub.onmousedown = function(e) {
        remote.dialog.showOpenDialog({
            properties: ["openDirectory", 'createDirectory']
        }, function(p) {
            if (p) {
                inputPubDir.value = p[0];
            }
        });
    }

    btnBrowseEx.onmousedown = function(e) {
        remote.dialog.showOpenDialog({
            properties: ["openDirectory", 'createDirectory']
        }, function(p) {
            if (p) {
            	let pv = p[0];
            	let exValue = inputExDir.value;
            	if (-1 === exValue.indexOf(pv)) {
                	inputExDir.value += pv + ";";
            	}
            }
        });
    }

	btnPub.onclick = function() {
		console.log("btnPub onclicked.");
		publish();
	}

	btnOpen.onclick = function() {
		console.log("btnOpen onclicked.");
		shell.openExternal(inputPubDir.value);
	}

	linkHelp.onclick = function() {
		shell.openExternal("https://ldc.layabox.com/doc/?nav=zh-as-2-0-4");
	}

	howToUse.onclick = function() {
		shell.openExternal("https://ldc.layabox.com/doc/?nav=zh-as-2-0-5");
	}
}

function initPanelLang() {
	spanPf.innerHTML = getPanelLang(247);
	setSelPfOpts();
	imgHelp.title = getPanelLang(251);
	spanSrcDir.innerHTML = getPanelLang(252);
	inputSrcDir.placeholder = getPanelLang(253);
	btnBrowseSrc.innerHTML = getPanelLang(22);
	spanPubDir.innerHTML = getPanelLang(254);
	inputPubDir.placeholder = getPanelLang(255);
	btnBrowsePub.innerHTML = getPanelLang(22);
	spanExDir.innerHTML = getPanelLang(256);
	inputExDir.placeholder = getPanelLang(257);
	btnBrowseEx.innerHTML = getPanelLang(22);
	spanMergeJs.innerHTML = getPanelLang(258);
	spanCompressPng.innerHTML = getPanelLang(259);
	spanQualityPngLow.innerHTML = getPanelLang(260);
	spanQualityPngHigh.innerHTML = getPanelLang(261);
	spanCompressJpg.innerHTML = getPanelLang(262);
	spanQualityJpg.innerHTML = getPanelLang(263);
	spanCompressJson.innerHTML = getPanelLang(264);
	spanSuffix.innerHTML = getPanelLang(265);
	spanCompressJs.innerHTML = getPanelLang(266);
	spanEnableVer.innerHTML = getPanelLang(267);
	howToUse.innerHTML = getPanelLang(268);
	btnPub.innerHTML = getPanelLang(116);
	spanWaiting.innerHTML = getPanelLang(269);
	spanResult.innerHTML = getPanelLang(270);
	btnOpen.innerHTML = getPanelLang(271);
}

function setSelPfOpts() {
	let opts = [getPanelLang(248), getPanelLang(249), getPanelLang(250)];
	let len = selPf.options.length;
	for (let i = 0; i < len; ++i) {
		selPf.options[i].innerHTML = opts[i];
	}
}

function publish() {
	showWaiting(true);
	restorePanelInfo();

	preCompile(function() {
		const paramFilePath = generatePackParamFile();
		exePack(paramFilePath, function(ret) {
			if ("as" === proType && selPf.selectedIndex==2) {
				const pathSrc = path.join(getCrtSrcPath(), "LayaUISample.max.js");
				const pathDest = path.join(workspacePath, ".laya", "LayaUISample.max.js");
				if (fs.existsSync(pathDest)) {
					fs.renameSync(pathDest, pathSrc);
				}
				const pathFile = path.join(getCrtSrcPath(), "laya.js");
				if (fs.existsSync(pathFile)) {
					fs.unlinkSync(pathFile);
				}
			}
			//showWaiting(false);
			if (ret) {
				alert("运行过程中有报错，请确认：" + ret);
			} else {
				dataOutput("发布成功！");
			}
		});
	});
}

function preCompile(cb) {
	if ("as" !== proType || selPf.selectedIndex!==2) {
		cb && cb();
		return;
	}
	const pathSrc = path.join(getCrtSrcPath(), "LayaUISample.max.js");
	const pathDest = path.join(workspacePath, ".laya", "LayaUISample.max.js");
	if (fs.existsSync(pathSrc)) {
		fs.renameSync(pathSrc, pathDest);
	}

	compilePro(function() {
		cb && cb();
	});
}

function compilePro(cb) {
	let ret = 0;
	const pathLayajs = path.join(workspacePath, ".laya", "astool", "layajs");
	let args = [path.join(workspacePath, ".actionScriptProperties") + ";iflash=false;windowshow=false;chromerun=false;quickcompile=true;outlaya=true"];
	let layajs = spawn(pathLayajs, args);

	layajs.stdout.on('data', function (data) {
		console.log(`stdout: ${data}`);
	});

	layajs.stderr.on('data', function (data) {
		console.log(`stderr: ${data}`);
		ret = 1;
	});

	layajs.on('close', function (code) {
		console.log(`child process exited with code ${code}`);
		ret = code;
		cb && cb(code);
	});
	return ret;
}

function initPanel() {
	showWaiting(false);
	// inputSrcDir.value = panelInfo.sourcePath || path.join(workspacePath, "src");
	// inputPubDir.value = panelInfo.outPath || path.join(workspacePath, "bin");
}

function getStorageItem() {
	if (!fs.existsSync(PathPubSet)) {
		return {};
	}

	let fileContent = fs.readFileSync(PathPubSet);
	// let pub2Obj = localStorage.getItem(KeyStore);
	let pub2Obj = fileContent ? JSON.parse(fileContent) : {};
	return pub2Obj;
}

function getPackModPath() {
	return path.join(remote.app.getAppPath(), "out", "layarepublic", "LayaAirProjectPack", "LayaAirProjectPack.max.js");
}

function getPackParamFilePath() {
	return path.join(remote.app.getPath("userData"), "pubParam.json");
}

function getParamObj() {
	let ret = {};
	ret.sourcePath = inputSrcDir.value;
	ret.outPath = inputPubDir.value;
	ret.pngQualityLow = inputCompressPngLow.value;
	ret.pngQualityHigh = inputCompressPngHigh.value;
	ret.jpgQuality = inputCompressJpg.value;
	ret.mergeJs = cbMergeJs.checked;
	ret.compressPng = cbCompressPng.checked;
	ret.compressJpg = cbCompressJpg.checked;
	ret.compressJson = cbCompressJson.checked;
	ret.jsontypes = inputJsonTypes.value;
	ret.compressJs = cbCompressJs.checked;
	ret.enableVersion = cbEnableVer.checked;
	ret.excludeFiles = inputExDir.value;
	ret.publishType = selPf.selectedIndex;
	ret.projectType = proType;
	return ret;
}

function getPanelInfo() {
	let ret = getParamObj();
	return ret;
}

function getDftHtmlDir() {
	let ret = "";
	switch (proType) {
		case "as":
			ret = path.join(workspacePath, "bin", "h5");
			break;
		case "js":
		case "ts":
			ret = path.join(workspacePath, "bin");
			break;
		default:
			console.log("Unexpected Project Type: " + proType);
	}
	return ret;
}

function getDftPublicDir(pf) {
	return path.join(workspacePath, "release", PfSelVal[pf]);
}

function setPanel(pf, panelInfo) {
	if (!panelInfo) {
		if (pf === 1) {
			cbMergeJs.checked = true;
			cbMergeJs.disabled = true;
		} else {
			cbMergeJs.checked = false;
			cbMergeJs.disabled = false;
		}
	
		inputSrcDir.value = getDftHtmlDir();
		inputPubDir.value = getDftPublicDir(pf);
		inputJsonTypes.value = DftJsonType;
		return;
	}

	// selPf.value = panelInfo.pf;
	// inputSrcDir.value = panelInfo.sourcePath;
	// inputPubDir.value = panelInfo.outPath;
	if (pf === 1) {
		cbMergeJs.checked = true;
		cbMergeJs.disabled = true;
	} else {
		cbMergeJs.checked = panelInfo.mergeJs;
		cbMergeJs.disabled = false;
	}
	
	inputSrcDir.value = panelInfo.sourcePath || getDftHtmlDir();
	inputPubDir.value = panelInfo.outPath || getDftPublicDir(pf);
	inputCompressPngLow.value = panelInfo.pngQualityLow;
	inputCompressPngHigh.value = panelInfo.pngQualityHigh;
	inputCompressJpg.value = panelInfo.jpgQuality;
	// cbForce.checked = panelInfo.force;
	cbCompressPng.checked = panelInfo.compressPng;
	cbCompressJpg.checked = panelInfo.compressJpg;
	cbCompressJson.checked = panelInfo.compressJson;
	inputJsonTypes.value = panelInfo.jsontypes || DftJsonType;
	cbCompressJs.checked = panelInfo.compressJs;
	cbEnableVer.checked = panelInfo.enableVersion;
	inputExDir.value = panelInfo.excludeFiles;
}

function getCrtSrcPath() {
	return inputSrcDir.value || getDftHtmlDir();
}

function generatePackParamFile() {
	const filePath = getPackParamFilePath();
	const paramObj = getParamObj();
	const fileContent = JSON.stringify(paramObj);
	fs.writeFileSync(filePath, fileContent);
	return filePath;
}

function restorePanelInfo() {
	const pub2Obj = getStorageItem();
	const pf = selPf.selectedIndex;
	pub2Obj[pf] = getParamObj();
	pub2Obj["pf"] = pf;
	const infoStr = JSON.stringify(pub2Obj);
	fs.writeFileSync(PathPubSet, infoStr);
	// localStorage.setItem(KeyStore, infoStr);
	return pub2Obj;
}

function exePack(paramFilePath, cb) {
	let ret = 0;
	if (!fs.existsSync(paramFilePath)) {
		ret = 1;
		alert("指定的参数文件不存在：" + paramFilePath);
		return ret;
	}
	const exePath = getPackModPath();
	// const LayaAirProjectPack = spawn("node", [exePath, 'paramFile=' + paramFilePath]);

	var LayaAirProjectPack = child_process.fork(exePath, ['paramFile=' + paramFilePath], {
		silent: true
	});

	let outputStr = "";
	LayaAirProjectPack.stdout.on('data', (data) => {
		outputStr += data + "";
		console.log(`stdout: ${data}`);
	});

	let errOutputStr = ""
	LayaAirProjectPack.stderr.on('data', (data) => {
		errOutputStr += data + "";
		console.log(`stderr: ${data}`);
	});

	LayaAirProjectPack.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
		ret = code;
		filterInfo(outputStr);
		filterErrInfo(errOutputStr);
		cb && cb(code);
	});
}

function filterErrInfo(data) {
	if (!data) return;
	const dataLineArr = data.split("\n");
	for (let i = 0; i < dataLineArr.length; ++i) {
		filterErrLine(dataLineArr[i]);
	}
}

function filterErrLine(lineStr) {
	if (!lineStr) return;
	if (0 === lineStr.indexOf("[xmldom warning]")) {
		cmnOutput(lineStr);
	} else if (0 === lineStr.indexOf("@#[line:")) {
		cmnOutput(lineStr);
	} else {
		errOutput(lineStr);
	}
}

function filterInfo(data) {
	if (!data) return;
	clearText();
	const dataLineArr = data.split("\n");
	for (let i = 0; i < dataLineArr.length; ++i) {
		filterLine(dataLineArr[i]);
	}
}

function filterLine(lineStr) {
	if (!lineStr) return;
	if (0 === lineStr.indexOf("[DATA]")) {
		cmnOutput(lineStr);
	} else if (0 === lineStr.indexOf("[ERR]")) {
		errOutput(lineStr);
	} else if (0 === lineStr.indexOf("[PROGRESS]")) {
		cmnOutput(lineStr);
	} else {
		cmnOutput(lineStr);
	}
}

function dataOutput(msg) {
	appendText(msg, '#00FF00');
	console.log(msg);
}

function errOutput(msg) {
	appendText(msg, '#FF0000');
	console.log(msg);
}

function cmnOutput(msg) {
	console.log(msg);
}

function plainOutput(msg) {
	appendText(msg, '#FFFFFF');
	console.log(msg);
}

function appendText(info, color, size) {
	divResult.style.display="block";
	divWaiting.style.display = "none";
	size && (size = 14);
	spanResult.innerHTML += `<font color='${color}' size='${size}'>${info}</font><br/>`;
}

function clearText() {
	spanResult.innerHTML = "";
}

function showWaiting(isShow) {
	// divWaiting.innerText = "";
	if (isShow) {	
		divWaiting.style.display = "block";	
		(divBgWait.style.display === "none") && (divBgWait.style.display = "block");
	} else {
		(!divBgWait.style.display || (divBgWait.style.display === "block")) && (divBgWait.style.display = "none");
	}
}
