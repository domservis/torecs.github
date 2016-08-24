jQuery(function(){
jQuery("#aviewform").click(function(){
	jQuery("#answermeform").fadeToggle("fast");
});

jQuery("#ame_cls").click(function(){
	jQuery("#aviewform").click();
});

jQuery("#aviewform").hover(
	function () { 
		jQuery(this).addClass("answermeform_hover");
	},
	function () {
		jQuery(this).removeClass("answermeform_hover");
	}
);
});

function asendMail() {
	var acnt = jQuery.Storage.get('answerme-sent'); // getting last sent time from storage
	if (!acnt) { acnt = 0; }
	
	jQuery.getJSON("answerme/index.html", {
		aname: jQuery("#aname").val(), aphone: jQuery("#aphone").val(), acmnt: jQuery("#acmnt").val(), atime: acnt, url: location.href }, function(data) {	
		amessage = "<div class='" + adata.acls + "'>" + adata.amessage +"</div>";
		jQuery("#answerme_result").html(amessage);
		
		if (adata.aresult == "asuccess") {
			jQuery.Storage.set("answerme-sent", adata.atime);
			jQuery("#answermeform .abtn").attr("disabled", "disabled");
			//setTimeout( function(){ jQuery("#aviewform").click(); }, 10000);
			//setTimeout( function(){ jQuery("#answermeform .txt").val(""); }, 10000);
		}
	});
//	}
}

jQuery(document).ready(function(){

jQuery("#answermeform .atxt").focus(function(){
	//jQuery(this).val("");
});

jQuery("#answermeform .abtn").click(function(){
	jQuery("#answerme_result").html("<div class='a_sending'>Отправка...</div>");
	setTimeout( function(){ asendMail(); }, 100);
	//setTimeout( function(){ jQuery(this).attr('disabled', ''); }, 5000);
	return false;
});	
});