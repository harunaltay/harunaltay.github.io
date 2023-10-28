ValidationError = false;

function ValidationMessage(ControlToValidate, Message) {
	if (ValidationError) {
		alert(Message);
		if (ControlToValidate.type != "hidden") {
			ControlToValidate.focus();
		}
	}
}

function RequiredFieldValidator(ControlToValidate, ErrorMessage) {
	var InputValue;
	ControlToValidate = document.forms.aspnetForm[ControlToValidate];
	if (ControlToValidate.length && ControlToValidate[0].type == "radio") {
		for (i = 0; i < ControlToValidate.length; i++) {
			if (ControlToValidate[i].checked) {
				InputValue = ControlToValidate[i].value;
			}
		}
		ControlToValidate = ControlToValidate[0];
	}
	else if (ControlToValidate.type == "checkbox") {
		InputValue = ControlToValidate.checked;
	}
	else {
		InputValue = ControlToValidate.value;
	}
	if (!ValidationError && !InputValue) {
		ValidationError = true;
		ValidationMessage(ControlToValidate, ErrorMessage);
	}
}

function DateOnClientValidate(source, args) {
	var ControlPrefix = source.id.replace("CVDate", "");
	var Day = GetElementById(ControlPrefix + "DDLDay").value;
	var Month = GetElementById(ControlPrefix + "DDLMonth").value;
	var Year = GetElementById(ControlPrefix + "DDLYear").value;
	var ErrorMessage;
	if (Day || Month || Year) {
		if (!Day || !Month || !Year) {
			ErrorMessage = LocaleResources[source.id + "_IncompleteText"];
		}
		else if (Month == "02") {
			var SecondMonthRange = 28;
			if (Year % 4 == 0) {
				SecondMonthRange += 1;
			}
			if (Day > SecondMonthRange) {
				ErrorMessage = String.format(LocaleResources[source.id + "_Days28Text"], Year, SecondMonthRange);
			}
		}
		else if ((Month == "04" || Month == "06" || Month == "09" || Month == "11") && Day > 30) {
			ErrorMessage = String.format(LocaleResources[source.id + "_Days30Text"], 30);
		}
	}
	else if (source.getAttribute("Required").toLowerCase() == "true") {
		ErrorMessage = LocaleResources[source.id + "_RequiredText"];
	}
	args.IsValid = true;
	if (ErrorMessage) {
		source.innerHTML = "<br />" + ErrorMessage;
		args.IsValid = false;
	}
}

function ShowObject(Item) {
	GetElementById(Item).style.display = "block";
}

function HideObject(Item) {
	GetElementById(Item).style.display = "none";
}

function SelectCheckbox(Item) {
	GetElementById(Item).checked = !GetElementById(Item).checked;
}

function HideProcessResult() {
	//
}