$(document).on("click", "ul.nav-tabs li", function () {
    if ($(this).is("li")) {
        $(this)
                .closest("ul")
                .find("li")
                .removeClass("active");
        $(this).addClass("active");
    }
});


function getCardTexture(card) {
    let path = "";
    switch (card) {
        case "Ace of Hearts":
            path = "cards_png/AH.png";
            break;
        case "2 of Hearts":
            path = "cards_png/2H.png";
            break;
        case "3 of Hearts":
            path = "cards_png/3H.png";
            break;
        case "4 of Hearts":
            path = "cards_png/4H.png";
            break;
        case "5 of Hearts":
            path = "cards_png/5H.png";
            break;
        case "6 of Hearts":
            path = "cards_png/6H.png";
            break;
        case "7 of Hearts":
            path = "cards_png/7H.png";
            break;
        case "8 of Hearts":
            path = "cards_png/8H.png";
            break;
        case "9 of Hearts":
            path = "cards_png/9H.png";
            break;
        case "10 of Hearts":
            path = "cards_png/10H.png";
            break;
        case "Jack of Hearts":
            path = "cards_png/JH.png";
            break;
        case "Queen of Hearts":
            path = "cards_png/QH.png";
            break;
        case "King of Hearts":
            path = "cards_png/KH.png";
            break;
        case "Ace of Spades":
            path = "cards_png/AS.png";
            break;
        case "2 of Spades":
            path = "cards_png/2S.png";

            break;
        case "3 of Spades":
            path = "cards_png/3S.png";
            break;
        case "4 of Spades":
            path = "cards_png/4S.png";
            break;
        case "5 of Spades":
            path = "cards_png/5S.png";
            break;
        case "6 of Spades":
            path = "cards_png/6S.png";
            break;
        case "7 of Spades":
            path = "cards_png/7S.png";
            break;
        case "8 of Spades":
            path = "cards_png/8S.png";
            break;
        case "9 of Spades":
            path = "cards_png/9S.png";
            break;
        case "10 of Spades":
            path = "cards_png/10S.png";
            break;
        case "Jack of Spades":
            path = "cards_png/JS.png";
            break;
        case "Queen of Spades":
            path = "cards_png/QS.png";
            break;
        case "King of Spades":
            path = "cards_png/KS.png";
            break;
        case "Ace of Clubs":
            path = "cards_png/AC.png";
            break;
        case "2 of Clubs":
            path = "cards_png/2C.png";
            break;
        case "3 of Clubs":
            path = "cards_png/3C.png";
            break;
        case "4 of Clubs":
            path = "cards_png/4C.png";
            break;
        case "5 of Clubs":
            path = "cards_png/5C.png";
            break;
        case "6 of Clubs":
            path = "cards_png/6C.png";
            break;
        case "7 of Clubs":
            path = "cards_png/7C.png";
            break;
        case "8 of Clubs":
            path = "cards_png/8C.png";
            break;
        case "9 of Clubs":
            path = "cards_png/9C.png";
            break;
        case "10 of Clubs":
            path = "cards_png/10C.png";
            break;
        case "Jack of Clubs":
            path = "cards_png/JC.png";
            break;
        case "Queen of Clubs":
            path = "cards_png/QC.png";
            break;
        case "King of Clubs":
            path = "cards_png/KC.png";
            break;
        case "Ace of Diamonds":
            path = "cards_png/AD.png";
            break;
        case "2 of Diamonds":
            path = "cards_png/2D.png";
            break;
        case "3 of Diamonds":
            path = "cards_png/3D.png";
            break;
        case "4 of Diamonds":
            path = "cards_png/4D.png";
            break;
        case "5 of Diamonds":
            path = "cards_png/5D.png";
            break;
        case "6 of Diamonds":
            path = "cards_png/6D.png";
            break;
        case "7 of Diamonds":
            path = "cards_png/7D.png";
            break;
        case "8 of Diamonds":
            path = "cards_png/8D.png";
            break;
        case "9 of Diamonds":
            path = "cards_png/9D.png";
            break;
        case "10 of Diamonds":
            path = "cards_png/10D.png";
            break;
        case "Jack of Diamonds":
            path = "cards_png/JD.png";
            break;
        case "Queen of Diamonds":
            path = "cards_png/QD.png";
            break;
        case "King of Diamonds":
            path = "cards_png/KD.png";
            break;
    }
    return path;
}
function getCardPath(card_name) {
    let path = getCardTexture(card_name);
    path = "../assets/" + path;
    return path;
}