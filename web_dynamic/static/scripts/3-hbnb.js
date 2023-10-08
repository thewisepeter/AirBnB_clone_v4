$(document).ready(function () {
  // Creating API status
  const amenityIds = {};

  function updateApiStatusClass(status) {
    if (status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  }

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    const status = data.status;

    updateApiStatusClass(status);
  });

  $('input[type="checkbox"]').on('change', function () {
    const amenityId = $(this).data('id'); // Get Amenity ID from data-id attribute

    if ($(this).is(':checked')) {
      amenityIds[amenityId] = true;
    } else {
      delete amenityIds[amenityId];
    }

    const amenitiesList = [];
    for (const id in amenityIds) {
      const amenityName = $('input[data-id="' + id + '"]').data('name');
      amenitiesList.push(amenityName);
    }
    $('.amenities h4').text(amenitiesList.join(', '));
  });

  // Fetching places
  $(function () {
    // Empty dictionary for POST request.
    const requestData = {};

    // Make an AJAX POST request to retrieve places
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json', // Specify content type as JSON
      data: JSON.stringify(requestData), // Convert data to JSON string
      success: function (data) {
        // Clear the existing content in the .places element
        $('.places').empty();

        // Loop through each place in the response data and append it to .places
        $.each(data, function (index, place) {
          const $placeElement = $('<article>', { class: 'place' });
          $placeElement.html(`
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guests</div>
            <div class="number_rooms">${place.number_rooms} Bedrooms</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
          </div>
          <div class="description">
            ${place.description}
          </div>
        `);
          // Append the place element to the .places element
          $('.places').append($placeElement);
        });
      }
    });
  });
});
