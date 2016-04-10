/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var ref = new Firebase("https://popping-fire-7207.firebaseio.com/");
var usersRef = ref.child("users");
$(function () {
    $("#LoginButton").on('click', function () {
        ref.authWithOAuthPopup("google", function (error, authData) {
            if (error) {
                alert("Login Failed!", error);
            } else {
                checkUser(authData);
                console.log(authData);
            }
        });
    });
});

function checkUser(authData) {
    userId = authData.uid;
    usersRef.child(userId).once('value', function (snapshot) {
        var exists = (snapshot.val() !== null);
        if (exists) {
            OpenProfile(userId);
        } else {
            addUser(authData);
        }
    });
}
function addUser(authData) {
    username = authData.uid;
    usersRef.child(username).set({
        Name: authData.google.displayName
    },OpenProfile);

}
function OpenProfile(userID) {
    sessionStorage.setItem("userID", userID);
    window.location.href = "profile.html";
}