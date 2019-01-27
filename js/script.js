
$(document).ready(function() {
	
	/* lightbox */
	/* create an initial array of large images */
var numImages = 16; // change to total number of images in your portfolio
var slides = []; // create the slides array
/* populate the array with image paths */
for (var i = 1; i <= numImages; i++) {
	slides.push("img/large/pic" + i + ".jpg");
}


var cur = 0;
console.log(cur);

function openSlideshow() { // run th
  var curSlide = $(this).attr("src");
  var slideNum = curSlide.match(/\d+/);

  var prevpix = parseInt(slideNum) - 1;
  var cur = parseInt(slideNum);
  var nextpic = parseInt(slideNum) + 1;
  var imgsrc = curSlide.replace('_thumb', '');
  var filename = imgsrc.replace(/^.*[\\\/]/, '');
  
  $('body, #lightbox').addClass('single_view');
  $('#largeImg').html('<img src="img/large/' + filename + '">')
}

function closeSlideshow() {
  $('body, #lightbox').removeClass('single_view');
}

function prevPic(){
	if(cur>0) {
   cur--;
   }
   else {
   	cur=15;
   }
   console.log(cur);

   var curSlide = slides[cur];
   console.log(curSlide);
$("#largeImg img").attr("src", curSlide);
}

function nextPic(){
	if(cur<15) {
   cur++;
   }
   else {
   	cur=0;
   }
   console.log(cur);

   var curSlide = slides[cur];
   console.log(curSlide);
$("#largeImg img").attr("src", curSlide);
// $("#largeImg img").addClass('slideLeft');
}


/* open the lightbox when a thumbnail is clicked */
$('#gallery img').click(openSlideshow);


/* close, prev and next controls */
$('.prev').click(prevPic);
$('.next').click(nextPic);
$('.close').click(closeSlideshow);


/* keyboard controls */
$("body").keydown(function(e) {
  if(e.keyCode == 37) { // left
    prevPic();
  }
  else if(e.keyCode == 39) { // right
    nextPic();
  }

    else if(e.keyCode == 27) { // exc
    closeSlideshow();
  }
});




/* swipe through images */
(function($) {
  $.fn.swipeDetector = function(options) {
    // States: 0 - no swipe, 1 - swipe started, 2 - swipe released
    var swipeState = 0;
    // Coordinates when swipe started
    var startX = 0;
    // Distance of swipe
    var pixelOffsetX = 0;
    // Target element which should detect swipes.
    var swipeTarget = this;
    var defaultSettings = {
      // Amount of pixels, when swipe don't count.
      swipeThreshold: 70,
      // Flag that indicates that plugin should react only on touch events.
      // Not on mouse events too.
      useOnlyTouch: false
    };

    // Initializer
    (function init() {
      options = $.extend(defaultSettings, options);
      // Support touch and mouse as well.
      swipeTarget.on("mousedown touchstart", swipeStart);
      $("html").on("mouseup touchend", swipeEnd);
      $("html").on("mousemove touchmove", swiping);
    })();

    function swipeStart(event) {
      if (options.useOnlyTouch && !event.originalEvent.touches) return;

      if (event.originalEvent.touches) event = event.originalEvent.touches[0];

      if (swipeState === 0) {
        swipeState = 1;
        startX = event.clientX;
      }
    }

    function swipeEnd(event) {
      if (swipeState === 2) {
        swipeState = 0;

        if (
          Math.abs(pixelOffsetX) > options.swipeThreshold
        ) {
          // Horizontal Swipe
          if (pixelOffsetX < 0) {
            swipeTarget.trigger($.Event("swipeLeft.sd"));
            console.log("Left");
          } else {
            swipeTarget.trigger($.Event("swipeRight.sd"));
            console.log("Right");
          }
        } 
        }
      
    }

    function swiping(event) {
      // If swipe don't occuring, do nothing.
      if (swipeState !== 1) return;

      if (event.originalEvent.touches) {
        event = event.originalEvent.touches[0];
      }

      var swipeOffsetX = event.clientX - startX;

      if (
        Math.abs(swipeOffsetX) > options.swipeThreshold
      ) {
        swipeState = 2;
        pixelOffsetX = swipeOffsetX;
      }
    }

    return swipeTarget; // Return element available for chaining.
  };
})(jQuery);
$("document").ready(function() {
  $("#largeImg")
    .swipeDetector()
    .on("swipeLeft.sd swipeRight.sd", function(event) {
      if (event.type === "swipeLeft") {
        nextPic();
      } else if (event.type === "swipeRight") {
        prevPic();
      } 
    });
});




/* lazyload */
	var lazyloadImages;    

	if ("IntersectionObserver" in window) {
		lazyloadImages = document.querySelectorAll(".lazy");
		var imageObserver = new IntersectionObserver(function(entries, observer) {
			console.log(observer);
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					var image = entry.target;
					image.src = image.dataset.src;
					image.classList.remove("lazy");
					imageObserver.unobserve(image);
				}
			});
		}, {
			root: document.querySelector("#container"),
			rootMargin: "0px 0px 500px 0px"
		});

		lazyloadImages.forEach(function(image) {
			imageObserver.observe(image);
		});
	} else {  
		var lazyloadThrottleTimeout;
		lazyloadImages = $(".lazy");
		
		function lazyload () {
			if(lazyloadThrottleTimeout) {
				clearTimeout(lazyloadThrottleTimeout);
			}    

			lazyloadThrottleTimeout = setTimeout(function() {
					var scrollTop = $(window).scrollTop();
					lazyloadImages.each(function() {
							var el = $(this);
							if(el.offset().top < window.innerHeight + scrollTop + 500) {
								var url = el.attr("data-src");
								el.attr("src", url);
								el.removeClass("lazy");
								lazyloadImages = $(".lazy");
							}
					});
					if(lazyloadImages.length == 0) { 
						$(document).off("scroll");
						$(window).off("resize");
					}
			}, 20);
		}

		$(document).on("scroll", lazyload);
		$(window).on("resize", lazyload);
	}
})



