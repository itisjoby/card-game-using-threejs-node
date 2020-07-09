
$(document).ready(function () {
    $('[data-toggle="popover"]').popover();
    $(document).on('click', '.stand_up_btn', function () {
        standUp(current_table_id, current_seat_id, member_id);
    });
    $(document).on('click', '.back_to_lobby', function () {

    });
    $(document).on('click', '.block_chat', function () {
        alert('chats blocked');
    });
    $(document).on('click', '.invite_friends', function () {
        alert('invited 100 friends');
    });
    $(document).on('click', '.get_chips', function () {
        alert('added 100 chips');
    });
    $(document).on('click', '.chat_btn', function () {
        $("#chat_modal_div").modal('show');
    });
    $(document).on('click', '.send_message_btn', function () {
        let message = $(this).parent().find('input.input_msg').val();
        sendMessage(current_table_id, member_id, message)
    });
})

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
        );



var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var domEvents = new THREEx.DomEvents(camera, renderer.domElement);
const loader = new THREE.TextureLoader();
let table_graphics = {};
let seat = [];
let card_graphics = [];

/*CREATE A TABLE*/

setUpTable();

seat_count = Object.keys(result).length;
let empty_seat = 0;
for (let table_index in result) {
    let table_value = result[table_index];
    if (table_value["member_id"] == "") {
        empty_seat++;
    }
}


/**ADDING SEATS */
let entry = 0;
for (let table_index in result) {
    entry++;
    let table_value = result[table_index];
    let table_id = table_value["table_id"];
    let seat_id = table_value["_id"];

    if (table_value["member_id"] == null) {
        var geometry1 = new THREE.CircleGeometry(0.5, 32);
        var material1 = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0.5
        });
        seat[seat_id] = new THREE.Mesh(geometry1, material1);
        scene.add(seat[seat_id]);

        adjustSeatPosition(entry, seat_id);
        domEvents.addEventListener(
                seat[seat_id],
                "click",
                function (event) {
                    sitSeat(table_id, seat_id, member_id);
                    console.log("you clicked on the " + seat_id);
                },
                false
                );
    } else {
        let player_name = table_value['player_first_name'] + ' ' + table_value['player_last_name'];
        let player_img = '../assets/raw/head_l.png';

        let profile_material = [
            new THREE.MeshBasicMaterial({
                map: loader.load(player_img),
                side: THREE.FrontSide
            }),
            new THREE.MeshBasicMaterial({
                map: loader.load("assets/back.jpg"),
                side: THREE.BackSide
            })
        ];

        let profile_plane = new THREE.PlaneGeometry(1.5, 1.5);

        for (var i = 0, len = profile_plane.faces.length; i < len; i++) {
            var face = profile_plane.faces[i].clone();
            face.materialIndex = 1;
            profile_plane.faces.push(face);
            profile_plane.faceVertexUvs[0].push(
                    profile_plane.faceVertexUvs[0][i].slice(0)
                    );
        }

        seat[seat_id] = new THREE.Mesh(profile_plane, profile_material);
        seat[seat_id].renderOrder = 1;
        scene.add(seat[seat_id]);

        adjustSeatPosition(entry, seat_id);
        showProfileName(seat[seat_id], player_name, seat_id);

        domEvents.addEventListener(
                seat[seat_id],
                "click",
                function (event) {
                    getProfile(table_value["member_id"]);
                },
                false
                );

        var outlineMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var outlineMesh = new THREE.Mesh(profile_plane, outlineMaterial);
        outlineMesh.position = seat[seat_id].position;
        outlineMesh.scale.multiplyScalar(1.05);
        seat[seat_id].add(outlineMesh);


        let card_material = [
            new THREE.MeshBasicMaterial({
                map: loader.load("../assets/cards_png/KD.png"),
                side: THREE.FrontSide
            }),
            new THREE.MeshBasicMaterial({
                map: loader.load("assets/back.jpg"),
                side: THREE.BackSide
            })
        ];

        let card_geometry = new THREE.PlaneGeometry(0.7, 1);

        for (var i = 0, len = card_geometry.faces.length; i < len; i++) {
            var face = card_geometry.faces[i].clone();
            face.materialIndex = 1;
            card_geometry.faces.push(face);
            card_geometry.faceVertexUvs[0].push(card_geometry.faceVertexUvs[0][i].slice(0));
        }
        card_graphics[seat_id] = [new THREE.Mesh(card_geometry, card_material), new THREE.Mesh(card_geometry, card_material)];
        card_graphics[seat_id][0].renderOrder = 2;
        card_graphics[seat_id][1].renderOrder = 3;
        scene.add(card_graphics[seat_id][0]);
        scene.add(card_graphics[seat_id][1]);

        switch (entry) {
            case 1:

                card_graphics[seat_id][0].position.x = 0.5;
                card_graphics[seat_id][0].position.y = -2;
                card_graphics[seat_id][1].position.x = 0.9;
                card_graphics[seat_id][1].position.y = -2;
                break;
            case 2:

                card_graphics[seat_id][0].position.x = 4.3;
                card_graphics[seat_id][0].position.y = -2;
                card_graphics[seat_id][1].position.x = 4.7;
                card_graphics[seat_id][1].position.y = -2;
                break;
            case 3:

                card_graphics[seat_id][0].position.x = 4.3;
                card_graphics[seat_id][0].position.y = 1;
                card_graphics[seat_id][1].position.x = 4.7;
                card_graphics[seat_id][1].position.y = 1;
                break;
            case 4:

                card_graphics[seat_id][0].position.x = -4.3;
                card_graphics[seat_id][0].position.y = 1;
                card_graphics[seat_id][1].position.x = -4.7;
                card_graphics[seat_id][1].position.y = 1;
                break;
            case 5:

                card_graphics[seat_id][0].position.x = -4.3;
                card_graphics[seat_id][0].position.y = -2;
                card_graphics[seat_id][1].position.x = -4.7;
                card_graphics[seat_id][1].position.y = -2;
                break;
        }

    }
}


