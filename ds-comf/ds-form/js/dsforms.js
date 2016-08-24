/*--------------------
* Universal Form Builder
* @version 2.4
* @author Sergey Aleksandrov <malegender@mail.ru>
* @author Egor Bulychev <egor@bulychev.info>
* Using Reveal: jQuery Modals Made Easy
-------------------------*/
if(!window.dsC) {
	if(window.jQuery && !compareVersionjQuery('1.7') || !window.jQuery) {
		console.error('Version jQuery < 1.7 or jQuery not found!');
	} else {
		dsC = window.jQuery;
		rundsForm();
	}
} else rundsForm();

function compareVersionjQuery(needjQuery) {
	needjQuery = needjQuery.split('.',2);
	nowjQuery = jQuery.fn.jquery.split('.',2);
	if((parseInt(needjQuery[0]) != parseInt(nowjQuery[0])) || (parseInt(needjQuery[1]) > parseInt(nowjQuery[1]))) {
		return false;
	}
	return true;
}
function dsversion() {
	return 'Version 2.4.5';
}
function rundsForm() {

	dsafterloadform = {};
	dsaftershowform = {};

	dsC(document).ready(function() {
		var styleforms = document.createElement('link');
		styleforms.rel = "stylesheet";
		styleforms.href = "ds-comf/ds-form/formscss.css";
		document.body.appendChild(styleforms);
		dsC('body').on('submit', '.ds-form form', function(){
		var formid =  dsC(this).parents('.ds-form').attr("id");
		dsC('#' + formid + ' input[type="submit"]').hide();
		dsC('#' + formid + ' img.loadbuttom').show();
		if (!window.FormData) {
		var dataform = dsC(this).serialize();
			dataform = dataform + '&formid=' + formid;
			dsC.ajax({
				type: "POST",
				url: "/ds-comf/ds-form/form.php",
				dataType:  "json",  
				cache: false,
				data: dataform,
				success: formpost
			});

		} else {
			var formData = new FormData(dsC(this).get(0));
			formData.append('formid', formid);
			dsC.ajax({
		        url: "/ds-comf/ds-form/form.php",
		        type: "POST",
		        contentType: false,
		        processData: false,
		        data: formData,
		        dataType: 'json', 
		     	success: formpost
			});
		}

			return false;
		});

		function formpost(data) {
					formid = data['formid'];
					dsC('#' + formid + ' img.loadbuttom').hide();
					dsC('#' + formid + ' input[type="submit"]').show();
					delete(data['formid']);
					if(data['error'] == 1) {
						 delete(data['error']);
						 dsC('#'+formid + ' .error_form').empty();
						 var error_array = [];
						 dsC.each(data, function(index, val) {
						 	if(dsC.inArray(val, error_array) == -1 && val!=1) error_array.push(val);
						 	dsC('#' + formid + ' *[name="'+ index +'"]').addClass('alert');
						 });
						 dsC('#' + formid + ' *[required]').each(function(){
						  	var field = dsC(this);
						  	if(field.hasClass('alert') && !data[field.attr('name')]) {
						  		field.removeClass('alert');
						  	}
						 });
						 var error_text = '<ul class="error-form">'+"\n";
						 dsC.each(error_array, function(index, val){
						 	error_text+='<li>'+val+'</li>'+"\n"; 
						 })
						 error_text+= '</ul>'+"\n";
						dsC('#'+formid + ' .error_form').append(error_text);
						if(dsC('#' + formid).hasClass('dspopup-modal')) {
							resizepopup(formid);
						} else {
							dsC('#'+formid).css('height','auto');
						}
					} else if(data['error'] == 0 || data['error'] == 2) {
						dsC('#' + formid + ' form').remove();
						dsC('#'+formid + ' .scrollform').css('height','auto');
						dsC('#'+formid).css('height','auto');
						dsC('#' + formid).append(data['error_text']);
						if(dsC('#' + formid).hasClass('dspopup-modal')) {
							resizepopup(formid);
						}
					}
				}


		dsC('body').on('keyup','form input,form textarea', function(){
			var field = dsC(this);
			if(field.attr('pattern') && !field.val().match(field.attr('pattern'))) {
				field.addClass('alert');
			} else if(field.attr('pattern') && field.hasClass('alert')) {
				field.removeClass('alert');
			}
			if(!field.attr('pattern') && field.hasClass('alert')) {
				field.removeClass('alert');
			}
		});
		dsC('body').on('focusin', 'form input, form textarea, form select', function(){
				var formid = '#' + dsC(this).parents('form').attr("id");
				dsC('form input[type="text"], form textarea, form select').each(function(){
					dsC(this).removeClass('focusout');
				});
		});
		dsC('body').on('focusout','form input[type="text"]:not(input[readonly]),form textarea:not(textarea[readonly]), form select', function(){
			dsC(this).addClass('focusout');
		});
		var countForm = 0;
		dsC('*[data-dspopup-id]').each(function () {
			if(dsC(this).attr('data-dsconfig')){
				dsC(this).attr('data-dscount-form',countForm);
				countForm++;
			}
			var formid = dsC(this).attr('data-dspopup-id');
			dsC('#' + formid).addClass('dspopup-modal');
			dsC('#' + formid).html('<img src="/ds-comf/ds-form/images/loading.gif" class="loadform">');
		});

		dsC('.ds-form').each(function () {
				if(!dsC(this).hasClass('dspopup-modal')) {
					var formid = dsC(this).attr("id");
					dsconfig = dsC('#' + formid).attr('data-dsconfig');
					addForm(formid,dsconfig);
				}
		});

		dsC('body').on('click', '.repeatform', function(e){
			e.preventDefault();
			var formid = dsC(this).parents('div.ds-form').attr('id');
			dsC('.error-report').remove();
			if(dsC('#' + formid).hasClass('dspopup-modal')) {
				if(dscount=dsC('#' + formid).attr('data-dscount-form')) {
					dsconfig = dsC('*[data-dspopup-id='+formid+'][data-dscount-form='+dscount+']').attr('data-dsconfig');
				} else {
					dsconfig = dsC('*[data-dspopup-id='+formid+']').attr('data-dsconfig');
				}
			}
			if(!dsconfig) {
				dsconfig = dsC('#' + formid).attr('data-dsconfig');
			}
			addForm(formid, dsconfig);
		});

		dsC(window).on('resize', function(){
			if(dsC('div').is('.active-dspopup')){
				resizepopup(dsC('.active-dspopup').attr('id'));
			}
		});

		dsC('.close-dspopup-modal').on('click',function(){
			dsC('.active-dspopup').trigger('dspopup:close');
		});

		function addForm(formid,dsconfig) {
				var datajax;
				datajax = "formid=" + formid;
				if(dsconfig) {
					dsconfig = dsconfig.replace(/'/g,'"');
					try{
						eval(JSON.parse(dsconfig));
						datajax += "&dsconfig=" + dsconfig;
					} catch(e) {
						console.error('JSON array not valid for #' + formid + '!');
					}
				}
				dsC.ajax({
				url: "/ds-comf/ds-form/formtpl.php",
			    type: "POST",
				dataType: "text",
				data:  datajax, 
				cache: false,
				success: function(data) {
					if(data!="error") {
						dsC('#' + formid + ' .error-report').remove();
						dsC('#' + formid + ' .loadform').remove();
						dsC('#form-'+formid).remove();
						dsC('#'+formid).append(data);
						if(buttonheight = dsC('#' + formid + ' input[type="submit"]').outerHeight()) {
							var buttonwidth = dsC('#' + formid + ' input[type="submit"]').outerWidth();
							dsC('#' + formid + ' input[type="submit"]').before('<img src="/ds-comf/ds-form/images/loading.gif" class="loadbuttom">');
							dsC('#' + formid + ' img.loadbuttom').height(buttonheight);
							dsC('#' + formid + ' img.loadbuttom').css('margin-left', (Number(buttonwidth)-Number(buttonheight))/2);
							dsC('#' + formid + ' img.loadbuttom').css('margin-right', (Number(buttonwidth)-Number(buttonheight))/2);
							dsC('#' + formid + ' img.loadbuttom, #' + formid + ' input[type="submit"]').css('vertical-align','top')
						}
						if (!window.FormData) {
						   dsC('#' + formid + ' *[type="file"]').css('display','none');
						}
						if(!dsC('#'+formid).hasClass('dspopup-modal')) {
							dsC('#' + formid + ' *[autofocus]').focus();
						} else {
							resizepopup(formid);
						}
						if(typeof(dsafterloadform[formid]) == "function") {
							dsafterloadform[formid].call();
						}
					}
				}
				});
		}

		/*---------------------------
		 Defaults for dsReveal
		----------------------------*/

		/*---------------------------
		 Listener for data-dspopup-id attributes
		----------------------------*/
		dsC('*[data-dspopup-id]').on('click', function(e) {
			e.preventDefault();
			var formid = dsC(this).attr('data-dspopup-id');
			dsC('#'+formid).css({'width':'auto','height':'auto'});
			resizepopup(formid);
			dsC('#'+formid+' .loadform').css('display','block');
			dsC('#'+formid).dspopup(dsC(this).data());
			dsconfig = dsC(this).attr('data-dsconfig');
			if(!dsC('#'+formid).find('form').is('#form-' + formid)) {
				addForm(formid,dsconfig);
				if(dsC(this).attr('data-dscount-form')) {
					dsC('#'+formid).attr('data-dscount-form',dsC(this).attr('data-dscount-form'));
				}
			} else if(dsC(this).attr('data-dscount-form') && dsC(this).attr('data-dscount-form')!=dsC('#'+formid).attr('data-dscount-form')) {
				addForm(formid,dsconfig);
				dsC('#'+formid).attr('data-dscount-form',dsC(this).attr('data-dscount-form'));
			}
		});

		function resizepopup(formid) {
			if(dsC('#'+formid).children().is('.scrollform')) {
				dsC('#'+formid+' .scrollform form').appendTo('#'+formid);
				dsC('#'+formid+' .scrollform').remove();
				dsC('#'+formid).css({'width':'auto','height':'auto'});
			}
			var widthForm = dsC('#'+formid).innerWidth();
			var heightForm = dsC('#'+formid).outerHeight(true);
			var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			var leftForm = Math.round((windowWidth-widthForm)/2);
			if ( windowHeight  <= (heightForm + 20) ) {
				var topForm=20,
					marginScroll = 15,
				 	paddingForm = heightForm - dsC('#'+formid).height();
				dsC('#'+formid).append('<div class="scrollform"></div>');
				dsC('#'+formid+' form').appendTo('#'+formid+' .scrollform');
				dsC('#'+formid).width(dsC('#'+formid).width()+25);
				heightForm = windowHeight - topForm*2;
				dsC('.scrollform').height(heightForm - paddingForm - marginScroll);
				dsC('.scrollform').css({'overflow-y' : 'scroll', 'margin': marginScroll+'px 0'});
			} else {
				var topForm = Math.round((windowHeight-heightForm)/2);
			}
			dsC('#'+formid).css({
				'top':topForm + 'px',
				'left': leftForm + 'px',
			});
		}

		/*---------------------------
		 Extend and Execute
		----------------------------*/

	    dsC.fn.dspopup = function(options) {
        
	        var defaults = {  
			    animationspeed: 300, //how fast animtions are
			    closeonbackgroundclick: true, //if you click background will modal close?
			    dismissmodalclass: 'close-dspopup-modal' //the class of a button or element that will close an open modal
	    	}; 
	    	
	        //Extend dem' options
	        var options = dsC.extend({}, defaults, options); 
		
	        return this.each(function() {
		        
		/*---------------------------
		 Global Variables
		----------------------------*/
	        	var modal = dsC(this),
	          		locked = false,
					modalBG = dsC('.dspopup-modal-bg');
		     	
		/*---------------------------
		 Create Modal BG
		----------------------------*/
				if(modalBG.length == 0) {
					modalBG = dsC('<div class="dspopup-modal-bg" />').insertAfter(modal);
				}		    
		/*---------------------------
		 Open & Close Animations
		----------------------------*/
				//Entrance Animations
				modal.bind('dspopup:open', function () {
				  modalBG.unbind('click.modalEvent');
					dsC('.' + options.dismissmodalclass).unbind('click.modalEvent');
					if(!locked) {
						lockModal();
						modal.append('<div class="'+options.dismissmodalclass+' dsclose-button"></div>');
						modal.css({'opacity' : 0, 'visibility' : 'visible','display':'block'});
						modal.addClass('active-dspopup');
						modalBG.fadeIn(options.animationspeed/2);
						modal.delay(options.animationspeed/2).animate({
							"opacity" : 1
						}, options.animationspeed,function() {
							dsC('#'+ options.dspopupId + ' *[autofocus]').focus();
							if(typeof(dsaftershowform[options.dspopupId]) == "function") {
								dsaftershowform[options.dspopupId].call();
							}
							unlockModal();
						});					
					}
					modal.unbind('dspopup:open');
				}); 	

				//Closing Animation
				modal.bind('dspopup:close', function () {
				  if(!locked) {
						lockModal();
						dsC('.' + options.dismissmodalclass).remove();
							modal.removeClass('active-dspopup');
							modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
							modal.animate({
								"opacity" : 0
							}, options.animationspeed, function() {
								modal.css({'opacity' : 1, 'visibility' : 'hidden', 'display':'none'});
								unlockModal();
							});			
					}
					modal.unbind('dspopup:close');
				});     
		   	
		/*---------------------------
		 Open and add Closing Listeners
		----------------------------*/
		        	//Open Modal Immediately
		    	modal.trigger('dspopup:open')
					
				//Close Modal Listeners
				var closeButton = dsC('.' + options.dismissmodalclass).bind('click.modalEvent', function () {
				  modal.trigger('dspopup:close')
				});
				
				if(options.closeonbackgroundclick) {
					modalBG.css({"cursor":"pointer"})
					modalBG.bind('click.modalEvent', function () {
					  modal.trigger('dspopup:close')
					});
				}
				dsC('body').keyup(function(e) {
	        		if(e.which===27){ modal.trigger('dspopup:close'); } // 27 is the keycode for the Escape key
				});
				
					
		/*---------------------------
		 Animations Locks
		----------------------------*/
				function unlockModal() { 
					locked = false;
				}
				function lockModal() {
					locked = true;
				}	
					
	        });//each call
	    }//orbit plugin call
	});
}