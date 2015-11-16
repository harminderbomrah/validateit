'use strict';
(function($){
	var _number_of_validators_ = 0;
	var FormValidator = function(form){
		var fv = this,
			elements_data = {},
			failed_elements = [];
		this.form = form;
		this.elements = null;
		this.rules = {
			required : function(value,element){
				switch($(element).prop("tagName")){
					case "INPUT":
						switch(element.attr("type")){
							case "text":
								return (value == "" ? false : true);
							break;
							case "checkbox":
								return element.is(":checked");
							break;
						}
					case "SELECT":
						return (value == "" ? false : true);
					break;
				}
			},
			no_space : function(value){
				return (/\s/.test(value) ? false : true);
			},
			email : function(value){
				var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    		return re.test(value);
			},
			url : function(value){
				if(value == "#"){
					return true;
				}
				var reg = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
				return reg.test(value);
			},
			numeric : function(value){
				return !isNaN(parseFloat(value)) && isFinite(value);
			},
			alphabets : function(value){
				return /^[a-zA-Z]+$/.test(value);
			},
			lowercase : function(value){
				return /^[a-z]+$/.test(value);
			},
			uppercase : function(value){
				return /^[A-Z]+$/.test(value);
			}
		}

		var initialize = function(){
			fv.elements = fv.form.find("*[data-fv-validations]");
			if(typeof fv.form.attr("id") == "undefined"){
				fv.form.attr("id","formvalidate_form_" + _number_of_validators_);
			}
			_number_of_validators_++;
			_putFieldsValidatorAndMessage();
			_attachSubmitHandler();
		}

		this.reset = function(){
			document.getElementById(fv.form.attr("id")).reset();
			fv.form.find(".validator_error_class").remove();
			fv.form.find(".validation-error").removeClass("validation-error");
		}

		var _attachSubmitHandler = function(){
			fv.form.on("submit",function(){
				return fv.isFormValidated();
			})
		}

		this.isFormValidated = function(){
			failed_elements = [];
			$.each(elements_data,function(key,element){
				var validators = element.validators,
					messages = element.messages,
					el = fv.form.find("#" + key);
				for(var i = 0; i < validators.length; i++){
					var error_span = (fv.form.find("div[for=" + key + "]").length ? $("div[for=" + key + "]") : $("<div class='validator_error_class text-error' for='" + key + "'></div>"));
					if(typeof fv.rules[validators[i]] == "function"){
						if(!fv.rules[validators[i]](el.val(),el)){
							error_span.text(messages[i]);
							el.after(error_span);
							el.addClass("validation-error");
							failed_elements.push(el);
							break;
						}else{
							error_span.remove();
							el.removeClass("validation-error");
						}
					}else{
						console.info("Not validating for " + validators[i] + ". Skipping.");
					}
				}
			})
			if(failed_elements.length){
				var offset = failed_elements[0].offset().top - 100;
				$("*").animate({scrollTop:offset}, '300');
				return false;
			}else{
				return true;
			}
		}

		var _putFieldsValidatorAndMessage = function(){
			$.each(fv.elements,function(i,element){
				var element = $(element),
					validators = element.data("fv-validations").split(";").slice(0,-1),
					messages = element.data("fv-messages").split(";").slice(0,-1),
					id = (typeof element.attr("id") == "undefined" ? _generateElementId(element) : element.attr("id"));
				elements_data[id] = {};
				elements_data[id].validators = validators;
				elements_data[id].messages = messages;
			})
		}

		var _generateElementId = function(element){
			if(element.attr("name") == undefined){
				throw new FormValidator.Exceptions.nameAttrNotFound;
			}
			var name = element.attr("name").replace(/\[+(.*?)\]+/g,"$1") + "_" + _number_of_validators_;
			element.attr("id",name);
			return name;
		}

		initialize();
	}

	FormValidator.Exceptions = {};

	FormValidator.Exceptions.nameAttrNotFound = function(){
		this.message = "Field should have name attr defined for validation."
		this.toString = function(){
			return this.message;
		}
	}

	FormValidator.Exceptions.nameAttrNotFound.prototype = new Error();

	$.fn.validateIt = function(){
		return new FormValidator(this);
	}

})(jQuery);



