var _number_of_validators_ = 0;
var FormValidator = function(form){
	var fv = this,
		elements_data = {},
		failed_elements = [];
	this.form = form;
	this.elements = null;
	this.validate_functions = {
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
		nospace : function(value){
			return (/\s/.test(value) ? false : true);
		},
		lowercase : function(value){
			return (value == value.toLowerCase() ? true : false);
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
		}
	}

	this.initialize = function(){
		fv.elements = fv.form.find("*[data-fv-validation]");
		_number_of_validators_++;
		_putFieldsValidatorAndMessage();
		_attachSubmitHandler();
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
			for(i = 0; i < validators.length; i++){
				var error_span = (fv.form.find("div[for=" + key + "]").length ? $("div[for=" + key + "]") : $("<div class='validator_error_class text-error' for='" + key + "'></div>"));
				if(typeof fv.validate_functions[validators[i]] == "function"){
					if(!fv.validate_functions[validators[i]](el.val(),el)){
						error_span.text(messages[i]);
						el.after(error_span);
						failed_elements.push(el);
						break;
					}else{
						error_span.remove();
					}
				}else{
					console.info("Not validating for " + validators[i] + ". Skipping.");
				}
			}
		})
		if(failed_elements.length){
			var offset = failed_elements[0].offset().top - fv.form.offset().top + fv.form.scrollTop();
			fv.form.parent().animate({scrollTop:offset-50}, '300', 'swing');
			return false;
		}else{
			return true;
		}
	}

	var _putFieldsValidatorAndMessage = function(){
		$.each(fv.elements,function(i,element){
			var element = $(element),
				validators = element.data("fv-validation").split(";").slice(0,-1),
				messages = element.data("fv-messages").split(";").slice(0,-1),
				id = (typeof element.attr("id") == "undefined" ? _generateElementId(element) : element.attr("id"));
			elements_data[id] = {};
			elements_data[id].validators = validators;
			elements_data[id].messages = messages;
		})
	}

	var _generateElementId = function(element){
		var name = element.attr("name").replace(/\[+(.*?)\]+/g,"$1") + "_" + _number_of_validators_;
		element.attr("id",name);
		return name;
	}

	this.initialize();
}
