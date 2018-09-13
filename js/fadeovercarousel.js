( function() {

		var FadeOverCarousel = function(images, pic1, pic2, fadeTime, changeTime, imageFolder) {
			this.initialize(images, pic1, pic2, fadeTime, changeTime, imageFolder);
		};
		var p = FadeOverCarousel.prototype;

		p.initialize = function(images, pic1, pic2, fadeTime, changeTime, imageFolder) {
			p.images = images;
			p.pic1 = pic1;
			p.pic2 = pic2;
			p.fadeTime = fadeTime;
			p.changeTime = changeTime;
			p.imageFolder = imageFolder;
			p.bioImageIndex = -1;
			p.picNum = 1;
			p.bioCarouselInView = false;
			p.bioImageChangeTimeOut = null;
			p.pic1.attr("src", "photo/" + imageFolder + "/" + images[0]);
		};
		p.start = function() {
			if (!p.bioCarouselInView) {
				p.bioCarouselInView = true;
				p.picNum = 1;
				p.bioImageIndex = -1;
				clearTimeout(p.bioImageChangeTimeOut);
				p.loadAndFadeImage();
			}
		};
		p.stop = function() {
			p.bioCarouselInView = false;			
		};
		p.loadAndFadeImage = function() {
			if (!p.bioCarouselInView) {
				return;
			}
			p.bioImageIndex++;
			if (p.bioImageIndex > p.images.length - 1) {
				p.bioImageIndex = 0;
			}
			if (p.picNum == 1) {
				picToFadeIn = p.pic1;
				picToFadeOut = p.pic2;
				p.picNum = 2;
			} else {
				picToFadeIn = p.pic2;
				picToFadeOut = p.pic1;
				p.picNum = 1;
			}
			picToFadeIn.attr("src", "photo/" + p.imageFolder + "/" + p.images[p.bioImageIndex]);
			picToFadeIn.hide();
			picToFadeIn.fadeIn(p.fadeTime);
			picToFadeOut.fadeOut(p.fadeTime);
			p.bioImageChangeTimeOut = setTimeout(p.loadAndFadeImage, p.changeTime);		   
		};
		window.FadeOverCarousel = FadeOverCarousel;
	}());
