//이메일 형식 체크
function isValidMail(v) {
	var reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
	return (reg.test(v));
}

//비밀번호 유효성 체크, 6자 이상의 영문+숫자
function isValidPwd1(v) {
	var reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{6,}$/;
	return (reg.test(v));
}

//비밀번호 유효성 체크, 6자 이상의 영소+영대+숫자
function isValidPwd2(v) {
	var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;
	return (reg.test(v));
}

//비밀번호 유효성 체크, 6자 이상의 영문+숫자+특수
function isValidPwd3(v) {
	var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
	return (reg.test(v));
}

//연속되거나 동일한 4자리 이상 문자, 숫자
function isValidPwd4(v) {
	var cntEQ = 1;
	var cntCON = 1;
	for (var i=0; i<v.length-1; i++) {
		cc = v.charCodeAt(i);
		nc = v.charCodeAt(i+1);
		if (cc == nc) cntEQ++;
		else if (cc != nc && cntEQ < 4) cntEQ=1;
		if ((cc+1) == nc || (cc-1 )== nc) cntCON++;
		else if (((cc+1) != nc && cntCON < 4) || ((cc-1) != nc && cntCON < 4)) cntCON=1;
		
		if (cntCON>=4 || cntEQ>=4) return false;
	}
	return true;
}

//키보드의 연속된 4자리 이상 문자
function isValidPwd5(v) {
	var bList = "qwertyuiop,asdfghjkl,zxcvbnm";
	for (var i=0; i<v.length-4; i++) {
		if (bList.indexOf(v.substring(i, i+3)) > -1) return false;
	}
	return true;
}

function setComma(num) {
	return num.toString().replace(/[^-0-9.]/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
/*function setComma(obj) {
	$(obj).val($(obj).val().replace(/[^-0-9.]/g, '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
}*/

function foldDaumPostcode(v) {
	$('#' + v + '_wrap').hide();
}

var clareCalendar = {
	monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
	monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
	dayNames: ['일','월','화','수','목','금','토'],
	dayNamesShort: ['일','월','화','수','목','금','토'],
	dayNamesMin: ['일','월','화','수','목','금','토'],
	weekHeader: 'Wk',
	dateFormat: 'mm월dd일',
	autoSize: true,
	changeMoth: true,
	changeYear: true,
	showMonthAfterYear: true,
	buttonImageOnly: true,
	buttonText: '▼',
	showOn: 'both'
}

function execDaumPostcode(v) {
	var element_wrap = document.getElementById(v + '_wrap');
	var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
	new daum.Postcode({
		oncomplete: function(data) {
			var addr = '';
			var extraAddr = '';
			
			if (data.userSelectedType === 'R') addr = data.roadAddress;
			else addr = data.jibunAddress;
			
			//if (data.userSelectedType === 'R'){
				if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) extraAddr += data.bname;
				if (data.buildingName !== '' && data.apartment === 'Y') extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
				if (extraAddr !== '') extraAddr = ' (' + extraAddr + ')';
			//}
			
			$('input[name=' + v + '_postcode]').val(data.zonecode);
			$('input[name=' + v + '_addr]').val(data.address + extraAddr);
			$('input[name=' + v + '_addr_desc]').focus();
			element_wrap.style.display = 'none';
			document.body.scrollTop = currentScroll;
		},
		onresize : function(size) {
		element_wrap.style.height = size.height+'px';
		},
		width : '100%',
		height : '100%'
	}).embed(element_wrap);
	element_wrap.style.display = 'block';
}

function openDaumPostcode(v) {
	new daum.Postcode({
	oncomplete: function(data) {
		$('input[name=' + v + '_postcode]').val(data.zonecode);
		$('input[name=' + v + '_addr]').val(data.address);
		$('input[name=' + v + '_addrdesc]').focus();
	}
	}).open();
}