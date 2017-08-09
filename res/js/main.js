var remote_temperature = 28;
var remote_power = true;
var remote_fan_level = 0;

var server_ip = "ws://sampo.tih.tw:8080/json";
var device_id = "01EA33ED1122";
var key = "";
var sampoSocket = new WebSocket(server_ip);

var is_server_ip_correct = false

sampoSocket.onmessage = function (e) {
	console.log(e.data);
	var json = JSON.parse(e.data);
	var data = json["data"];
	if (data["power_status"] != undefined) {
		var status = (data["power_status"] == "true") ? true : false;
		if (status) {
			$("#power-state-val").text('開機');
			$('input[id="power-radio-0"]').prop("checked", true);
		} else {
			$("#power-state-val").text('關機');
			$('input[id="power-radio-1"]').prop("checked", true);
		}
		log("set device " + device_id + " power to " + status);
	}
	if (data["online"] != undefined) {
		var online = (data["online"] == "true") ? true : false;
		if (online) {
			$('#online-text').text('ONLINE');
			$('.power-light').attr('src', 'res/images/online.png');
			$('#network-button').text("中斷網路");
			$('.cut-electricity').text("中斷電力");
		} else {
			$('#online-text').text('OFFLINE');
			$('.power-light').attr('src', 'res/images/offline.png');
			$('#network-button').text("連接網路");
			$('.cut-electricity').text("恢復電力");
		}
		log("set device " + device_id + " online to " + online);
	}
	if (data["fan_level"] != undefined) {
		var level = Number(data["fan_level"]);
		switch (level) {
			case -1:
				$("#fan-state-val").text('自動');
				$('input[id="fan-radio-0"]').prop("checked", true);
				break;
			case 0.1:
				$("#fan-state-val").text('強');
				$('input[id="fan-radio-1"]').prop("checked", true);
				break;
			case 0.5:
				$("#fan-state-val").text('中');
				$('input[id="fan-radio-2"]').prop("checked", true);
				break;
			case 1:
				$("#fan-state-val").text('弱');
				$('input[id="fan-radio-3"]').prop("checked", true);
				break;
			default:
				break;
		}
		log("set device " + device_id + " fan level to " + level);
	}
	if (data["target_temperature_range"] != undefined) {
		var array = data["target_temperature_range"].replace('[','').replace(']','').split(',').map(Number);
		var temperature = array[0];
			$("#airConTempSliderVal").text(temperature);
			$('#airConTempSlider').slider('setValue', temperature);
			log("set device " + device_id + " temperature to " + temperature);
	}
};
sampoSocket.onopen = function (e) {
	renewId();
	renewKey();
	init();
};



