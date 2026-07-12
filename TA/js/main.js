// Page Loader dynamic injection
(function() {
    var loaderHtml = '<div class="page-loader"><img src="images/logo.png" class="loader-logo" alt="Loading..." oncontextmenu="return false;"></div>';
    var injectLoader = setInterval(function() {
        if (document.body) {
            clearInterval(injectLoader);
            document.body.style.visibility = 'visible';
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = loaderHtml;
            var loaderNode = tempDiv.firstChild;
            document.body.insertBefore(loaderNode, document.body.firstChild);
        }
    }, 5);

    // Hide loader after 3000ms timeout
    setTimeout(function() {
        var loader = document.querySelector('.page-loader');
        if (loader) {
            loader.className += ' fade-out';
            setTimeout(function() {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 400);
        }
    }, 2000);
})();

var hoverColour = "#000000";

$(function(){
	$("a.hoverBtn").show("fast", function() {
		$(this).wrap("<div class=\"hoverBtn\">");
		$(this).attr("class", "");
	});
	
	//display the hover div
	$("div.hoverBtn").show("fast", function() {
		//append the background div
		$(this).append("<div></div>");
		
		//get link's size
		var wid = $(this).children("a").outerWidth();
		var hei = $(this).children("a").outerHeight();
		
		//set div's size
		$(this).width(wid);
		$(this).height(hei);
		$(this).children("div").width(wid);
		$(this).children("div").height(hei);
		
		//on link hover
		$(this).children("a").hover(function(){
			//store initial link colour
			if ($(this).attr("rel") == "") {
				$(this).attr("rel", $(this).css("color"));
			}
			//fade in the background
			$(this).parent().children("div")
				.stop()
				.css({"display": "none", "opacity": "1"})
				.fadeIn("fast");
			//fade the colour
			$(this)	.stop()
				.css({"color": $(this).attr("rel")})
				.animate({"color": hoverColour}, 350);
		},function(){
			//fade out the background
			$(this).parent().children("div")
				.stop()
				.fadeOut("slow");
			//fade the colour
			$(this)	.stop()
				.animate({"color": $(this).attr("rel")}, 250);
		});
	});
});

  document.addEventListener('DOMContentLoaded', () => {
    // Select all images on the page
    const images = document.querySelectorAll('img');
    
    // Disable right-click for each image
    images.forEach(img => {
      img.addEventListener('contextmenu', function(e) {
        e.preventDefault();
      });
    });
  });