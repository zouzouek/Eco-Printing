/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




$(function () {
    ref.once("value", function (snapshot) {
        $("#sample").html(snapshot.val().Name);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});