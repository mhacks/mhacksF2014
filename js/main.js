// Document ready
$(function() {
  // initialize Parse
  Parse.initialize("ESlRgOz3V1xyLJOsfIHG93enDoVYZZGhNxJe3SXk", "cp2EJqkQMu1Dbv9htMoZ7caQbiqe5AIkYKpRGzW6");

  // scroll the window back to the top
  $('body').scrollTop(0);

  // pick a random background
  bgs = ['yay', 'sleep', 'hallway', 'chrysler', 'ceremony', 'breakout', 'big_house', 'big_house_2'];
  img = bgs[Math.floor(Math.random() * bgs.length)]
  $('body').css('background-image', 'url(/img/photos/' + img +'.jpg)')

  // initiate the countdown
  setCountdown();

  // set the upload trigger for a keypress
  $("#email-input").keypress(function(e) {
    if (e.keyCode == 13) {
      submitEmail();
      e.preventDefault();
    }
  });

  // set the upload trigger on the button
  $("#email-button").on('click', submitEmail);

  // Reset the logo for drawing
  $('.logo-animated path').each(function() {
    resetPathDrawing(this);
  });

  // Detect if the current browser is Firefox, and if it is,
  // use the much less cool version of this animation which
  // looks exactly the same.
  // In case you're curious: we had to make two methods to
  // scale the dots because Safari (and probably others)
  // don't let you set the radius (claiming it is read-only).
  if (typeof InstallTrigger !== 'undefined') {
    $('.logo-animated circle').each(function() {
      var t = $(this);
      t.attr('len', t.attr('r'));
      t.attr('r', '0');
      t.attr('class', '');
    });
  }

  // The path has been reset, so show the div
  $('#logo-wrapper').removeClass('invisible');
  
  // Drag the elements of the logo in 300ms from load
  window.setTimeout(function() {
    $('.logo-animated circle').attr('class', 'grow-animated');
    // this fixes the circles on firefox
    if (typeof InstallTrigger !== 'undefined') {
      $('.logo-animated circle').each(function() {
        var t = $(this);
        TweenMax.set(t, 1, {scale: 1, transformOrigin: "50% 50% 0"});
        TweenMax.to(t, 1, { attr:{ r: t.attr('len') } });
      });
    }
  }, 300);

  // Then, 100ms later, start drawing the lines
  window.setTimeout(function() {
    $('.logo-animated path').each(function() {
      simulatePathDrawing(this, 4.4);
    });
    // The border needs to be drawn more quickly
    simulatePathDrawing($('#logo-outline-path')[0], 3.0);
  }, 400);

  // you ruined everything, IE
  window.setTimeout( function() {
    var greetingHeight = $('#anchor-greeting').height();
    var wrapperHeight = $('body').height();
    $('#logo-wrapper').addClass('pushed');
    if (wrapperHeight > 450) {
      $('#logo-wrapper').css('height', (wrapperHeight - greetingHeight - 20) + "px");
    }

    // Firefox ruins everything nice too
    window.setTimeout(function() {
      $('body').removeClass('locked');
    }, 2000);
    $('#anchor-greeting').removeClass('transparent');
    // so the page doesn't jump around later...
    $('#anchor-greeting').css('min-height', $('#anchor-greeting').height());
  }, 3400);
});

function setCountdown() {
  $('#countdown-1').text('MHacks IV starts in ' + daysBetween(new Date(), new Date(2014, 8, 5)) + ' days.');
  $('#countdown-2').text('Registration starts in ' + daysBetween(new Date(), new Date(2014, 6, 4)) + '.');
}

function validateEmail(email) {
  // jk I typed it out
  var re = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
  return re.test(email);
  // ...not
}

function daysBetween(date1, date2) {
  var oneDay = 24*60*60*1000;
  console.log(date1.getTime());
  console.log(date2.getTime());
  return Math.round(Math.abs((date1.getTime() - date2.getTime())/(oneDay)));
}

// Reset the drawing before starting
function resetPathDrawing(path) {
  // we need to hardcode the lengths because of Firefox
  length = $(path).attr('length');
  // Clear any previous transition
  path.style.transition = path.style.WebkitTransition = path.style.MozTransition = 
  'none';
  // Set up the starting positions
  path.style.strokeDasharray = length + ' ' + length;
  path.style.strokeDashoffset = length;
  return length;
};

// For drawing the MHacks logo
function simulatePathDrawing(path, duration) {
  // grab the original values
  strokeDashoffset = path.style.getPropertyValue('stroke-dash-offset');
  strokeWidth = path.style.getPropertyValue('stroke-width');
  fill = path.style.getPropertyValue('fill');
  
  // do the stuff
  var length = resetPathDrawing(path);
  path.getBoundingClientRect();
  // Define our transition
  path.style.transition = path.style.WebkitTransition = path.style.MozTransition =
  'all ' + duration + 's ease-in';
  // Go!
  path.style.strokeDashoffset = strokeDashoffset;
  path.style.strokeWidth = strokeWidth;
  path.style.fill = fill;
};

function submitEmail() {
  var email = $("#email-input").val();
  if (validateEmail(email)) {
    swapForm(false);
    $("#upload-progress h2").text("Yeah, you're ready.");
    $("#upload-progress").removeClass('faded');
    var EmailDrop = Parse.Object.extend("EmailDrop");
    var obj = new EmailDrop();
    obj.set("email", email);
    obj.save(null, {
      success: function(obj) {
        // nuthin'
      },
      error: function(obj) {
        window.alert("I don't know what happened, but you should try that again.");
      }
    });
  }
  else if (email.length != 0) {
    swapForm(true);
    $("#upload-progress h2").text("I didn't Google that regex for nothing.");
    $("#upload-progress").removeClass('faded');
  }
}

function swapForm(unswap) {
  $("#email-form").addClass('faded');
  $("#email-input").val("");
  if(unswap) window.setTimeout(function() {
    $("#upload-progress").addClass('faded');
    $("#email-form").removeClass('faded');
  }, 5000);
}