renderExtraCards();

camera.position.z = 5;

var animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();
function sitSeat(table_id, seat_id, member_id) {
    $.ajax({
        url: "/sit",
        type: "POST",
        dataType: "json",
        async: true,
        data: {table_id: table_id, seat_id: seat_id, member_id: member_id},

        success: function (data, textStatus, xhr) {
            let player_name = data[0]['player_first_name'] + ' ' + data[0]['player_last_name'];


            let profile_material = [
                new THREE.MeshBasicMaterial({
                    map: loader.load("../assets/ava.jpg"),
                    side: THREE.FrontSide
                }),
                new THREE.MeshBasicMaterial({
                    map: loader.load("assets/back.jpg"),
                    side: THREE.BackSide
                })
            ];

            let profile_plane = new THREE.PlaneGeometry(1.5, 1.5);

            for (var i = 0, len = profile_plane.faces.length; i < len; i++) {
                var face = profile_plane.faces[i].clone();
                face.materialIndex = 1;
                profile_plane.faces.push(face);
                profile_plane.faceVertexUvs[0].push(
                        profile_plane.faceVertexUvs[0][i].slice(0)
                        );
            }

            let table_min_deal = data['result'][0]['min_deal'];
            let table_max_deal = data['result'][0]['max_deal'];
            let table_initial_deposit = data['result'][0]['initial_deposit'];

            setGeometry(seat[seat_id], profile_plane)
            setMaterial(seat[seat_id], profile_material)

            seat[seat_id].renderOrder = 1;

            domEvents.addEventListener(
                    seat[seat_id],
                    "click",
                    function (event) {
                        getProfile(member_id);
                    },
                    false
                    );

            var outlineMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
            var outlineMesh = new THREE.Mesh(profile_plane, outlineMaterial);
            outlineMesh.position = seat[seat_id].position;
            outlineMesh.scale.multiplyScalar(1.05);
            seat[seat_id].add(outlineMesh);


            /*BRING AMOUNT SCROLL BAR*/
            $(".amount_slider").show();
            $("#slider").attr("min", table_min_deal)
            $("#slider").attr("max", table_max_deal)
            $("#slider").attr("step", table_initial_deposit)

            var slider = document.getElementById("slider");
            slider.addEventListener("input", addCoinsToTable);

            $(document).on("click", ".confirm_slider", function () {

                let deposit = $("#slider").val();
                ConfirmSitDown();
            })
            $(document).on("click", ".cancel_slider", function () {
                /*STANDUP*/
                standUp(table_id, seat_id, member_id);
            })

        }
    }).done(function () {});
}
function addCoinsToTable(e) {
    let obj = e.target;
    let value = $(obj).val();
    $(".buyin_amount").html("$" + value);

}
function getProfile(member_id) {
    $.ajax({
        url: "/getProfile",
        type: "POST",
        dataType: "json",
        async: true,
        data: {member_id: member_id},

        success: function (data) {
            for (let i in data["result"]) {
                let result = data["result"][i];
                $("#profile_modal")
                        .find(".profile_img")
                        .prop("src", result["profile_pic"]);

                $("#profile_modal")
                        .find(".profile_name")
                        .html(result["player_first_name"] + " " + result["player_last_name"]);
                $("#profile_modal")
                        .find("#hands_played")
                        .html(result["hands_played"]);
                $("#profile_modal")
                        .find("#hands_won")
                        .html(result["hands_won"]);
                $("#profile_modal")
                        .find("#biggest_pot")
                        .html(result["biggest_won"]);
                $("#profile_modal")
                        .find("#sitngo")
                        .html(result["sit_n_go_wins"]);
                $("#profile_modal")
                        .find("#coins")
                        .html(result["coins"]);
                $("#profile_modal")
                        .find("#location")
                        .html("Unknown");
                $("#profile_modal").modal("show");
            }
        }
    }).done(function () {});
}
//https://css-tricks.com/creating-photorealistic-3d-graphics-web/
function renderExtraCards() {
    let card_material = [];
    let card_geometry = [];
    let temp = [];
    for (let n = 0; n < 5; n++) {
        card_material[n] = [
            new THREE.MeshBasicMaterial({
                map: loader.load("assets/back.jpg"),
                side: THREE.FrontSide
            }),
            new THREE.MeshBasicMaterial({
                map: loader.load("assets/back.jpg"),
                side: THREE.BackSide
            })
        ];

        card_geometry[n] = new THREE.PlaneGeometry(0.7, 1);

        for (var i = 0, len = card_geometry[n].faces.length; i < len; i++) {
            var face = card_geometry[n].faces[i].clone();
            face.materialIndex = 1;
            card_geometry[n].faces.push(face);
            card_geometry[n].faceVertexUvs[0].push(card_geometry[n].faceVertexUvs[0][i].slice(0));
        }
        temp[n] = new THREE.Mesh(card_geometry[n], card_material[n]);
    }

    card_graphics['extras'] = temp;
    card_graphics['extras'][0].renderOrder = 3;
    card_graphics['extras'][1].renderOrder = 3;
    card_graphics['extras'][2].renderOrder = 3;
    card_graphics['extras'][3].renderOrder = 3;
    card_graphics['extras'][4].renderOrder = 3;
    scene.add(card_graphics['extras'][0]);
    scene.add(card_graphics['extras'][1]);
    scene.add(card_graphics['extras'][2]);
    scene.add(card_graphics['extras'][3]);
    scene.add(card_graphics['extras'][4]);

    card_graphics['extras'][0].position.x = -1.6;
    card_graphics['extras'][1].position.x = -0.8;
    card_graphics['extras'][2].position.x = 0;
    card_graphics['extras'][3].position.x = 0.8;
    card_graphics['extras'][4].position.x = 1.6;

//    texture = loader.load("../assets/cards_png/KD.png");
//    card_graphics['extras'][0].material[0].map = texture
//    card_graphics['extras'][0].material[0].map.needsUpdate = true;

    centerCardDisplay2();
    //http://learningthreejs.com/blog/2013/04/30/closing-the-gap-between-html-and-webgl/
    //https://threejs.org/examples/#webgl_geometry_text


}
function centerAmountDisplay() {
    let text_opt = {
        textHeight: 0.2,
        position: new THREE.Vector3(-0.7, 1, 0)

    };
    var spriteText = new THREE.SpriteText('$1m', text_opt);
    scene.add(spriteText);
}
function centerCardDisplay() {
    let text_opt = {
        textHeight: 0.2,
        position: new THREE.Vector3(-0.4, -0.9, 0)

    };
    var spriteText = new THREE.SpriteText('Two Pair', text_opt);
    scene.add(spriteText);
}
function centerCardDisplay2() {
    let text_opt = {
        textHeight: 0.3,
        position: new THREE.Vector3(-1, -0.5, 0),
        rect: {
            displayRect: true,
            backgroundColor: '#969491',
            borderThickness: 10,
            borderRadius: 10
        }
    };
    var spriteText = new THREE.SpriteText('     Two Pairs     ', text_opt);
    scene.add(spriteText);
}

