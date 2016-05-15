// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See generic-helpers-tests.js for an example of importing.
export const name = 'generic-helpers';


ErrorMsg = function( msg ) {
  console.log(msg);

  var alert = $('.alert-danger');
  alert.html(msg);
  alert.slideDown();
  setTimeout(()=> {
    alert.slideUp();
  }, 7000);
};

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
