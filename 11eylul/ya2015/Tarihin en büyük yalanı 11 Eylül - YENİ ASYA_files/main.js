$(window).bind("scroll", function () {
	var nav = $(".navigation");
	if ($(window).scrollTop() <= 326) {
		nav.removeClass("navigation-fixed");
	}
	else if ($(window).scrollTop() < 388) {
		nav.addClass("navigation-fixed");
		nav.css("top", ($(document).scrollTop() - 388) + "px");
	}
	else {
		nav.css("top", "0");
		nav.addClass("navigation-fixed");
	}
});

var Colon = true;
function UpdateTime() {
	var Now = new Date();
	$(".hour").html(LeftZero(Now.getHours(), 2));
	$(".colon").html(Colon ? ":" : " ");
	$(".minute").html(LeftZero(Now.getMinutes(), 2));
	Colon = Colon ? false : true;
	setTimeout("UpdateTime()", 500);
}

function GetWeather(LocationCode) {
	$(".weather select").val(LocationCode);
	Cookies.Add("weather-location", LocationCode, 365);
	$.ajax({
		url: "/common/api.aspx?url=" + encodeURIComponent("http://weather.service.msn.com/data.aspx?weadegreetype=c&src=outlook&culture=tr-tr&wealocations=wc:" + LocationCode),
		dataType: "xml",
		success: function (result) {
			var weather = $(result).find("weather");
			var current = $(result).find("current");
			var forecast = $(result).find("forecast").first();
			$(".temperature").html(current.attr("temperature") + "°");
			$(".weather .image").css({ "background-image": "url(" + weather.attr("imagerelativeurl").replace("http:", "https:") + "tmw/" + current.attr("skycode") + "_18x.png)" });
			$(".high-low").html(forecast.attr("high") + "°/" + forecast.attr("low") + "°");
		}
	});
}

function GetCurrencies() {
	$.ajax({
		url: "/common/api.aspx?url=" + encodeURIComponent("http://api.bigpara.hurriyet.com.tr/doviz/headerlist/anasayfa"),
		dataType: "json",
		success: function (result) {
			with (result) {
				$(".dolar b").html(data[6].KAPANIS.toString().substring(0, 6).replace(".", ","));
				$(".dolar").addClass(data[6].YUZDEDEGISIM > 0 ? "increased" : "decreased");
				$(".euro b").html(data[3].KAPANIS.toString().substring(0, 6).replace(".", ","));
				$(".euro").addClass(data[3].YUZDEDEGISIM > 0 ? "increased" : "decreased");
				$(".imkb b").html(data[1].KAPANIS.toString().substring(0, 7).replace(".", ","));
				$(".imkb").addClass(data[1].YUZDEDEGISIM > 0 ? "increased" : "decreased");
				$(".altin b").html(data[5].KAPANIS.toString().substring(0, 6).replace(".", ","));
				$(".altin").addClass(data[5].YUZDEDEGISIM > 0 ? "increased" : "decreased");
			}
		}
	});
}

var CountDays = 0;
var TotalDays = Math.floor((new Date().valueOf() - new Date("2017-02-28").valueOf() + (1000 * 60 * 60 * 3)) / 1000 / 60 / 60 / 24);
function CountMonopoly() {
	CountDays += 1;
	if (CountDays <= TotalDays) {
		$(".monopoly a p b").html(CountDays + ".");
		setTimeout("CountMonopoly()", 25);
	}
}

function CountMonopolyTimer() {
	CountDays = 0;
	CountMonopoly();
	setTimeout("CountMonopolyTimer()", 20 * 1000);
}

var SalaatTimer;
function GetSalaatTimes(City) {
	$(".salaat-times select").val(City);
	Cookies.Add("salaat-city", City, 365);
	$.ajax({
		//url: "/common/api.aspx?url=" + encodeURIComponent("https://ezanvakti.herokuapp.com/vakitler?ilce=" + City),
		url: "https://ezanvakti.herokuapp.com/vakitler?ilce=" + City,
		dataType: "json",
		success: function (result) {
			var SalaatTimes = ["Imsak", "Gunes", "Ogle", "Ikindi", "Aksam", "Yatsi"];
			var SalaatTexts = ["İmsaka", "Güneşe", "Öğleye", "İkindiye", "Akşama", "Yatsıya"];
			var Salaat = {};
			var NextSalaatTime;
			for (Item in SalaatTimes) {
				var SalaatTime = SalaatTimes[Item];
				var TimeArray = result[0][SalaatTime].split(":");
				Salaat[SalaatTime] = new Date(new Date().setHours(TimeArray[0], TimeArray[1], 0));
				$("#" + SalaatTime + " span").html(result[0][SalaatTime]);
			}
			for (Item in SalaatTimes) {
				var SalaatTime = SalaatTimes[Item];
				var Now = new Date();
				$("#" + SalaatTime).removeClass("selected");
				if (Now > Salaat[SalaatTime]) {
					$("#" + SalaatTimes[Item - 1]).removeClass("selected");
					$("#" + SalaatTime).addClass("selected");
					CountDownText = SalaatTexts[parseInt(Item) + 1];
					NextSalaatTime = Salaat[SalaatTimes[parseInt(Item) + 1]];
				}
				if (Now < Salaat["Imsak"]) {
					$("#Yatsi").addClass("selected");
					CountDownText = SalaatTexts[0];
					NextSalaatTime = Salaat["Imsak"];
				}
				if (NextSalaatTime == undefined) {
					CountDownText = SalaatTexts[0];
					NextSalaatTime = new Date(Salaat["Imsak"].valueOf() + 24 * 3600000);
				}
			}
			$(".remainder label").html(CountDownText + " kalan süre:");
			var TimeToNextSalaat = NextSalaatTime.valueOf() - Now.valueOf();
			clearInterval(SalaatTimer);
			SalaatTimer = setInterval(function () {
				var CountTime = new Date(TimeToNextSalaat -= 1000);
				$(".remainder span").html(
					LeftZero(CountTime.getUTCHours(), 2) + ":" +
					LeftZero(CountTime.getUTCMinutes(), 2) + ":" +
					LeftZero(CountTime.getUTCSeconds(), 2)
				);
				if (TimeToNextSalaat < 1000) {
					GetSalaatTimes(City);
				}
			}, 1000);
		}
	});
}

