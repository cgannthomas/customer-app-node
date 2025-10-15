$(document).ready(function () {
  // Initialize DataTable
  const table = $("#customersTable").DataTable({
    serverSide: true,
    processing: true,
    searching: false, //default searchbox hide
    ajax: {
      url: "/api/customers",
      type: "GET",
      data: function (d) {
        d.customerid = $("#searchCustomerId").val().trim();
      },
    },
    columns: [
      { title: "CustomerID" },
      { title: "First" },
      { title: "Last" },
      { title: "Address" },
      { title: "City" },
      { title: "Province" },
      { title: "Postal" },
      { orderable: false, searchable: false },
    ],
    pageLength: 10,
  });

  let typingTimer;
  $("#searchCustomerId").on("keyup", function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function () {
      table.ajax.reload();
    }, 400); // 400ms delay after user stops typing
  });

  // Optional: if user presses Enter immediately
  $("#searchCustomerId").on("keydown", function (e) {
    if (e.key === "Enter") {
      clearTimeout(typingTimer);
      table.ajax.reload();
    }
  });

  // --- Delete cutomer
  let deleteId = null;
  let deleteCustomerId = null;

  $("#customersTable").on("click", ".btn-delete", function () {
    deleteId = $(this).data("id");
    deleteCustomerId = $(this).data("customerid");
    $("#deleteMsg").text(
      `Are you sure? you want to delete the cutomer ${deleteCustomerId}?`
    );
    $("#deleteModal").show();
  });

  $("#cancelDelete").on("click", function () {
    $("#deleteModal").hide();
    deleteId = null;
  });

  $("#confirmDelete").on("click", function () {
    if (!deleteId) return;
    $.ajax({
      url: "/api/customers/" + deleteId,
      method: "DELETE",
      success: function () {
        $("#deleteModal").hide();
        table.ajax.reload();
      },
      error: function (xhr) {
        alert(xhr.responseText || "Delete failed");
      },
    });
  });
});
