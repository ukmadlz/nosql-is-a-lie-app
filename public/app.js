
$(document).on('ready', function () {
  if ($(".button-collapse").length) {
    $(".button-collapse").sideNav();
  }
  $('form#check').on('submit', function(e) {
    e.preventDefault();

    var databaseType = $('form#check').attr('data-database');

    $.get('/' + databaseType + '/check?database=' + $('#database').val(), function(body) {

    });

    return false;
  });

  var pusher = new Pusher('ab09ac6fc0d6c1cf2fee', {
      cluster: 'eu',
      encrypted: true
    });

  var channel = pusher.subscribe($('form#check').attr('data-database'));
  channel.bind('new-entry', function(data) {
    $('ul#result').prepend('<li>' + data.database + '</li>');
  });
});
