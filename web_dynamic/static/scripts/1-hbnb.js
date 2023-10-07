$(document).ready(function() {
  var amenityIds = {};

  $('input[type="checkbox"]').on('change', function() {
    var amenityId = $(this).data('id'); // Get Amenity ID from data-id attribute

    if ($(this).is(':checked')) {
      amenityIds[amenityId] = true;
    } else {
      delete amenityIds[amenityId];
    }

    var amenitiesList = [];
    for (var id in amenityIds) {
      var amenityName = $('input[data-id="' + id + '"]').data('name');
      amenitiesList.push(amenityName);
    }

    $('.amenities h4').text(amenitiesList.join(', '));
  });
});
