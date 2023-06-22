var basic = new Vue({
	el: '#mainContent',
	data: {
		icon_class: {
			without_icon: false,
		},
		remote_work: {
			checked: false,
		},
		selections: [
			{ name: 'city',
			options: ['Москва', 'Санкт-Петербург', 'Архангельск', 'Астрахань', 'Барнаул', 'Благовещенск', 'Брянск'],
			default: 'Город'
			},
			{ name: 'area',
			options: ['', '', '', '', '', '', '', ''],
			default: 'Сфера'
			},
			{name: 'type',
			options: ['', '', '', '', '', '', '', ''],
			default: 'Формат работы',
			},
			{ name: 'salary',
			options: ['', '', '', '', '', '', '', ''],
			default: 'Зарплата от, ₽'
			},
		]

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
				cur_target.classList.remove('not_empty');
			} else if (cur_target.className === 'selected'){
				var selection = cur_target.parentElement.querySelector('.selection_options');
				if (selection.classList.contains('opened')){
					selection.classList.remove('opened');
				} else {
					selection.classList.add('opened');
				}
			} else if (cur_target.className === 'option'){
				cur_target.parentElement.parentElement.querySelector('.selected').innerHTML = cur_target.textContent;
				cur_target.parentElement.classList.remove('opened');
				cur_target.parentElement.parentElement.querySelector('.selected').classList.add('not_empty');
			}
		},
	}
});