// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See generic-helpers-tests.js for an example of importing.
export const name = 'generic-helpers';

var goToByScroll = function( div ){
      // Remove "link" from the ID
    // id = id.replace("link", "");
      // Scroll
    $('html,body').animate({
        scrollTop: div.offset().top},
        'slow');
};

var showMsg = function(field, msg) {
  console.log(msg);

  var alert = $(field);
  alert.html(msg);
  alert.slideDown();
  setTimeout(()=> {
    alert.slideUp();
  }, 7000);

  // scroll to the div
  goToByScroll(alert);
};

// Show an error message for a few seconds
// Expects .alert-danger on caller's DOM
ErrorMsg = function( msg ) {
  showMsg('.alert-danger', msg);
};

SuccessMsg = function( msg ) {
  showMsg('.alert-success', msg);
};

WarningMsg = function( msg ) {
  showMsg('.alert-warning', msg);
};

ToggleLoader = function() {
  $('.loader').toggle();
}


Template.registerHelper('stringify', ( obj )=> {
  if (typeof(obj) !== 'object') {
    return obj;
  }
  return JSON.stringify(obj);
});


// takes a JSON object in !String format and prints it pretty
// if it can't be parsed the object is just returned
Template.registerHelper('pretty', ( obj )=> {
  if (typeof(obj) !== 'object') {
    try {
      obj = JSON.parse(obj);
    } catch(e) {
      return obj;
    }
  }
  return JSON.stringify(obj, null, "\t");
});



// Meteor.methods({
//   errorMsg: function(msg) {
//     console.log(msg);
//
//     var alert = $('.alert-danger');
//     alert.html(msg);
//     alert.slideDown();
//     setTimeout(()=> {
//       alert.slideUp();
//     }, 5000);
//   }
// });
