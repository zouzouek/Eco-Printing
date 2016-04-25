/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {

    var docExtensions = "doc, docx, dot, dotx, wpd, wps, wri";
    var powerPointExtensions = "pot, potx, pps, ppsx, ppt, pptx";
    var imageExtensions = "avs, bmp, dcx, dib, dpx, fax, fits, fpx, gif, ico, iptc, jbig, jp2, jpeg, jpg, mdi, miff, mng, mpc, mtv, otb, pbm, pcd, pcds, pct, pcx, pgm, pict, png, pnm, ppm, psd, p7, ras, rgba, sun, tga, tiff, tif, vicar, vid, viff, wmf, xbm, xpm, xwd";
    var excelExtensions = "csv, xls, xlsb, xlsx, xlt, xltx";
    var textExtensions = "txt, log";
    var richTextExtensions = "rtf";
    var Files;
    $("#logout").on('click', function () {
        ref.unauth();
        sessionStorage.removeItem("userID");
        window.location.href = "index.html";
    });
    ref.on("value", function (snapshot) {
        $("#username").html(snapshot.val().Name);
        drawStats(snapshot.val());
        Files = snapshot.val().Files;
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    $("#AnalyzeButton").hover(function () {
        $(this).find("img").attr('src', 'img/arrow-light.png');
    }, function () {
        $(this).find("img").attr('src', 'img/arrow-dark.svg');
    });
    $("#file-input").on('change', function () {
        var fll= $(this)[0].files[0];
        checkPreviousPrint(fll.name, fll.lastModified);
        $("#AnalyzeButton").removeClass('unLoading');
        $("#PrintButton").addClass('unLoading');
        $("#infoPrintDiv").slideUp("slow");
        $(".success,.error").remove();
        $("#currentDocumentPages").html("");
        $("#currentDocumentCO2").html("");
        $("#pagesToPrint").val("");
        $("#radioblackwhite").attr('checked', 'checked');

    });
    var fileInput = $("#file-input");
    var numPages = 0;
    $('input[type="radio"]').on('click', function (e) {
        $(".colorInfo").remove();
        var typePrinting = $(this).val();
        if (typePrinting === "colored") {
            addAlert("Are you sure you wanna print colored? This can spend up to 2.5 times more money than 'black and white' printing.", "error colorInfo");
        }
    });
    $("#pagesToPrint").on('change', function () {
        $(".documentInfo").remove();
        var pagesToPrint = $(this).val();
        var totalPages = $("#currentDocumentPages").html();
        var bigger = pagesToPrint >= totalPages;
        console.log(bigger);
        if (bigger) {
            addAlert("Are you sure you wanna print all pages?\nYou can reduce 6 gramms of CO2 emission for each page you do not print!", "error documentInfo");
        } else {
            addAlert("By not printing the whole document you are reducing " + 6 * (totalPages - pagesToPrint) + " gramms of CO2 emitted!", 'success documentInfo');
        }
    });

    $("#PrintButton").click(function () {
        var pagesToPrint = $('#pagesToPrint').val();
        var typePrinting = $('input[name=color]:checked').val();
        if (pagesToPrint === "") {
            alert("Select the total amount of pages you ae going to print");
            return;
        }
//        if (typePrinting === "colored") {
//            sendToDataBase(parseInt(pagesToPrint), filetype, "true");
//        } else {
//            sendToDataBase(parseInt(pagesToPrint), filetype, "false");
//        }

        var gadget = new cloudprint.Gadget();
        if (filetype.indexOf("pdf") > -1) {
            var base64 = btoa(uint8ToString(dataFile));
            gadget.setPrintDocument(fileInput[0].files[0].type, fileInput[0].files[0].name, base64, "base64");
        } else {
            gadget.setPrintDocument("url", fileInput[0].files[0].name, fileUrl);
        }
        gadget.openPrintDialog();
        var handlerPrinter = function () {
            location.reload();
            if (typePrinting === "colored") {
                sendToDataBase(parseInt(pagesToPrint), filetype, "true");
            } else {
                sendToDataBase(parseInt(pagesToPrint), filetype, "false");
            }

        };
        gadget.setOnCloseCallback(handlerPrinter);

    });
    $("#AnalyzeButton").click(function () {
        startLoading();
        var data = new FormData();
        data.append('File', fileInput[0].files[0]);
        data.append('StoreFile', 'true');
        data.append('ApiKey', "623824211");
        $form = $(".formElements");

        var handler = function () {

            if (this.status === 200) {
                fileUrl = this.getResponseHeader("FileUrl");
                PDFJS.getDocument(fileUrl).then(function (doc) {
                    numPages = doc.numPages;
                    $('#currentDocumentPages').html(numPages);
                    $('#currentDocumentCO2').html(numPages * 6);
                    $('#infoPrintDiv').slideDown("slow");
                    stopLoading();
                });
            } else {
                stopLoading();
                alert("Document analysis was not complete please try again.");
            }
        };

        filetype = fileInput[0].files[0].name.split('.').pop();
        if (filetype.indexOf("pdf") > -1) {
            var fileReader = new FileReader();
            fileReader.onload = function () {
                dataFile = new Uint8Array(this.result);
                PDFJS.getDocument(dataFile).then(function (pdf) {
                    numPages = pdf.numPages;
                    $('#currentDocumentPages').html(numPages);
                    $('#currentDocumentCO2').html(numPages * 6);
                    $('#infoPrintDiv').show();
                    stopLoading();
                });
            };
            fileReader.readAsArrayBuffer(fileInput[0].files[0]);
        } else {
            if ((docExtensions.indexOf(filetype) > -1)) {
                url = "https://do.convertapi.com/Word2Pdf";
            } else if (powerPointExtensions.indexOf(filetype) - 1) {
                url = "https://do.convertapi.com/PowerPoint2Pdf";
            } else if (textExtensions.indexOf(filetype) - 1) {
                url = "https://do.convertapi.com/Text2Pdf";
            } else if (imageExtensions.indexOf(filetype) - 1) {
                url = "https://do.convertapi.com/Image2Pdf";
            } else if (excelExtensions.indexOf(filetype) - 1) {
                url = "https://do.convertapi.com/Excel2Pdf";
            } else if (richTextExtensions.indexOf(filetype) - 1) {
                url = "https://do.convertapi.com/RichText2Pdf";
            }
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url.replace(/\&amp\;/g, "&"));
            xhr.responseType = 'blob';
            xhr.onload = handler;
            xhr.send(data);
        }

    });
    function checkPreviousPrint(filename, lastModified) {
        $.each(Files, function (i, v) {
            if (v.FileName == filename && v.DatePrecise > lastModified) {
                alert("This file wasn't modified since the last time you printed it!\n Please refrain from unecessary printing!")
                return false;
            }
        });
    }
    function addAlert(message, type) {
        if (!type)
            type = 'error';
        $('<div>').attr('class', type).html(message).appendTo("#infoPrintDiv")
    }

    function startLoading() {
        $("#AnalyzeButton").addClass('unLoading');
        $("#loader").removeClass('unLoading');
    }
    function stopLoading() {
        $("#loader").addClass('unLoading');
        $("#PrintButton").removeClass('unLoading');

    }
    function uint8ToString(buf) {
        var i, length, out = '';
        for (i = 0, length = buf.length; i < length; i += 1) {
            out += String.fromCharCode(buf[i]);
        }
        return out;
    }
    function sendToDataBase(numPages, type, colored) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var filename = fileInput[0].files[0].name;
        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today = dd + '/' + mm + '/' + yyyy;
        var todayClock = $.now();
        ref.child("Files").push({"TotalPagesPrinted": numPages, "Extension": type, "DataPrinted": today, "Colored": colored, "FileName": filename, "DatePrecise": todayClock});

    }
});