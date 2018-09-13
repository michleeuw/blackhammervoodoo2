$(document).ready(function() {
	var siteData;
	var menuButton = $("#menu-button");
	var menuCloseButton = $("#menu-close-button");
	var scrollDownArrow = $("#scroll-down-arrow");
	var nav = $("#nav");
	var logo = $("#logo");
	var bioText = $("#bio-text");
	var bioPic1;
	var bioPic2;
	var bioImages;
	var index1 = 0;
	var index2 = -1;
	var fadeTime = 2500;
	var changeTime = 5000;
	var dutchFlag = $("#dutch-flag");
	var englishFlag = $("#english-flag");
	var languageCode = 0;
	var audioPlayerHolder = $("#audio-player-holder");
	var audioElement = null;
	var audioType = "";
	var songIndex = 0;
	var songLoadProgressInfo = $(".song-load-progress-info");
	var curPlayer;
	var curPlayButton;
	var youtubeWidth = 316;
	var youtubeHeight = 180;
	var imageFolder = "small";
	var bioCarouselInView = true;

	var bioData;
	var photoData;
	var audioData;
	var videoData;
	var dateData;
	var contactData;

	function init() {
		if ($(document).width() > 768) {
			imageFolder = "large";
			youtubeWidth = 800;
			youtubeHeight = 502;
		}
		$.getJSON("data/sitedata.json", function(json) {
			$.get('templates/templateparts.html', function(template, textStatus, jqXhr) {
				siteData = json;
				bioData = json[1];
				photoData = json[2];
				audioData = json[3];
				videoData = json[4];
				dateData = json[5];
				contactData = json[6];

				var navTemplate = $(template).filter('#navTpl').html();
				$.each(json, function(index, json) {
					json.thisTitle = json.title[languageCode];
					var navEl = Mustache.render(navTemplate, json);
					$('#nav > ul').append(Mustache.render(navTemplate, json));
				});
				$('#nav').find('li a').each(function(i) {
					$(this).click(function($e) {
						$e.preventDefault();
						var pageName = $(this).attr("href");
						if (pageName == "facebook") {
							window.open("https://www.facebook.com/bhvmusic/", '_blank');
						} else {
							$("#nav li a").removeClass("active");
							$(this).addClass('active');
							var topValue = document.getElementById(pageName).offsetTop;
							scrollToSection(topValue);
							menuCloseButton.trigger("click");
						}
					});
				});
				
				var bioTemplate = $(template).filter('#bioTpl').html();
				bioData.thisBioHeading = bioData.title[languageCode];
				bioData.thisBioText = bioData.description[languageCode];

				$.each(bioData.members, function(index, data) {
					data.thisMemberText = data.text[languageCode];
					data.thisMemberPhoto = "photo/small/" + data.photo;
				});
				var bioEl = Mustache.render(bioTemplate, json);
				$('#bio').append(Mustache.render(bioTemplate, bioData));

				bioImages = bioData.images;
				bioPic1 = $("#bio-pic1");
				bioPic2 = $("#bio-pic2");
				loadImage1();
				$('#bio').find('.caption').text(bioData.caption);

				var photoTemplate = $(template).filter('#photoTpl').html();
				photoData.thisPhotoHeading = photoData.title[languageCode];
				$.each(photoData.photos, function(index, data) {
					data.largePhoto = "photo/large/" +data.image;
					data.smallPhoto = "photo/small/" +data.image;					
				});
				$('#photo').append(Mustache.render(photoTemplate, photoData));
				
				var audioTemplate = $(template).filter('#audioTpl').html();
				audioData.thisAudioHeading = audioData.title[languageCode];
				audioData.thisAudioDescr = audioData.description[languageCode];
				$('#audio').append(Mustache.render(audioTemplate, audioData));
				
				$('#audio').find('li a').each(function(i) {
					$(this).click(function($e) {
						$e.preventDefault();
						$("#audio li a").removeClass("active");
						$(this).addClass('active');
						songIndex = $("#audio li a").index(this);
						var fileName = audioData.songs[songIndex].file;
						var path = "music/" + fileName + "." + audioType;
						audioPlayerHolder.show();
						audioElement.setAttribute("src", path);
						audioElement.addEventListener("canplaythrough", songLoaded, false);
						audioElement.addEventListener("progress", songLoadProgress, false);
					});
				});
				
				$.each(videoData.videos, function(index, data) {
					var youtubeVideo = new YoutubeVideo(data, '#video > .section-content', youtubeWidth, youtubeHeight, imageFolder, languageCode);
				});
				
				var datesTemplate = $(template).filter('#datesTpl').html();
				$.each(dateData.giglist, function(index, data) {
					$.each(data.dates, function(ind, dat) {
						var dateData = data.dates[ind];
						dateData.thisDay = dateData.day[languageCode];
						dateData.thisDate = dateData.date[languageCode];
						dateData.thisTime = dateData.time[languageCode];
					});
				});
				$('#dates').append(Mustache.render(datesTemplate, dateData));
				
				var contactTemplate = $(template).filter('#contactTpl').html();
				contactData.thisContactHeading = audioData.title[languageCode];
				$('#contact').append(Mustache.render(contactTemplate, contactData));

				$(".section-heading").each(function(i) {
					if (i > 0) {
						$(this).text(siteData[i].title[languageCode]);
					}
				});
				audioElement = document.getElementById("audio-player");
				audioPlayerHolder.hide();
				audioType = supportedAudioFormat(audioElement);

				if (audioType == "") {
					alert("no audio support");
					return;
				}
				$(".video-item").each(function(i) {
					$(this).live("click", function() {
						if (curPlayer != undefined) {
							curPlayer.attr("src", "");
							curPlayButton.show();
						}
						curPlayer = $(".youtube-player").eq(i);
						curPlayButton = $(".video-play-button").eq(i);
						vidSource = videoData.videos[i].videoEmbed;
						curPlayButton.hide();
						curPlayer.attr("src", vidSource);
					});
				});				
			});
		});
	}


	$.fn.scrollEnd = function(callback, timeout) {
		$(this).scroll(function() {
			var $this = $(this);
			if ($this.data('scrollTimeout')) {
				clearTimeout($this.data('scrollTimeout'));
			}
			$this.data('scrollTimeout', setTimeout(callback, timeout));
		});
	};

	$(window).scrollEnd(function() {
		if ($(window).scrollTop() < 1440) {
			bioCarouselInView = true;
			var index1 = 0;
			var index2 = -1;
			loadImage1();
		} else {
			bioCarouselInView = false;
		}
	}, 1000);

	function loadImage1() {
		if (!bioCarouselInView) {
			return;
		}
		index1 = index2 + 1;
		if (index1 > bioImages.length - 1) {
			index1 = 0;
		}
		bioPic1.attr("src", "photo/" + imageFolder + "/" + bioImages[index1]);
		bioPic1.load(function() {
			bioPic2.fadeOut(fadeTime);
			bioPic1.fadeIn(fadeTime);
			setTimeout(loadImage2, changeTime);
		});
	}

	function loadImage2() {
		if (!bioCarouselInView) {
			return;
		}
		index2 = index1 + 1;
		if (index2 > bioImages.length - 1) {
			index2 = 0;
		}
		bioPic2.attr("src", "photo/" + imageFolder + "/" + bioImages[index2]);
		bioPic2.load(function() {
			bioPic1.fadeOut(fadeTime);
			bioPic2.fadeIn(fadeTime);
			setTimeout(loadImage1, changeTime);
		});
	}


	$.fn.scrollEnd = function(callback, timeout) {
		$(this).scroll(function() {
			var $this = $(this);
			if ($this.data('scrollTimeout')) {
				clearTimeout($this.data('scrollTimeout'));
			}
			$this.data('scrollTimeout', setTimeout(callback, timeout));
		});
	};

	function changeLanguage(lc) {
		menuCloseButton.trigger("click");
		if (lc == languageCode) {
			return;
		} else {
			languageCode = lc;			
		}
		$("#bio-text").html(bioData.description[languageCode]);
		$(".section-heading").each(function(i) {
			if (i > 0) {
				$(this).text(siteData[i].title[languageCode]);
			}
		});
		$('#nav').find('li a').each(function(i) {
			$(this).text(siteData[i].title[languageCode]);

		});
		$('#bio').find(".member-text").each(function(i) {
			$(this).html(bioData.members[i].text[languageCode]);
		});
		$('#audio').find('.description').html(audioData.description[languageCode]);
		$('#video').find(".video-caption").each(function(i) {
			$(this).text(videoData.videos[i].caption[languageCode]);
		});
		$('#dates').find('.year-item').each(function(i) {
			$(this).find('.date-item').each(function(j) {
				$(this).find('.day-span').text(dateData.giglist[i].dates[j].day[languageCode]);
				$(this).find('.date-span').text(dateData.giglist[i].dates[j].date[languageCode]);
				$(this).find('.time-span').text(dateData.giglist[i].dates[j].time[languageCode]);
			});
		});
	}

	function getScrollTopElement() {
		if (document.compatMode !== 'CSS1Compat')
			return 'body';

		var html = document.documentElement;
		var body = document.body;
		var startingY = window.pageYOffset || body.scrollTop || html.scrollTop;
		var newY = startingY + 1;
		window.scrollTo(0, newY);
		var element = (html.scrollTop === newY ) ? 'html' : 'body';
		window.scrollTo(0, startingY);
		return element;
	}

	function setActiveMenuItem(itemName) {
		$("#nav li a").removeClass("active");
		for (var i = 0; i < siteData.length; i++) {
			if (siteData[i].name == itemName) {
				var selectedItem = $("#nav ul li a").eq(i);
				selectedItem.addClass('active');
			}
		}
	}

	function scrollToSection(val) {
		scrollTopElement = getScrollTopElement();

		$(scrollTopElement).stop().animate({
			scrollTop : val
		}, 1000);
	}

	function supportedAudioFormat(audio) {
		var returnExtension = "";
		if (audio.canPlayType("audio/mp3") == "probably" || audio.canPlayType("audio/mp3") == "maybe") {
			returnExtension = "mp3";
		} else if (audio.canPlayType("audio/ogg") == "probably" || audio.canPlayType("audio/ogg") == "maybe") {
			returnExtension = "ogg";
		} else if (audio.canPlayType("audio/wav") == "probably" || audio.canPlayType("audio/wav") == "maybe") {
			returnExtension = "wav";
		}
		return returnExtension;
	}

	function songLoadProgress() {
		var perc = parseInt(((audioElement.buffered.end(0) / audioElement.duration) * 100));
		songLoadProgressInfo.text(perc + " %");
	}

	function songLoaded() {
		audioElement.removeEventListener("progress", songLoadProgress, false);
		songLoadProgressInfo.text("");
		audioElement.play();
		audioElement.removeEventListener("canplaythrough", songLoaded, false);
		audioElement.addEventListener("ended", songEnded, false);
	}

	function songEnded() {
		audioElement.removeEventListener("ended", songEnded, false);
		$("#audio").find(".song-item").eq(songIndex).removeClass("active");
		if (songIndex < audioData.songs.length - 1) {
			songIndex++;
		} else {
			songIndex = 0;
		}
		$("#audio").find(".song-item").eq(songIndex).addClass('active');
		var fileName = audioData.songs[songIndex].file;
		var path = "music/" + fileName + "." + audioType;
		audioElement.setAttribute("src", path);
		audioElement.addEventListener("canplaythrough", songLoaded, false);
	}


	menuButton.click(function($e) {
		$e.preventDefault();
		menuButton.fadeOut("slow");
		nav.stop().animate({
			marginLeft : 0
		}, 500);
	});

	menuCloseButton.click(function($e) {
		$e.preventDefault();
		menuButton.fadeIn("slow");
		nav.stop().animate({
			marginLeft : -330
		}, 1000);

	});

	scrollDownArrow.click(function() {
		setActiveMenuItem("bio");
		var topValue = document.getElementById("video").offsetTop;
		scrollToSection(topValue);
	});

	dutchFlag.click(function() {
		changeLanguage(0);
	});

	englishFlag.click(function() {
		changeLanguage(1);
	});

	setTimeout(function() {
		if ($(document).width() > 768) {
			$('#thumb-container a').lightBox({
				fixedNavigation : true
			});
		}
		var hash = window.location.hash;
		if (hash != "" && hash != "#facebook") {
			var menuItemName = location.hash.slice(1);
			setActiveMenuItem(menuItemName);
			var topValue = document.getElementById(menuItemName).offsetTop;
			scrollToSection(topValue);
		} else {
			var selectedItem = $("#nav ul li a").eq(0);
			selectedItem.addClass('active');
		}
		scrollDownArrow.fadeIn("slow");
	}, 1000);

	init();
});
