var socket = io();
$(() => {
    console.log("onload");
});

socket.on("sitted", function (data) {
    current_seat_id = data.seat_id;
    $.post("http://localhost:3000/getSittingCount", {
        table_id: data.table_id
    });
});
socket.on("game_started", function (data) {
    if (current_table_id == data.table_id) {
        $.post("http://localhost:3000/revealMyCard", {
            table_id: data.table_id, member_id: member_id
        });
    }
    //getMyCards();
});
socket.on("my_card_revealed", function (data) {
    data = data[0];
    if (data['member_id'] == member_id && data['table_id'] == current_table_id) {
        Mycard_one = getCardPath(data['card_one']);
        Mycard_two = getCardPath(data['card_two']);
        //showCard(current_seat_id, Mycard_one)
        //showCard(current_seat_id, Mycard_two)
    }

    //getMyCards();
});

socket.on("message", function (data) {
    if (data['table_id'] == current_table_id) {
        let player_seat_id = data['seat_id'];
        let chat_html = `<div class='alert alert-info'>${data['player_name']} : ${data['message']}</div>`;
        $(".chat_history").append(chat_html);

        showTooltip(seat[player_seat_id], data['message'], 'tooltip');

        setTimeout(function () {
            hideTooltip('tooltip');
        }, 8000)

    }
});

