/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var username = sessionStorage.getItem('userID');
var ref = new Firebase("https://popping-fire-7207.firebaseio.com/users/" +username);
