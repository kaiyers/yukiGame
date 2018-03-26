function activate(context)
{
    window.layainfobar = require(__dirname + path.sep + "popshowpanel.js");
    codeMain.popPanel = layainfobar;
    ipc.on("layaupdateeventpage", function()
    {
        (InnerVer !== "auto") && setTimeout(startupdate, 5000);
    })
    ipc.send("layaupdateevent");
    (InnerVer !== "auto") && setTimeout(startupdate, 5000);

    // 0:equal; 1:new>old; -1:new<old
    function compareVersion(oldVer, newVer) {
        if (oldVer === newVer) return 0;

        var oldArr = oldVer.split(".");
        var newArr = newVer.split(".");
        var oldLen = oldArr.length;
        var newLen = newArr.length;
        var len = (oldLen > newLen) ? oldLen : newLen;
        var oldTemp, newTemp;
        for (var i = 0; i < len; i++) {
            oldTemp = oldArr[i];
            newTemp = newArr[i];
            if (undefined === newTemp) return -1;
            if (undefined === oldTemp) return 1;
            
            if (oldTemp !== "" + parseInt(oldTemp)) {
                alert("Wrong Local Version Format.");
                // When local wrong, make it can be updated.
                return 1;
            }
            if (newTemp !== "" + parseInt(newTemp)) {
                alert("Wrong Remote Version Format.");
                // When remote wrong, make it can not be updated.
                return -1;
            }

            if (parseInt(newTemp) === parseInt(oldTemp)) {
                continue;
            } else if (parseInt(newTemp) > parseInt(oldTemp)) {
                return 1;
            } else {
                return -1;
            }
        }
        return 0;
    }

    function startupdate()
    {
        var popPanel = layainfobar
        var versionConfig = new XMLHttpRequest();
        var configVersion;
        versionConfig.open("GET", "http://ldc.layabox.com/download/LayaAir/versionconfig.json?" + Math.random());
        // versionConfig.open("GET", "http://10.10.20.34:8000/versionconfig.json?" + Math.random());
        versionConfig.onreadystatechange = function()
        {
            console.log("includes")
            if (versionConfig.readyState !== 4) return;
            if (versionConfig.status === 200)
            {
                window.configVersion = configVersion = JSON.parse(versionConfig.responseText);
                codeMain.mkdirsSync(path.join(remote.app.getPath("userData"), "layaversion"));
                configVersion.versionList = configVersion.versionList.reverse();
                if (codeMain.layaIDEVersion.includes("beta"))
                {
                    //测试版
                    if(!configVersion.betaVersion){
                        return
                    }
                    if (1 !== compareVersion(codeMain.localversion, configVersion.betaVersion))
                    {
                        return;
                    }
                    //url
                    if (process.platform === 'darwin')
                    {
                        configVersion.winpatchUrl = configVersion.betaMacUrl;
                        configVersion.winIdeUrl = configVersion.betaMacUrl;
                    }
                    else
                    {
                        configVersion.winpatchUrl = configVersion.betaWinUrl;
                        configVersion.winIdeUrl = configVersion.betaWinUrl;
                    }
                }
                else
                {
                    //正式版//url
                    if(!configVersion.releaseVersion){
                        return
                    }
                    if (1 !== compareVersion(codeMain.localversion, configVersion.releaseVersion))
                    {
                        return
                    }
                    if (process.platform === 'darwin')
                    {
                        configVersion.winpatchUrl = configVersion.macpatchUrl;
                        configVersion.winIdeUrl = configVersion.releaseMacUrl;
                    }
                    else
                    {
                        configVersion.winpatchUrl = configVersion.winpatchUrl;
                        configVersion.winIdeUrl = configVersion.releaseWinUrl;
                    }
                }
                if (0 === compareVersion(codeMain.localversion, configVersion.preVersion))
                {
                    //这里下载补丁
                    var exezippath = path.join(remote.app.getPath("userData"), "layaversion", path.basename(configVersion.winpatchUrl));
                    var downurl = configVersion.winpatchUrl;
                }
                else
                {
                    //下载整个版本
                    configVersion.winIdeUrl =configVersion.winIdeUrl||configVersion.winpatchUrl
                    var exezippath = path.join(remote.app.getPath("userData"), "layaversion", path.basename(configVersion.winIdeUrl));
                    var downurl = configVersion.winIdeUrl;
                }
                var request = require('request');

                function downloadFile(uri, filename, callback)
                {
                    var stream = fs.createWriteStream(filename);
                    request(uri).pipe(stream).on('close', callback);
                }

                downloadFile(downurl, exezippath, function()
                {
                    console.log(downurl + '下载完毕');
                    downIDE(exezippath)
                });
            }
        }

        versionConfig.send(null);
        versionConfig.onerror = function(e) {

        }

        function downIDE(exezippath)
        {
            if (process.platform === 'darwin')
            {
                var macpath = path.dirname(remote.app.getPath("exe"));
                macpath = path.dirname(macpath);
                macpath = path.dirname(macpath);
                var cmd = "sleep 2;unzip -o " + "\"" + exezippath + "\"" + " -d " + "\"" + macpath + "\"" + "&&" + "\"" + remote.app.getPath("exe") + "\"";
                var shpath = path.join(remote.app.getPath("userData"), "cmd.sh")
                fs.writeFileSync(shpath, cmd);
                childProcess.exec("chmod 755 " + "\"" + shpath + "\"", function(e, ee)
                {
                    console.log(e);
                    console.log(ee);
                });
                var pop = new popPanel.ShowPop([codeMain.panel[142][langindex], codeMain.panel[104][langindex], codeMain.panel[105][langindex]], codeMain.panel[46][langindex], function(e)
                {
                    if (e == codeMain.panel[104][langindex])
                    {
                        var updateSp = childProcess.spawn(
                           '/bin/sh',
                           ['-c', "\"" + shpath + "\""],
                           {}
                        );

                        // updateSp.stdout.on('data', (data) => {
                        //   console.log(`stdout: ${data}`);
                        // });

                        updateSp.stderr.on('data', (data) => {
                          console.log(`stderr: ${data}`);
                        });

                        updateSp.on('close', (code) => {
                          console.log(`子进程退出码：${code}`);
                        });
                        
                        // childProcess.exec("\"" + shpath + "\"", function(e, ee)
                        // {
                        //     console.log(e);
                        //     console.log(ee);
                        // });
                        setTimeout(function()
                        {
                            remote.app.exit(0);
                        }, 2000)

                    }
                    else if (e == codeMain.panel[105][langindex])
                    {
                        window.open("http://ldc.layabox.com/download/?type=layaairide")
                    }
                    else
                    {
                        pop.dispose()
                    }
                }, true);
            }
            else
            {
                var temppath = path.dirname(remote.app.getPath("exe"));
                setTimeout(function(e)
                {
                    try
                    {

                        copyfile(temppath, path.join(remote.app.getPath("userData"), "layaupdateloading"));
                        copyfile(path.join(temppath, "locales"), path.join(remote.app.getPath("userData"), "layaupdateloading", "locales"));
                        copyfile(path.join(temppath, "resources"), path.join(remote.app.getPath("userData"), "layaupdateloading", "resources"));
                        codeMain.copyDir(path.join(__dirname, "tools"), path.join(remote.app.getPath("userData"), "layaupdateloading"));
                        codeMain.copyFile(path.join(temppath, "resources", "electron.asar"), path.join(remote.app.getPath("userData"), "layaupdateloading", "resources"));
                        // codeMain.copyDir(path.join(temppath, "resources", "app", "out", "codeextension", "updateversion", "tools", "resources", "app", "out"), path.join(remote.app.getPath("userData"), "layaupdateloading", "resources", "app", "out"));
                    }
                    catch (e)
                    {
                        return
                    }
                    var pop = new popPanel.ShowPop([codeMain.panel[142][langindex], codeMain.panel[104][langindex], codeMain.panel[105][langindex]], codeMain.panel[46][langindex], function(e)
                    {
                        if (e == codeMain.panel[104][langindex])
                        {
                            childProcess.exec("\"" + path.join(remote.app.getPath("userData"), "layaupdateloading", "LayaAir.exe") + "\"" + " " + "\"" + remote.app.getPath("exe") + "\"" + "$$" + "\"" + exezippath + "\"", function(ee, eee, eeee) {});
                            remote.getCurrentWindow().hide();
                            setTimeout(function()
                            {
                                //缓冲时间 防止退出更新程序启动不起来。
                                remote.app.exit(0);
                            }, 4000)
                        }
                        else if (e == codeMain.panel[105][langindex])
                        {
                            window.open("http://ldc.layabox.com/download/?type=layaairide")
                        }
                        else
                        {
                            pop.dispose()
                        }
                    }, true);
                }, 5000)
            }
        }

        function copyfile(from, to)
        {
            mkdirsSyncLaya(to)
            var readDir = fs.readdirSync;
            var stat = fs.statSync;
            if (stat(from).isFile())
            {
                mkdirsSyncLaya(to);
                fs.writeFileSync(to + path.sep + path.basename(from), fs.readFileSync(from));
                return
            }
            var copDir = function(src, dst)
            {
                var paths = fs.readdirSync(src);
                paths.forEach(function(pathLaya)
                {
                    var _src = src + path.sep + pathLaya;
                    var _dst = dst + path.sep + pathLaya;
                    var isDir = stat(_src);
                    if (isDir.isFile())
                    {
                        fs.writeFileSync(_dst, fs.readFileSync(_src));
                    }
                })
            }

            function mkdirsSyncLaya(dirname, mode)
            {
                console.log(dirname);
                if (fs.existsSync(dirname))
                {
                    return true;
                }
                else
                {
                    if (mkdirsSyncLaya(path.dirname(dirname), mode))
                    {
                        fs.mkdirSync(dirname, mode);
                        return true;
                    }
                }
            }

            // 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
            var exists = function(src, dst, callback)
            {
                mkdirsSyncLaya(dst);
                callback(src, dst);
            };
            // 复制目录
            exists(from, to, copDir);
        }
    }
    window.layaUnzipFileHandler = function(unzipurl, filepath, callbackHandler, errHandler)
    {
        unzipurl = "\"" + unzipurl + "\"";
        var unzipexepath = "\"" + path.join(__dirname, "tools", "unzip.exe") + "\""

        if (process.platform === 'darwin')
        {
            var cmd = "unzip -o " + unzipurl + " -d " + "\"" + filepath + "\"";
            childProcess.exec(cmd, callbackHandler, errHandler);
        }
        else
        {
            var cmd = unzipexepath + " -o " + unzipurl + " -d " + "\"" + filepath + "\"";
            childProcess.exec(cmd, callbackHandler, errHandler);
        }
    }
}
exports.activate = activate;

function deactivate()
{}
exports.deactivate = deactivate;