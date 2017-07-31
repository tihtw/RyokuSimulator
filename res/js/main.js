//var device_session = $('input[id="device-session"]').value;
var temperature = 28;
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

function renewId() {
	var id = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for (var i = 0; i < 12; i++) {
		id += characters.charAt(Math.random() * characters.length);
	}
	$('input[id="device-id"]').val(id);
}

function renewSession() {
	var session = "";
	var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 64; i++) {
		session += characters.charAt(Math.random() * characters.length);
	}
	$('input[id="device-session').val(session);
}

function toogleNetwork() {
	if ($('#online-text').text() == "ONLINE") {
		$('#online-text').text('OFFLINE');
		$('.power-light').attr('src', '../res/images/offline.png');
		$('#network-button').text("連接網路");
	} else {
		// OFFLINE
		$('#online-text').text('ONLINE');
		$('.power-light').attr('src', '../res/images/online.png');
		$('#network-button').text("中斷網路");
	}
}

function toogleElectricity() {
	if ($('.cut-electricity').text() == "中斷電力") {
		$('.cut-electricity').text("恢復電力");
	} else {
		$('.cut-electricity').text("中斷電力");
	}
}

function tooglePower() {
	setTimeout(function () {
		var isOpen = $('input[id="power-radio-0"]:checked').val();
		if (isOpen == "on") {
			// close
			$('input[id="power-radio-1"]').prop("checked", true);
			$("#power-state-val").text('關機');
			closeRemoteScreen();
		} else {
			// open
			$('input[id="power-radio-0"]').prop("checked", true);
			$("#power-state-val").text('開機');
			openRemoteScreen();
		}
	}, 800);
}

function openRemoteScreen() {
	$('#remote-temp-value').css('display', 'block');
	$('.remote-divider').css('display', 'block');
	$('.remote-fan').css('display', 'block');
	$('#remote-fan-0').css('display', 'inline');
	$('#remote-fan-1').css('display', 'inline');
	$('#remote-fan-2').css('display', 'inline');
	$('#remote-fan-3').css('display', 'inline');
}

function closeRemoteScreen() {
	$('#remote-temp-value').css('display', 'none');
	$('.remote-divider').css('display', 'none');
	$('.remote-fan').css('display', 'none');
	$('#remote-fan-0').css('display', 'none');
	$('#remote-fan-1').css('display', 'none');
	$('#remote-fan-2').css('display', 'none');
	$('#remote-fan-3').css('display', 'none');

}

function toogleFan() {
	//console.log($('#remote-fan-0').value);
	var isOpen = $('input[id="power-radio-0"]:checked').val();
	if (isOpen != "on") return ;
	setTimeout(function () {
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
	}, 800);
}

function warnUp() {
	var isOpen = $('input[id="power-radio-0"]:checked').val();
	if (isOpen != "on") return ;
	
	if (temperature < 32) {
		temperature = temperature + 1;
		changeTemperature(temperature);
	}
}

function coolDown() {
	var isOpen = $('input[id="power-radio-0"]:checked').val();
	if (isOpen != "on") return ;
	
	if (temperature > 16) {
		temperature = temperature - 1;
		changeTemperature(temperature);
	}
}

function changeTemperature(temp) {
	window.clearTimeout(setup);
	var setup = window.setTimeout(function () {
		$('#airConTempSliderVal').text('' + temp);
		$("#remote-temp-value").text('' + temp);
		$('#airConTempSlider').slider('setValue', temp);
	}, 800);
}