$(document).ready(function(){
	$('.main-slider #my-slider').anythingSlider({
		expand         : true,
		buildArrows    : false,
		buildStartStop : false,
		hashTags       : false,
		pauseOnHover   : true,
		autoPlay       : true,
		delay          : 7000,
		animationTime  : 2000,
		changeBy       : 1
	});
	$('input[value=\'Отправить\']').click(function(){
		ga('send', 'pageview','/zayavka');
	});

	$('#zakazat_zapchasti_form_send').click(function(){
		ga('send', 'pageview','/zakazzapch');
		yaCounter21108055.reachGoal('zakazzapch');
	});

});