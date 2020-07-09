$(document).ready(function () {
    $(document).on('click', '.setings_button', function () {
        $("#settings_modal").modal('show');
    });
    $(document).on('click', '.logout', function () {
        logout();
    });
})
function logout() {
    $.ajax({
        url: "/logout",
        type: "POST",
        dataType: "json",
        async: true,

        success: function (data, textStatus, xhr) {
            location.href = data['redirect_url'];
        }
    });
}