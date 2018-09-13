( function() {

		var YoutubeVideo = function(data, parent, width, height, imageFolder, langCode) {
			this.initialize(data, parent, width, height, imageFolder, langCode);
		};
		var p = YoutubeVideo.prototype;
		
		p.initialize = function(data, parent, width, height, imageFolder, langCode) {
			p.videoItem = $('<div class="video-item">').html('<div class="video-item-title">' + data.title + '</div><iframe class="youtube-player" width="' + width + '" height="' + height + '" frameborder="0" allowfullscreen></iframe><div class="video-play-button"></div><div class="video-caption">' + data.caption[langCode] + '</div></div>').appendTo(parent);
			p.videoItem.css({
				'background-image' : 'url("photo/' + imageFolder + '/' + data.poster + '")',
				"background-repeat" : "no-repeat",
				"background-position" : "0 30px"
			});
			return p.videoItem;
		};
		window.YoutubeVideo = YoutubeVideo;
	}()); 