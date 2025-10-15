$(document).ready(function () {
  if ($('#docId').length) {
    const id = $('#docId').val();
    // fetch doc
    $.get('/api/customers/' + id)
      .done(function (doc) {
        $('#customerid').val(doc.customerid);
        $('#firstname').val(doc.firstname);
        $('#lastname').val(doc.lastname);
        $('#address').val(doc.address);
        $('#city').val(doc.city);
        $('#province').val(doc.province);
        $('#postalcode').val(doc.postalcode);
      })
      .fail(function () { $('#errorMsg').text('Could not fetch data'); });

  }

  $('#resetBtn').on('click', function () {
    location.reload();
  });

  $('#cutomerForm').on('submit', function (e) {
    e.preventDefault();
    const customerid = $('#customerid').val().trim();
    const payload = {
      customerid: customerid,
      firstname: $('#firstname').val().trim(),
      lastname: $('#lastname').val().trim(),
      address: $('#address').val().trim(),
      city: $('#city').val().trim(),
      province: $('#province').val().trim(),
      postalcode: $('#postalcode').val().trim()
    };
    // validate
    for (let k in payload) {
      if (!payload[k]) return $('#errorMsg').text('All fields are required');
    }
    if (customerId) {
      const isValid = /^[A-Za-z0-9]+$/.test(customerId);
      if (!isValid) return $('#errorMsg').text('Customer ID must contain only letters and numbers (no spaces or symbols)');

      payload.customerid = customerId;
    }
    $.ajax({
      url: $(this).attr('data-action'),
      method: $(this).attr('method'),
      contentType: 'application/json',
      data: JSON.stringify(payload),
      success: function (res) {
        $('#SuccessMsg').text(res);    

        setTimeout(function () {
          location.reload();
        }, 1000);
      },
      error: function (xhr) { $('#errorMsg').text(xhr.responseText || 'Error'); }
    });
  });
});