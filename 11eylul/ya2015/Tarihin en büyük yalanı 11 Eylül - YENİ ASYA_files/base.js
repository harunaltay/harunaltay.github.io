var IsLocal = (location.host == "localhost");
var ErrorMode = IsLocal;
var IsMobile = /Android|webOS|Phone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
var LocaleResources = new Array();

window.onerror = function(Description, Page, Line, Chr) {
	var ErrorText = "Hata oluştu!\n"
	+ "\nAçıklama:\t" + Description
	+ "\nAdres:\t" + Page
	+ "\nSatır:\t" + Line;
	if (ErrorMode) {
		alert(ErrorText);
	}
	else if (OutputMode) {
		ErrorText = ErrorText.replace(/\n/g, "<br>");
		Output(ErrorText);
	}
	return true;
};

function SetFormAction(Url) {
	document.forms.aspnetForm.action = Url;
}

function GetSrcElement(event) {
	SrcElement = event.srcElement || event.target;
	return SrcElement;
}

function GetElementById(Item) {
	if (!Item.id) {
		Item = document.getElementById(Item);
	}
	return Item;
}

function Go(Url, Target) {
	if (Target) {
		window.open(Url, Target);
	}
	else {
		location.href = Url;
	}
}

function OpenWindow(Url, Name, Width, Height, Top, Left) {
	Top = Top == null ? (screen.height / 2) - (Height / 2): Top;
	Left = Left == null ? (screen.width / 2) - (Width / 2) : Left;
	return window.open(Url, Name, "width=" + Width + ", height=" + Height + ", top=" + Top + ", left=" + Left);
}

String.prototype.format = function () {
	var s = this;
	for (var i = 0; i < arguments.length; i++) {
		s = s.replace(new RegExp("\\{" + i + "\\}", "gm"), arguments[i]);
	}
	return s;
}

function LeftZero(Text, Size) {
	for (i = 0; i < Size; i++) {
		Text = "0" + Text;
	}
	return Text.slice(-Size);
}

var Cookies = {
	Init: function () {
		var AllCookies = document.cookie.split("; ");
		for (var i = 0; i < AllCookies.length; i++) {
			var CookiePair = AllCookies[i].split("=");
			this[CookiePair[0]] = CookiePair[1];
		}
	},
	Add: function (Name, Value, Days) {
		if (!Days) {
			Days = 180;
		}
		var ExpireDate = new Date();
		ExpireDate.setTime(ExpireDate.getTime() + (Days * 24 * 60 * 60 * 1000));
		document.cookie = Name + "=" + Value + "; expires=" + ExpireDate.toGMTString() + "; path=/";
		this[Name] = Value;
	},
	Remove: function (Name) {
		this.Add(Name, "", -1);
		this[Name] = undefined;
	}
};
Cookies.Init();

function Init() {
	//
}