function showCard(seat_id, card_path) {
    texture = loader.load(card_path);
    console.log(card_graphics[seat_id]);
    console.log(card_graphics[seat_id][0].material);
    card_graphics[seat_id][0].material[0].map = texture
    card_graphics[seat_id][0].material[0].map.needsUpdate = true;
}

function setGeometry(element, newGeometry) {
    element.geometry.dispose()
    element.geometry = newGeometry
}
function setMaterial(element, newMaterial) {
    element.material.dispose()
    element.material = newMaterial
}

function adjustSeatPosition(entry, seat_id) {
    switch (entry) {
        case 1:
            // bottomcenter
            seat[seat_id].position.y = -1.9;
            seat[seat_id].position.x = 0.1;
            break;
        case 2:
            //bottom left
            seat[seat_id].position.x = 4.2;
            seat[seat_id].position.y = -1.48;
            break;
        case 3:
            //topleft
            seat[seat_id].position.x = 4.2;
            seat[seat_id].position.y = 1.28;
            break;
        case 4:
            //top right
            seat[seat_id].position.x = -4.3;
            seat[seat_id].position.y = 1.28;
            break;
        case 5:
            //bottom right
            seat[seat_id].position.x = -4.3;
            seat[seat_id].position.y = -1.5;
            break;
    }
}

