var basic = new Vue({
	el: '#mainContent',
	data: {
		text: 'text is so short',
		icon_class: {
			without_icon: false,
		}
	},
	methods:{
		hideIcon: function(event){
			if (event.target.value !== ''){
				return this.icon_class.without_icon = true;
			}
			if (event.target.value === ''){
				return this.icon_class.without_icon = false;
			}
		}
	}
});