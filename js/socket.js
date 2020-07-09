var socket = io();
$(() => {
  $(".sit").click(() => {
    sit({ name: "joby" });
  });
  $(".tables").click(() => {
    $.post("http://localhost:3000/getTablesList", {});
  });

  getMessages();
});
socket.on("message", addMessages);
function addMessages(message) {
  $("#messages").append(
    `<h4> ${message.name} </h4> <p> ${message.message} </p>`
  );
}
//http://stemkoski.github.io/Three.js/
socket.on("TablesList", function(data) {
  console.log(data);
  for (index of data) {
    value = data[index];
    value["name"];
  }
});

socket.on("sitted", function(data) {
  console.log("sitted");
  $.post("http://localhost:3000/getSittingCount", {
    table_id: "5dbb31d501c64629104786c3"
  });
});
socket.on("PlayersCount", function(data) {
  console.log(data);
  if (data > 2) {
    startGame();
  }
});

function getMessages() {
  $.get("http://localhost:3000/messages", data => {
    data.forEach(addMessages);
  });
}
function sendMessage(message) {
  $.post("http://localhost:3000/messages", message);
}
function sit(message) {
  $.post("http://localhost:3000/sit", message);
}