function setUpTable() {
    let material = [
        new THREE.MeshBasicMaterial({
            map: loader.load("../assets/table_texture.jpg"),
            side: THREE.FrontSide
        }),
        new THREE.MeshBasicMaterial({
            map: loader.load("assets/back.jpg"),
            side: THREE.BackSide
        })
    ];

    let geometry = new THREE.PlaneGeometry(10, 5);

    for (var i = 0, len = geometry.faces.length; i < len; i++) {
        var face = geometry.faces[i].clone();
        face.materialIndex = 1;
        geometry.faces.push(face);
        geometry.faceVertexUvs[0].push(geometry.faceVertexUvs[0][i].slice(0));
    }
    table_graphics = new THREE.Mesh(geometry, material);
    scene.add(table_graphics);
}

function standUp(table_id, seat_id, member_id) {
    $.ajax({
        url: "/standUp",
        type: "POST",
        dataType: "json",
        async: true,
        data: {table_id: table_id, seat_id: seat_id, member_id: member_id},

        success: function (data, textStatus, xhr) {

        }
    });
}
function sendMessage(table_id, member_id, message) {
    $.ajax({
        url: "/messages",
        type: "POST",
        dataType: "json",
        async: true,
        data: {table_id: table_id, member_id: member_id, message: message},

        success: function (data, textStatus, xhr) {

        }
    });
}


// This will move tooltip to the current mouse position and show it by timer.
function showTooltip(obj, message, html_element_id) {

    var divElement = $("#" + html_element_id);
    let x = obj.position.x;
    let y = obj.position.y;
    let z = obj.position.z;
    if (divElement) {
        divElement.css({
            display: "block",
            opacity: 0.0
        });

        var canvasHalfWidth = renderer.domElement.offsetWidth / 2;
        var canvasHalfHeight = renderer.domElement.offsetHeight / 2;


        let tooltipPosition_x = ((x / 10) * canvasHalfWidth) + canvasHalfWidth + renderer.domElement.offsetLeft;
        let tooltipPosition_y = -((y / 10) * canvasHalfHeight) + canvasHalfHeight + renderer.domElement.offsetTop;

        var tootipWidth = divElement[0].offsetWidth;
        var tootipHeight = divElement[0].offsetHeight;

        divElement.css({
            left: `${tooltipPosition_x - tootipWidth / 2}px`,
            top: `${tooltipPosition_y - tootipHeight - 5}px`
        });


        divElement.text(message);

        setTimeout(function () {
            divElement.css({
                opacity: 1.0
            });
        }, 25);
    }
}

// This will immediately hide tooltip.
function hideTooltip(html_element_id) {
    var divElement = $("#" + html_element_id);
    if (divElement) {
        divElement.css({
            display: "none"
        });
    }
}



// This will move tooltip to the current mouse position and show it by timer.
function showProfileName(obj, message, seat_id) {
    let element = '<div class="game_screen_name" id="' + seat_id + '">123</div>';
    $(element).insertAfter('#tooltip');
    var divElement = $("#" + seat_id);
    let x = obj.position.x;
    let y = obj.position.y;
    let z = obj.position.z;
    if (divElement) {
        divElement.css({
            display: "block",
            opacity: 0.0
        });

        var canvasHalfWidth = renderer.domElement.offsetWidth / 2;
        var canvasHalfHeight = renderer.domElement.offsetHeight / 2;


        let tooltipPosition_x = ((x / 10) * canvasHalfWidth) + canvasHalfWidth + renderer.domElement.offsetLeft;
        let tooltipPosition_y = -((y / 10) * canvasHalfHeight) + canvasHalfHeight + renderer.domElement.offsetTop;

        var tootipWidth = divElement[0].offsetWidth;
        var tootipHeight = divElement[0].offsetHeight;

        console.log(x);
        console.log(canvasHalfWidth);
        console.log(tooltipPosition_x);
        divElement.css({
            left: `${tooltipPosition_x - tootipWidth / 2}px`,
            top: `${tooltipPosition_y - tootipHeight + 50}px`
        });



        divElement.text(message);

        setTimeout(function () {
            divElement.css({
                opacity: 1.0
            });
        }, 25);
    }
}

// This will immediately hide tooltip.
function hideProfileName() {
    var divElement = $("#game_screen_name");
    if (divElement) {
        divElement.css({
            display: "none"
        });
    }
}