![validate icon](assets/images/validateIt.png)
# ValidateIt
A powerful and easy to use jQuery validator. With ValidateIt, you can create your own rules with a lot of ease and flexibility.

> Requires jQuery  
> License MIT

1. [How to install](#how-to-insall)
2. [How to use](#how-to-use)
3. [Rules](#rules)
4. [Methods](#methods)
5. [Creating your own rules](#creating-your-own-rules)
6. [Overriding in-built rules](#overriding-in-built-rules)
7. [Customizing error messages](#customizing-error-messages)

##How to install

1. Download the [Zip](https://github.com/harminderbomrah/validateit/archive/master.zip).
2. Load the jQuery file.
3. Load validateit.js or validateit.min.js in the header.

##How to use

**HTML**

	<form id="new_form" action="/" method="post">
		<input type="text" data-fv-validations="required;" data-fv-messages="Cannot be empty;" />
	</form>

Put all your validations for a field in `data-fv-validations` and their respective messages in `data-fv-messages`.

Example

	<input type="text" data-fv-validations="required;numeric;no_space;" data-fv-messages="Cannot be empty.;Must be a number.; Cannot have an empty space.;" />
	
Please remember to put a **semi-colon** `;` after every validation and message. If your validation or message doesn't end with a `;` ValidateIt will ignore that validation.

ValidateIt will always start checking from the first validation you write. In the above example, ValidateIt will first check `required`, then `numeric`, and then `no_space`. If the first validation passes then only will it move to the second one. If any validation fails, ValidateIt will put the validation's error message next to the field.

**Javascript**

	$("form#new_form").validateIt();

The form will be validated on form submit event. If validation fails, ValidateIt will stop the form from submitting and put an appropriate message next to the field. 



##Rules

<table>
	<thead>
	<tr>
		<th>Rule</th>
		<th>Description</th>
	</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>required</b></td>
			<td><i>Makes a field mandatory</i></td>
		</tr>
		<tr>
			<td><b>no_space</b></td>
			<td><i>Fails the validation if a white space is found</i></td>
		</tr>
		<tr>
			<td><b>lowercase</b></td>
			<td><i>All letters must be lowercase</i></td>
		</tr>
		<tr>
			<td><b>uppercase</b></td>
			<td><i>All letters must be uppercase</i></td>
		</tr>
		<tr>
			<td><b>email</b></td>
			<td><i>Checks for a valid email address</i></td>
		</tr>
		<tr>
			<td><b>url</b></td>
			<td><i>Checks for a valid URL</i></td>
		</tr>
		<tr>
			<td><b>numeric</b></td>
			<td><i>All characters must be numbers</i></td>
		</tr>
		 <tr>
            <td><b>alphabets</b></td>
            <td><i>All characters must be alphabets</i></td>
          </tr>
	</tbody>
</table>


##Methods

**`.form`**

This is the jQuery object of the form. You can use this like any other jQuery object.

Example

	var myForm = $("form#new_form").validateIt();
	myForm.form;

**`.reset()`**

This will reset the form.

Example

	var form = $("form#new_form").validateIt();
	form.reset();

**`.isFormValidated()`**

This is useful for validating your form using your javascript; especially when you want to trigger submit outside the form. It can also be used when you want to submit the form using AJAX or want to manipulate data before submitting the form. It will return `true` or `false` value for success and failure respectively. In case the form fails to validate, calling this method will automatically put the error messages next to their respective fields and it will scroll the page up to the first error message.

Example

	var form = $("form#new_form").validateIt();
	$("#some-button").on("click",function(){
		if(form.isFormValidated()){
			// do something or submit the form
		}	
	})



##Creating your own rules

With ValidateIt you can create your own rules and assign error messages to them very easily. You can create as many rules as you want for a particular instance. This gives you the power to have a same rule name but it can work differently for different instances - just like polymorphism. For creating new rules, just add them to your instance's `rules`.

Example

Let's create a rule which checks the age. The validation should fail if the age is `=<` 17.

_Javascript_

	var form = $("form#new_form").validateIt();
	form.rules.check_age = function(value, element){
		return (value > 17);
	}

Two parameters are passed to all custom made functions.

<table>
	<thead>
		<th>Name</th>
		<th>Description</th>
	</thead>
	<tbody>
		<tr>
			<td><i>value</i></td>
			<td>The value entered in the field. You can directly use this value to check if it is acceptable or not.</td>
		</tr>
		<tr>
			<td><i>element</i></td>
			<td>The element being checked. You can perform DOM manipulations or get the type or do quite a few other things based on your requirement.</td>
		</tr>
	</tbody>
</table>

_HTML_

	<input type="text" data-fv-validations="numeric;check_age;" data-fv-messages="Must be a number.;Must be greater than 17;" />

In this example, `check_age` function returns true or false depending on the input value. In HTML, we just need to specify validation name in `data-fv-validations` and a message in `data-fv-messages`. The above example will first check for numeric input and then the custom-created validation `check_age`.

> Please note that your custom created rule should always return **`true`** or **`false`**.
 

##Overriding in-built rules

Overriding in-built rules is quite easy. Just add your rule function to the instance's `rules` with same name and it will be overriden.

Example

If you want to override _required_ rule then simply do the following.

	var form = $("form#new_form").validateIt();
	form.rules.required = function(value, element){
		// test the value with your modified rule and return true or false
	}


##Customizing error messages

	.text-error //applied to error message block
	.validation-error //applied to field 

You can customize error messages by creating CSS rules for the classes mentioned above. The `text-error` is applied to the error message block and the `validation-error` is applied to the field.


##Author

**Harry Bomrah**

##License

MIT License







