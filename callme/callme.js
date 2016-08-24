jQuery(function(){
jQuery("#viewform").click(function(){
	jQuery("#callmeform").fadeToggle("fast");
});

jQuery("#cme_cls").click(function(){
	jQuery("#viewform").click();
});

jQuery("#viewform").hover(
	function () { 
		jQuery(this).addClass("callmeform_hover");
	},
	function () {
		jQuery(this).removeClass("callmeform_hover");
	}
);
});

function sendMail() {
	var cnt = jQuery.Storage.get('callme-sent'); // getting last sent time from storage
	if (!cnt) { cnt = 0; }
	
	jQuery.getJSON("callme/index.html", {
		cname: jQuery("#cname").val(), cphone: jQuery("#cphone").val(), ccmnt: jQuery("#ccmnt").val(), ctime: cnt, url: location.href }, function(data) {	
		message = "<div class='" + data.cls + "'>" + data.message +"</div>";
		jQuery("#callme_result").html(message);
		
		if (data.result == "success") {
			jQuery.Storage.set("callme-sent", data.time);
			jQuery("#callmeform .btn").attr("disabled", "disabled");
			//setTimeout( function(){ jQuery("#viewform").click(); }, 10000);
			//setTimeout( function(){ jQuery("#callmeform .txt").val(""); }, 10000);
		}
	});
//	}
}

jQuery(document).ready(function(){

jQuery("#callmeform .txt").focus(function(){
	//jQuery(this).val("");
});

jQuery("#callmeform .btn").click(function(){
	jQuery("#callme_result").html("<div class='sending'>Отправка...</div>");
	setTimeout( function(){ sendMail(); }, 2000);
	//setTimeout( function(){ jQuery(this).attr('disabled', ''); }, 5000);
	return false;
});	
});