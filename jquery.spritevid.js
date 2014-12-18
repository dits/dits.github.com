/*
* @fileOverview SpriteVid jQuery Plugin
* @version 0.0.1
*
* @author Mark Mankarious http://www.github.com/markmanx
* @see https://github.com/markmanx/SpriteVid
*
* Copyright (c) 2014 Mark Mankarious
* Released under GPL Version 2 licenses.
* */

(function ($) {
    var defaults = {
        sheetsFolderUrl: "",
        filenameFormat: "",
        startAtNum: 1,
        numSheets: 2,
        numColsPerSheet: 7,
        numRowsPerSheet: 5,
        numSheetsToBuffer: 2,
        repeat: 0,
        repeatDelay: 0,
        unusedFrames: 0,
        fps: 25,
        audioUrl:""
    }

    $.fn.spritevid = function (options) {
        var config = $.extend({}, defaults, options);
        var el = $(this);
        var ticker;
        var options;
        var sheets = [];
        var numSheetsLoaded = 0;
        var sheetInfo;
        var currFrameIndex = 0;
        var currSheetIndex = 1;
        var currSheetEl;
        var isPlaying = false;
        var repeatCount = 0;

        function init() {
            sheetInfo = {
                framesPerSheet: config.numColsPerSheet * config.numRowsPerSheet,
                frameWidth: null, // width and height are derived from the first sheet image loaded
                frameHeight: null
            };

            // Prepare filenames according to filenameFormat
            var numDigitsInFilename = 0;
            var filenamePre = "";
            var filenamePost = "";

            filenamePre = config.filenameFormat.substr(0, config.filenameFormat.indexOf("#"));
            filenamePost = config.filenameFormat.substr(config.filenameFormat.lastIndexOf("#") + 1, config.filenameFormat.length);
            numDigitsInFilename = config.filenameFormat.length - (filenamePre.length + filenamePost.length);

            for (var i = config.startAtNum; i < config.startAtNum + config.numSheets; i++) {
                var currFileNum = i.toString();
                
                while (currFileNum.length < numDigitsInFilename) {
                    currFileNum = "0" + currFileNum;
                }
                
                var filename = config.sheetsFolderUrl + filenamePre + currFileNum + filenamePost;
                
                sheets.push({
                    filename: filename
                });
            }
            console.log('init func');

            loadSheets();
        }

        function loadSheets() {
            console.log('hi');

            // Load sheets asynchronously
            console.log(sheets.length);
            console.log(numSheetsLoaded);
            if (numSheetsLoaded < sheets.length) {
                console.log('hoo ha');
                var sheetImg = $("<img></img>");

                sheetImg.css({
                    position: "absolute",
                    opacity: 0
                    //width:'300px',
                    //height:'167px'
                });

                sheetImg.load(function () {
                    sheets[numSheetsLoaded].img = sheetImg;
                    el.append($(sheetImg));
                    console.log('inside sheetImg load func');

                    console.log(sheetImg);

                    if (sheetInfo.frameWidth == null || sheetInfo.frameHeight == null) {
                        sheetInfo.frameWidth = sheetImg.width();
                        sheetInfo.frameHeight = sheetImg.height();
                    }
                    numSheetsLoaded++;

                    // Rinse and repeat until all sheets have been loaded
                    loadSheets();

                    if (numSheetsLoaded >= config.numSheetsToBuffer && isPlaying == false) {
                        isPlaying = true;
                        play();
                    }
                });

                sheetImg.attr("src", sheets[numSheetsLoaded].filename);
                //background_value= 'url(' + sheets[numSheetsLoaded].filename + ')';
                //sheetImg.attr("background", background_value);
            } else {
                return false;
            }
        }

        function playSound() {
            var audio1 = document.getElementById("MyAudio");
                 flag = true;audio1.play()

        }

        function play() {
            playSound();
            ticker = setInterval(function () {
                var currSheetEl = $(sheets[currSheetIndex].img);
                var pos = translateGlobalFrameIndexToPos(currFrameIndex);

                // Halt playing if the current sheet hasn't loaded yet
                if (pos.sheetIndex < numSheetsLoaded) {
                    if (currSheetIndex != pos.sheetIndex) {
                        currSheetEl.css("opacity", 0);
                        currSheetIndex = pos.sheetIndex;
                        currSheetEl = $(sheets[currSheetIndex].img);
                        currSheetEl.css("opacity", 1);
                    }

                    currSheetEl.css({
                        left: -pos.posX,
                        top: -pos.posY
                    });
                    console.log(-pos.posX);
                    console.log(-pos.posY);

                    currFrameIndex++;
                    /*if (currFrameIndex >= config.numSheets * (sheetInfo.framesPerSheet - config.unusedFrames)) {
                        if (repeatCount < config.repeat){
                            currFrameIndex = 0;
                            repeatCount++;
                            if (config.repeatDelay > 0){
                                pauseTimer = setTimeout(play, config.repeatDelay * 1000);
                                stop();
                            }
                        } else {
                            stop();
                            return false;
                        }
                    }   */
                }
            }, Math.floor(1000 / config.fps));
        }
        
        function stop() {
            clearInterval(ticker);
        }

        function translateGlobalFrameIndexToPos(globalFrameIndex) {
            var sheetIndex = Math.floor(globalFrameIndex / sheetInfo.framesPerSheet);
            var localFrameIndex = globalFrameIndex % sheetInfo.framesPerSheet;
            
            var colIndex = localFrameIndex % config.numColsPerSheet;
            var rowIndex = Math.floor(localFrameIndex / config.numColsPerSheet);
            
            var pos = {
                sheetIndex: sheetIndex,
                posX: colIndex * (Math.floor(sheetInfo.frameWidth / config.numColsPerSheet)),
                posY: rowIndex * (Math.floor(sheetInfo.frameHeight / config.numRowsPerSheet))
            }
            console.log('----')
            //console.log(localFrameIndex);
            //console.log(colIndex);
           // console.log(rowIndex);
           // console.log(sheetInfo.frameWidth);
           // console.log(sheetInfo.frameHeight);
            return pos;
        }

        init();
    };

}(jQuery));
