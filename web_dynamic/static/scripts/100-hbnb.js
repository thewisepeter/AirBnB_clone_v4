$(document).ready(function () {
  // Creating API status
  const amenityIds = {};
  const locationIds = {}; // Variable to store checked State and City IDs

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

  // Function to update the h4 tag inside the div Locations
  function updateLocationsH4() {
    const locationNames = [];
    for (const id in locationIds) {
      const locationName = $('input[data-id="' + id + '"]').data('name');
      locationNames.push(locationName);
    }
    $('.locations h4').text(locationNames.join(', '));
  }

  // Event listener for changes on checkboxes
  $('input[type="checkbox"]').on('change', function () {
    const id = $(this).data('id');
    const type = $(this).data('type'); // Add a data-type attribute to distinguish between State and City checkboxes

    if ($(this).is(':checked')) {
      locationIds[id] = type; // Store the ID with its type (State or City)
    } else {
      delete locationIds[id]; // Remove the ID when unchecked
    }

    updateLocationsH4(); // Update the h4 tag with the selected locations
  });

  // Fetching places
  $(function () {
    $('#searchButton').on('click', function () {
      // Prepare the data for the POST request
      const requestData = {
        amenities: Object.keys(amenityIds), // Convert the keys of amenityIds to an array
        locations: locationIds, // Include the selected locations (States and Cities)
      };

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
        },
      });
    });
  });
});