function ShowPopup(Selector) {
	$(Selector).css("display", "block");
	$("body").attr("style", "overflow: hidden; margin-right: 17px;");
	$(".top, .main, .foot").attr("style", "filter: blur(5px); -webkit-filter: blur(5px);");
}

function HidePopup(Selector) {
	$("body, .top, .main, .foot, " + Selector).removeAttr("style");
}

function InitSlideShow() {
	var images = $(".page-content-details.type-6 .content-image img, .page-content-details.type-6 .details img");
	var slides;
	$(".container").prepend("<div class=\"pop-up slide-show\"><div class=\"slider-for\"></div><div class=\"slider-nav\"></div><h3 class=\"title\"></h3><a class=\"previous\">‹</a><a class=\"next\">›</a><a class=\"close\">×</a></div>");
	images.each(function (index) {
		if ($(this).width() > 299) {
			$(this).addClass("image-to-slide");
			$(this).before("<div class=\"zoom\">🔍</div>");
			$(".slider-for").append("<div class=\"item id-" + index + " fill-bg\" style=\"background-image: url(" + this.src + ")\"></div>");
		}
	});
	images = $(".image-to-slide");
	images.click(function () {
		ShowPopup(".slide-show");
		if (!slides) {
			slides = $(".slider-for");
			$(".slider-nav").html(slides.html());
			slides.slick({ arrows: false });
			slides.on("beforeChange", function (event, slick, currentSlide, nextSlide) {
				$(".slider-nav .item").removeClass("selected");
				$(".slider-nav .item.id-" + nextSlide).addClass("selected");
			});
			$(".slider-nav .item").mousemove(function () {
				slides.slick("slickSetOption", "speed", 1);
				slides.slick("slickGoTo", $(".slider-nav .item").index(this));
			});
			$(".slider-nav .item").mouseout(function () {
				slides.slick("slickSetOption", "speed", 300);
			});
			$(".slide-show .previous").click(function () {
				slides.slick("slickPrev");
			});
			$(".slide-show .next").click(function () {
				slides.slick("slickNext");
			});
			$(".slide-show .close").click(function () {
				HidePopup(".slide-show");
			});
			$(document).keyup(function (e) {
				if (e.keyCode == 27) {
					HidePopup(".slide-show");
				}
			});
		}
		if (images.length > 1) {
			var slideTo = images.index(this);
			$(".slider-nav .item.id-" + slideTo).addClass("selected");
			slides.slick("slickGoTo", slideTo);
		}
		else {
			$(".slider-nav, .slide-show .previous, .slide-show .next").remove();
		}
	});
}

function PopBanner(Name, Url) {
	if (navigator.cookieEnabled && Cookies["banner-popped"] == undefined && Cookies[Name] == undefined) {
		Cookies.Add("banner-popped", location, 0.2);
		Cookies.Add(Name, location, 1);
		$(".container").prepend("<div class=\"pop-up pop-banner\" style=\"background: rgba(0, 0, 0, 0.6);\"><iframe style=\"border: none; width: 100%; height: 100%;\" src=\"" + Url + "\"></iframe></div>");
		ShowPopup(".pop-banner");
	}
}

$(document).ready(function () {
	if (!IsMobile && !IsLocal) {
		$(".item a, .list .box-label a").attr("target", "_blank");
	} else {
		$(".page-content-details .share .whatsapp").css("display", "block");
	}
	UpdateTime();
	$(".currencies").slick({ slide: "div", autoplay: true, arrows: false, vertical: true });
	$(".right .headlines").slick({ slide: "div", autoplay: true, dots: true, autoplaySpeed: 4000 });
	var WeatherLocation = Cookies["weather-location"];
	GetWeather(WeatherLocation == undefined || WeatherLocation == "" ? "TUXX0014" : WeatherLocation);
	//CountMonopolyTimer();
	var SalatCity = Cookies["salaat-city"];
	GetSalaatTimes(!$.isNumeric(SalatCity) ? 9541 : SalatCity);
	GetCurrencies();
	InitSlideShow();
	//SetBanner();
});

$(window).load(function () {
	//PopBanner("zekat-fitre-2023", "/sites/yeniasya/static/zekat-fitre-2023.html");
	//PopBanner("kurban-2022", "/sites/yeniasya/static/kurban-2022.html");
	//PopBanner("kongre-2023", "/sites/yeniasya/static/kongre-2023.html");
});