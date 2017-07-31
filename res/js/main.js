//var device_session = $('input[id="device-session"]').value;
$(document).ready(function () {
	$('input:radio[id^="power-radio-"]').on("change", function (event) {
		var id = $(this).attr('id');

		switch (id) {
			case 'power-radio-0':
				$("#power-state-val").text('開機');
				break;
			case 'power-radio-1':
				$("#power-state-val").text('關機');
				break;
			default:
				break;
		}
	});

	$('input:radio[id^="fan-radio-"]').on("change", function (event) {
		var id = $(this).attr('id');

		switch (id) {
			case 'fan-radio-0':
				$("#fan-state-val").text('自動');
				break;
			case 'fan-radio-1':
				$("#fan-state-val").text('強');
				break;
			case 'fan-radio-2':
				$("#fan-state-val").text('中');
				break;
			case 'fan-radio-3':
				$("#fan-state-val").text('弱');
				break;
			default:
				break;
		}
	});
	$('#inTempSlider').slider();
	$('#inTempSlider').on("slide", function (slideEvt) {
		$("#inTempSliderVal").text(slideEvt.value);
	});

	$('#airConTempSlider').slider();
	$('#airConTempSlider').on("slide", function (slideEvt) {
		$("#airConTempSliderVal").text(slideEvt.value);
	});
})

function tooglePower() {
	var isOpen = $('input[id="power-radio-0"]:checked').val();
	if (isOpen == "on") {
		// close
		$('input[id="power-radio-1"]').prop("checked", true);
		$("#power-state-val").text('關機');
	} else {
		// open
		$('input[id="power-radio-0"]').prop("checked", true);
		$("#power-state-val").text('開機');
	}
}

function toogleFan() {
	//console.log($('#remote-fan-0').value);
	$('#remote-fan-0').css('opacity', 0.1);
	$('#remote-fan-1').css('opacity', 0.1);
	$('#remote-fan-2').css('opacity', 0.1);
	$('#remote-fan-3').css('opacity', 0.1);

	if ($('input[id="fan-radio-0"]:checked').val() == "on") {
		//console.log("自動");
		$('input[id="fan-radio-1"]').prop("checked", true);
		$('#remote-fan-1').css('opacity', 1);
		$("#fan-state-val").text('強');
	} else if ($('input[id="fan-radio-1"]:checked').val() == "on") {
		//console.log("強");
		$('input[id="fan-radio-2"]').prop("checked", true);
		$('#remote-fan-2').css('opacity', 1);
		$("#fan-state-val").text('中');
	} else if ($('input[id="fan-radio-2"]:checked').val() == "on") {
		//console.log("中");
		$('input[id="fan-radio-3"]').prop("checked", true);
		$('#remote-fan-3').css('opacity', 1);
		$("#fan-state-val").text('弱');

	} else if ($('input[id="fan-radio-3"]:checked').val() == "on") {
		//console.log("弱");
		$('input[id="fan-radio-0"]').prop("checked", true);
		$('#remote-fan-0').css('opacity', 1);
		$("#fan-state-val").text('自動');
	} else {
		console.log($('input[id="fan-radio-0"]:checked').val());
		console.log($('input[id="fan-radio-1"]:checked').val());
		console.log($('input[id="fan-radio-2"]:checked').val());
		console.log($('input[id="fan-radio-3"]:checked').val());
	}
}

function warnUp() {
	var airConTemp = parseInt($('#remote-temp-value').text());
	if (airConTemp < 32) {
		var newTemp = airConTemp + 1;
		$('#airConTempSliderVal').text('' + newTemp);
		$("#remote-temp-value").text('' + newTemp);
		$('#airConTempSlider').slider('setValue', newTemp);
	} else {

	}
}

function coolDown() {
	var airConTemp = parseInt($('#remote-temp-value').text());
	if (airConTemp > 16) {
		var newTemp = airConTemp - 1;
		$('#airConTempSliderVal').text('' + newTemp);
		$("#remote-temp-value").text('' + newTemp);
		$('#airConTempSlider').slider('setValue', newTemp);
	} else {

	}
}