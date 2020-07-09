$(document).ready(function () {

    $(document).on('click', '.sign_up_btn', function () {
        let email = $("form.signup_form").find("[name='email']").val();
        let name = $("form.signup_form").find("[name='name']").val();
        let password = $("form.signup_form").find("[name='password']").val();
        saveUser(email, name, password);
    });
    $(document).on('click', '.login_btn', function () {
        let email = $("form.login_form").find("[name='email']").val();
        let password = $("form.login_form").find("[name='password']").val();

        console.log(email)
        console.log(password)
        loginUser(email, password);
    });
});

function saveUser(email, name, password) {
    if ($.trim(name) != '' && $.trim(email) != '' && $.trim(password) != '') {
        $.ajax({
            url: "/saveUser",
            type: "POST",
            dataType: "json",
            async: true,
            data: {email: email, name: name, password: password},

            success: function (data, textStatus, xhr) {
                location.href = data['redirect_url'];
            }
        });

    } else {
        alert("please fill all mandatory fields");
    }
}
function loginUser(email, password) {

    if ($.trim(email) != '' && $.trim(password) != '') {
        $.ajax({
            url: "/loginUser",
            type: "POST",
            dataType: "json",
            async: true,
            data: {email: email, password: password},

            success: function (data, textStatus, xhr) {
                if (data['status'] == 1) {
                    location.href = data['redirect_url'];
                } else {
                    alert("invalid login details");
                }
            }
        });

    } else {
        alert("please fill all mandatory fields");
    }
}