$(document).ready(function () {
	$('input:radio[id^="power-radio-"]').on("change", function (event) {
		var id = $(this).attr('id');

		switch (id) {
			case 'power-radio-0':
				$("#power-state-val").text('開機');
				setPower(true);
				break;
			case 'power-radio-1':
				$("#power-state-val").text('關機');
				setPower(false);
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
				setFanLevel(-1);
				break;
			case 'fan-radio-1':
				$("#fan-state-val").text('強');
				setFanLevel(0.1);
				break;
			case 'fan-radio-2':
				$("#fan-state-val").text('中');
				setFanLevel(0.5);
				break;
			case 'fan-radio-3':
				$("#fan-state-val").text('弱');
				setFanLevel(1.0);
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
	$('#airConTempSlider').on("slideStop", function (slideEvt) {
		setTemperature(slideEvt.value);
	});
})

function init() {
	remote_temperature = 28;
	remote_power = true;
	remote_fan_level = 0;
	$('input[id="power-radio-0"]').prop("checked", true);
	$('input[id="fan-radio-0"]').prop("checked", true);
	$('#inTempSliderVal').text(36);
	$('#airConTempSliderVal').text('' + remote_temperature);
	$("#remote-temp-value").text('' + remote_temperature);
	$('#airConTempSlider').slider('setValue', remote_temperature);
	$("#fan-state-val").text('自動');
	$('#log-frame').val('');

	if(!server_ip.startsWith("ws:")){
		is_server_ip_correct = true;
	}
	
	connect(device_id, key);
	log("Connection established!");
	
}


function renewId() {
	var id = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for (var i = 0; i < 12; i++) {
		id += characters.charAt(Math.random() * characters.length);
	}
	$('input[id="device-id"]').val(id);
	device_id = id;
}

function renewKey() {
	var newKey = "";
	var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 64; i++) {
		newKey += characters.charAt(Math.random() * characters.length);
	}
	$('input[id="device-key"]').val(newKey);
	key = newKey;
}

function toogleNetwork() {
	if ($('#online-text').text() == "ONLINE") {
		// ONLINE -> OFFLINE
		$('.cut-electricity').text("恢復電力");
		$('#online-text').text('OFFLINE');
		$('.power-light').attr('src', 'res/images/offline.png');
		$('#network-button').text("連接網路");
		setOnline(false);
	} else {
		// OFFLINE -> ONLINE
		$('.cut-electricity').text("中斷電力");
		$('#online-text').text('ONLINE');
		$('.power-light').attr('src', 'res/images/online.png');
		$('#network-button').text("中斷網路");
		setOnline(true);
	}
}

function toogleElectricity() {
	if ($('.cut-electricity').text() == "中斷電力") {
		$('.cut-electricity').text("恢復電力");
		$('#online-text').text('OFFLINE');
		$('.power-light').attr('src', 'res/images/offline.png');
		$('#network-button').text("連接網路");
		setOnline(false);
	} else {
		$('.cut-electricity').text("中斷電力");
		$('#online-text').text('ONLINE');
		$('.power-light').attr('src', 'res/images/online.png');
		$('#network-button').text("中斷網路");
		setOnline(true);
	}
}

// remote
function tooglePower() {
	setTimeout(function () {
		if (remote_power) {
			// close
			$('input[id="power-radio-1"]').prop("checked", true);
			$("#power-state-val").text('關機');
			closeRemoteScreen();
			setPower(false);
			remote_power = false;
		} else {
			// open
			$('input[id="power-radio-0"]').prop("checked", true);
			$("#power-state-val").text('開機');
			openRemoteScreen();
			setPower(true);
			remote_power = true;
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
	if (!remote_power) return;
	setTimeout(function () {
		$('#remote-fan-0').css('opacity', 0.1);
		$('#remote-fan-1').css('opacity', 0.1);
		$('#remote-fan-2').css('opacity', 0.1);
		$('#remote-fan-3').css('opacity', 0.1);

		if (remote_fan_level == 0) {
			//console.log("自動");
			$('input[id="fan-radio-1"]').prop("checked", true);
			$('#remote-fan-1').css('opacity', 1);
			$("#fan-state-val").text('強');
			remote_fan_level = 1;
			setFanLevel(0.1);
		} else if (remote_fan_level == 1) {
			//console.log("強");
			$('input[id="fan-radio-2"]').prop("checked", true);
			$('#remote-fan-2').css('opacity', 1);
			$("#fan-state-val").text('中');
			remote_fan_level = 2;
			setFanLevel(0.5);
		} else if (remote_fan_level == 2) {
			//console.log("中");
			$('input[id="fan-radio-3"]').prop("checked", true);
			$('#remote-fan-3').css('opacity', 1);
			$("#fan-state-val").text('弱');
			remote_fan_level = 3;
			setFanLevel(1.0);
		} else if (remote_fan_level == 3) {
			//console.log("弱");
			$('input[id="fan-radio-0"]').prop("checked", true);
			$('#remote-fan-0').css('opacity', 1);
			$("#fan-state-val").text('自動');
			remote_fan_level = 0;
			setFanLevel(-1);
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
	if (isOpen != "on") return;

	if (remote_temperature < 32) {
		remote_temperature = remote_temperature + 1;
		changeTemperature(remote_temperature);
	}
}

function coolDown() {
	var isOpen = $('input[id="power-radio-0"]:checked').val();
	if (isOpen != "on") return;

	if (remote_temperature > 16) {
		remote_temperature = remote_temperature - 1;
		changeTemperature(remote_temperature);
	}
}

function changeTemperature(temp) {
	window.clearTimeout(setup);
	var setup = window.setTimeout(function () {
		$('#airConTempSliderVal').text('' + temp);
		$("#remote-temp-value").text('' + temp);
		$('#airConTempSlider').slider('setValue', temp);
		setTemperature(temp);
	}, 800);
}

function getTimeStamp() {
	var date = new Date();
	var year = date.getFullYear();
	var monthIndex = date.getMonth();
	var day = date.getDate();

	var timestamp = new Date().toLocaleTimeString();
	return "[" + year + "-" + monthIndex + "-" + day + " " + timestamp + "]";
}
function connect(device_id, token) {
	var msg = {
		method: "connect",
		path: "/2/device" + device_id,
		authorization: token
	}
	if(is_server_ip_correct){
		sampoSocket.send(JSON.stringify(msg));
	}
}

function setPower(on) {
	var msg = {
		method: "post",
		path: "/2/device/" + device_id + "/perpheral/_",
		data: {
			"power_status": on
		}
	}
	if(is_server_ip_correct){
		sampoSocket.send(JSON.stringify(msg));
	}
	log("set device " + device_id + " power to " + on);
}

function setOnline(on) {
	var msg = {
		method: "post",
		path: "/2/device/" + device_id + "/perpheral/_",
		data: {
			"online": on
		}
	}
	if(is_server_ip_correct){
		sampoSocket.send(JSON.stringify(msg));
	}
	log("set device " + device_id + " online to " + on);
}

function setFanLevel(value) {
	var msg = {
		method: "post",
		path: "/2/device/" + device_id + "/perpheral/_",
		data: {
			"fan_level": value
		}
	}
	if(is_server_ip_correct){
		sampoSocket.send(JSON.stringify(msg));
	}
	log("set device " + device_id + " fan level to " + value);
}

function setTemperature(value) {
	var msg = {
		method: "post",
		path: "/2/device/" + device_id + "/perpheral/_",
		data: {
			"target_temperature_range": [value, value]
		}
	}
	if(is_server_ip_correct){
		sampoSocket.send(JSON.stringify(msg));
	}
	log("set device " + device_id + " temperature to " + value);
}

function log(str) {
	var timestamp = getTimeStamp();
	var errmsg = ""
	if(!is_server_ip_correct){
		errmsg += "[fake mode], please set the correct server_ip]";
	}
	$('#log-frame').val($('#log-frame').val() + timestamp + errmsg + " " + str + "\n");
	$('#log-frame').scrollTop($('#log-frame')[0].scrollHeight);
	}
}