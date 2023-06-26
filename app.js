
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
				{ name: 'city',
				options: [],
				default: 'Город'
				},
				{ name: 'area',
				options: [],
				default: 'Сфера'
				},
				{name: 'type',
				options: [],
				default: 'Формат работы',
				},
				{ name: 'salary',
				options: [],
				default: 'Зарплата от, ₽'
				},
			],
		}
	},
	mounted (){
		if (this.rendering){
			axios
				.get('https://api.rekroo.org/pa/vacancy/search')
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
				.get('https://api.rekroo.org/pa/vacancy/search')
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
				document.querySelector('input[name='+ target + ']').value = cur_target.textContent;
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
			var form = event.target;
			params = [];
			var remote = (form.querySelector('#remote').classList.contains('checked')) ? params.push('remote_work=1') : params.push('remote_work=0');
			var position = (form.querySelector('#position').value) ? params.push('q=' + form.querySelector('#position').value) : null;
			var city = form.querySelector('#filterCity').value ? params.push('location=' + form.querySelector('#filterCity').value) : null;
			var area = form.querySelector('#filterArea').value ? params.push('area='+ form.querySelector('#filterArea').value) : null;
			var emp_type = null;
			var sysParams = this.systemParams.employment_types;
			if (form.querySelector('#filterType').value){
				$.each(sysParams, function(type_int, type_string){
					if (type_string === form.querySelector('#filterType').value){
						params.push('employment_type=' + type_int);
					} 
				})
			}
			var salary = form.querySelector('#filterSalary').value ? params.push('salary_from=' + form.querySelector('#filterSalary').value) : null;
			var link = (params) ? 'https://api.rekroo.org/pa/vacancy/search?' + params.join('&') : 'https://api.rekroo.org/pa/vacancy/search';
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
		}
	},
});