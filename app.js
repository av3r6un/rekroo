
var basic = new Vue({
	el: '#mainContent',
	data() {
		return {
			rendering: true,
			render_filters: true,
			base_filters: true,
			loading: true,
			info: null,
			errored: false,
			base_search_link: 'https://api.rekroo.org/pa/vacancy/search',
			systemParams: null,
			currencies: {
				'rub': '₽',
				'₽': '₽',
				'$': '$'
			},
			icon_class: {
			without_icon: false,
			},
			remote_work_options: {
				0: false,
				1: 'Удаленно'
			},
			remote_work: {
				checked: false,
			},
			selections: [
				{ name: 'location',
				options: [],
				default: 'Город'
				},
				{ name: 'area',
				options: [],
				default: 'Сфера'
				},
				{name: 'employment_type',
				options: [],
				default: 'Формат работы',
				},
				{ name: 'salary_from',
				options: [],
				default: 'Зарплата от, ₽'
				},
			],
		}
	},
	mounted (){
		if (this.rendering){
			axios
				.get(this.base_search_link)
				.then(response => {
					this.info = response
				})
				.catch(error => {
					console.log(error)
					this.errored = true
				})
				.finally(() => this.loading = false)
		}
		if (this.base_filters){
			axios
				.get('https://api.rekroo.org/pa/user/get/me')
				.then(response => {
					emp_types = this.selections[2].options
					this.systemParams = response.data.systemParams
					$.each(this.systemParams, function(param_name, param_values){
						if (param_name === 'employment_types'){
							$.each(param_values, function(key, value){
								emp_types.push(value)
							})
						}
					})
				})
				.catch(error => {
					console.log(error)
					this.errored = true
				})
		}
		if (this.render_filters){
			axios
				.get(this.base_search_link)
				.then(response => {
					resp = response.data.response
					cities_list = this.selections[0].options
					types = this.selections[1].options
					salaries = this.selections[3].options
					$.each(resp, function(){
						city = $(this)[0].location
						type_ = $(this)[0].company_info.type
						salary = $(this)[0].salary_from
						if (city){
							if (cities_list.indexOf(city) === -1){
							cities_list.push(city);
							}
						}
						if (type_){
							if (types.indexOf(type_) === -1){
								types.push(type_)
							}
						}
						if (salary){
							if (salaries.indexOf(salary) === -1){
								salaries.push(salary)
							}
						}
					})
				})
				.catch(error => console.log(error))
		}		
	},
	methods:{
		hideIcon: function(){
			if (event.target.value !== ''){
				return this.icon_class.without_icon = true;
			}
			if (event.target.value === ''){
				return this.icon_class.without_icon = false;
			}
		},
		onOff: function(){
			if (this.remote_work.checked){
				this.remote_work.checked = false;
			} else {
				this.remote_work.checked = true;
			}
		},
		changeState: function(){
			var item = event.target.className;
			if (item === 'checkbox_check'){
				var state = event.target.parentElement.parentElement.querySelector('input[type=checkbox]').checked;
				if (this.remote_work.checked == false){
					state = true;
					this.remote_work.checked = true;
				} else {
					state = false;
					this.remote_work.checked = false
				}
			} else if (item == 'checkbox'){
				var state = event.target.parentElement.querySelector('input[type=checkbox]').checked;
				if (this.remote_work.checked == false){
					state = true;
					this.remote_work.checked = true;
				} else {
					state = false;
					this.remote_work.checked = false;
				}
			}
		},
		clearFilters: function(){
			if (event.target.className == 'clear_filters'){
				var form = event.target.parentElement;
				var selection = form.querySelectorAll('.selection');
				var inp = form.querySelector('input.filter_input');
				if (inp.value){
					inp.value = '';
				}
				var toggle = form.querySelector('.remote_option > .custom_check');
				if (toggle.classList.contains('checked')){
					toggle.checked = false;
					this.remote_work.checked = false;
				}
				selection.forEach(function(item){
					var obj = item.querySelector('.selected');
					if (obj.classList.contains('not_empty')){
						obj.innerHTML = obj.getAttribute('data-default');
						var input_name = obj.parentElement.querySelector('.selection_options').getAttribute('data-target');
						obj.parentElement.parentElement.querySelector('input[name='+ input_name + ']').value = '';
						obj.classList.remove('not_empty');
					}
				})
				document.querySelector('#tagsBody').innerHTML = '';
			} else {
				var toggle = event.target.parentElement.parentElement.querySelector('.filters_body > .filter_form > .remote_option > .custom_check');
				if (toggle.classList.contains('checked')){
					toggle.classList.remove('checked');
					toggle.checked = false;
					this.remote_work.checked = false;
				}

				var inp = event.target.parentElement.parentElement.querySelector('.filters_body > .filter_form > input.filter_input');
				if (inp.value){
					inp.value = '';
				}
				selections = event.target.parentElement.parentElement.querySelectorAll('.filters_body > .filter_form > .selection');
				selections.forEach(function(item){
					var obj = item.querySelector('.selected');
					if (obj.classList.contains('not_empty')){
						obj.innerHTML = obj.getAttribute('data-default');
						obj.classList.remove('not_empty');
					}
				})
			}
		},
		toggleOptions: function(){
			cur_target = event.target;
			if (((cur_target.classList.contains('selected')) && (cur_target.classList.contains('not_empty')))){
				var selection = cur_target.parentElement.querySelector('.selection_options');
				cur_target.innerHTML = cur_target.getAttribute('data-default');
				var target = cur_target.parentElement.querySelector('.selection_options').getAttribute('data-target');
				document.querySelector('input[name=' + target + ']').value = '';
				cur_target.classList.remove('not_empty');
			} else if (cur_target.className === 'selected'){
				this.closeOthers();
				var selection = cur_target.parentElement.querySelector('.selection_options');
				if (selection.classList.contains('opened')){
					selection.classList.remove('opened');
				} else {
					selection.classList.add('opened');
				}
			} else if (cur_target.className === 'option'){
				cur_target.parentElement.parentElement.querySelector('.selected').innerHTML = cur_target.textContent;
				var target = cur_target.parentElement.getAttribute('data-target');
				cur_target.parentElement.parentElement.parentElement.querySelector('input[name='+ target + ']').value = cur_target.textContent;
				cur_target.parentElement.classList.remove('opened');
				cur_target.parentElement.parentElement.querySelector('.selected').classList.add('not_empty');
			}
		}, 
		closeOthers: function(){
			var current = event.target;
			var current_name = current.getAttribute('data-default');
			var item = $('.' + current.className).parent('.selection').parent('.filter_form').children('.selection');
			$.each(item, function(){
				if (($(this).children('.selection_options').hasClass('opened')) && $(this).children('.selected').attr('data-default') !== current_name){
					$(this).children('.selection_options').removeClass('opened');
				}
			})
		},
		handlePreview: function(){
			console.log(event.target);
		},
		handleFilters: function(){
			var tags_body = $('.tag_container > .tags_body');
			tags_body.html('');
			var form = event.target;
			params = [];
			var remote = (form.querySelector('#remote').classList.contains('checked')) ? params.push('remote_work=1') : params.push('remote_work=0');
			var position = (form.querySelector('#position').value) ? params.push('q=' + form.querySelector('#position').value) : null;
			var city = form.querySelector('#filterCity').value ? params.push('location=' + form.querySelector('#filterCity').value) : null;
			var area = form.querySelector('#filterArea').value ? params.push('area='+ form.querySelector('#filterArea').value) : null;
			var salary = form.querySelector('#filterSalary').value ? params.push('salary_from=' + form.querySelector('#filterSalary').value) : null;
			var emp_type = null;
			var sysParams = this.systemParams.employment_types;
			if (form.querySelector('#filterType').value){
				$.each(sysParams, function(type_int, type_string){
					if (type_string === form.querySelector('#filterType').value){
						emp_type = type_string;
						params.push('employment_type=' + type_int);
					} 
				})
			}
			var link = (params) ? this.base_search_link + '?' + params.join('&') : this.base_search_link;
			if (event.target.parentElement.className === 'modal_wrapper'){
				this.closeForm();
				(form.querySelector('#remote').classList.contains('checked')) ? tags_body.append('<div class="filter_tag">Удаленно</div>') : null;
				(form.querySelector('#position').value) ? tags_body.append('<div class="filter_tag">' + form.querySelector('#position').value + '</div>') : null;
				(form.querySelector('#filterCity').value) ? tags_body.append('<div class="filter_tag">' + form.querySelector('#filterCity').value + '</div>') : null;
				(form.querySelector('#filterArea').value) ? tags_body.append('<div class="filter_tag">' + form.querySelector('#filterArea').value + '</div>') : null;
				(form.querySelector('#filterSalary').value) ? tags_body.append('<div class="filter_tag">' + form.querySelector('#filterSalary').value + '</div>') : null;
				(form.querySelector('#filterType').value) ? tags_body.append('<div class="filter_tag">' + emp_type + '</div>') : null;
				form.parentElement.parentElement.parentElement.querySelector('.search_button').setAttribute('data-target', link);
			} else {
				axios
					.get(link)
					.then(response => {
						this.info = response
					})
					.catch(error => {
						console.log(error)
						this.errored = true
					})
					.finally(() => this.loading = false)
			}
			
		},
		openBurger: function(){
			if (event.target.className === 'navbar_burger'){
				event.target.classList.add('opened');
			}
		},
		closeBurger: function(){
			if (event.target.className === 'menu_wrapper'){
				event.target.parentElement.classList.remove('opened');
			}
		},
		openForm: function(){
			if ((event.target.className === 'filters_button') || (event.target.parentElement.className === 'filters_button')){
				document.querySelector('.filters_modal').classList.add('opened');
			}
		},
		closeForm: function(){
			if (event.target.className === 'close_button'){
				event.target.parentElement.parentElement.parentElement.classList.remove('opened');
			}
			if (event.submitter){
				if (event.submitter.classList.contains('main_button')){
					event.target.parentElement.parentElement.classList.remove('opened');
				}	
			}
		},
		deleteTag: function(){
			if (event.target.className == 'filter_tag'){
				var target_value = event.target.textContent;
				var form = event.target.parentElement.parentElement.parentElement.querySelector('.filters_modal').querySelector('.modal_wrapper').querySelector('.filter_form');
				var search_button = event.target.parentElement.parentElement.parentElement.querySelector('.search_button');
				var link = search_button.getAttribute('data-target');
				var link_object = link.split('?');
				var params = link_object[link_object.length - 1].split('&');
				var input = form.querySelectorAll('input[type=hidden]');
				var selection = form.querySelectorAll('.selection');
				selection.forEach(function(item){
					if (item.querySelector('.selected').classList.contains('not_empty')){
						item.querySelector('.selected').classList.remove('not_empty');
						item.querySelector('.selected').textContent = item.querySelector('.selected').getAttribute('data-default');
					}
				})
				if (target_value == 'Удаленно'){
					link_object.pop('remote_work=1');
					this.remote_work.checked = false;
					event.target.parentElement.removeChild(event.target);
				}
				input.forEach(function(item){
					if (item.value === target_value){
						item.value = '';
						event.target.parentElement.removeChild(event.target);
						params.forEach(function(item_object){
							if (item_object.split('=')[0] === item.getAttribute('name')){
								params.pop(item_object);
							}
						})
					}
				})
				search_button.setAttribute('data-target', link_object[0] + '?' + params.join('&'));
			}
		},
		handleSearch: function(){
			if ((event.target.className === 'search_button') || (event.target.parentElement.className === 'search_button')){
				if (event.target.offsetParent.clientWidth >= 412){
					$('html, body').animate({
						scrollTop: $('.filters').offset().top - 100
					}, 2000);
					var q_input = document.querySelector('input#search').value;
					$('input[name=position]').val(q_input);
				} else {
					var q_input = document.querySelector('input#search');
					var button = document.querySelector('.search_button');
					if (button.getAttribute('data-target')){
						var link = button.getAttribute('data-target') + '&q=' + q_input.value;
					} else {
						var link = this.base_search_link + '?q=' + q_input.value
					}
					axios
						.get(link)
						.then(response => {
							this.info = response
						})
						.catch(error => {
							console.log(error)
							this.errored = true
						})
						.finally(() => this.loading = false)
					$('html, body').animate({
						scrollTop: $('#vacancies').offset().top - 100
					}, 2000);
				}
			}
		},
		moveSlider: function(event){
			var button = event.target.className;
			if ((button === 'arrow_left') || (button === 'arrow_right')){
				var slider = $('.carousel_body');
				let pos = parseFloat($(slider).scrollLeft());
				var elements = $(slider).children('.vacancy_card').length;

				if (!($(slider).children('vacancy_card').width * elements < $(slider).width)){
					if (button === 'arrow_right'){
						var actual_pos = parseFloat($(slider).scrollLeft());
						var width = $(slider).children('.vacancy_card').width() + 58;
						var full_width = width * elements;
						var event = parseFloat($(slider).scrollLeft()) + width;
						if ((event + width) <= full_width){
							$(slider).animate({scrollLeft: event}, 1000);
						}
					} else if (button === 'arrow_left'){
						var actual_pos = parseFloat($(slider).scrollLeft());
						var width = $(slider).children('.vacancy_card').width() + 58;
						var full_width = width * elements;
						var event = parseFloat($(slider).scrollLeft()) - width;
						if ((width + event) >= 0){
							$(slider).animate({scrollLeft: event}, 1000);
						}
					}
				}
			}

		}
	},
});