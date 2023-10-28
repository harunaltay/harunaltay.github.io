var PRM = Sys.WebForms.PageRequestManager.getInstance();

PRM.add_beginRequest(BeginPostBack);
PRM.add_initializeRequest(ControlAsyncPostBack);

function BeginPostBack(sender, args) {
	HideProcessResult();
	if (/MSIE (5\.5|6\.)/.test(navigator.userAgent)) {
		FixProgressLocation();
		PRM.add_endRequest(FixProgressLocation);
		window.onscroll = FixProgressLocation;
	}
}

function AbortAsyncPostBack() {
	if (PRM.get_isInAsyncPostBack()) {
		PRM.abortPostBack();
	}
}

function ControlAsyncPostBack(sender, args) {
	if (PRM.get_isInAsyncPostBack()) {
		args.set_cancel(true);
		alert("Devam eden işleminiz var, lütfen bekleyin.");
	}
}