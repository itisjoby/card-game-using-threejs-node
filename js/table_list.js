$(document).ready(function() {
  $(".list_tbl").on("click", "tr", function() {
    let table_id = $(this)
      .find("input.table_id")
      .val();
    location.href = "/toRoom?table_id=" + table_id;
  });
});
