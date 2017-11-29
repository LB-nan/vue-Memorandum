//存储localStroage中的数据
var store = {
	save(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}
//取出所有的值
var list = store.fetch("class");
//实例化一个vue——叫做选项对象。
var  filter = {
				all(list){
					return list;
				},
				finished(list){
					return list.filter(function(item){
						return item.isChecked
					})
				},
				unfinished(list){
					return list.filter(function(item){
						return !item.isChecked
					})
				}
			}
var vm = new Vue({
	//挂载数据的HTML的地方 - 模板
	el : ".main",
	//监控
	watch :{
		list : {
			handler : function(){ //监控list属性
				store.save("class",this.list);
			},
			deep : true //深度监控
		},
	},
	//数据
	data : {
		//把数据传过来
		list : list,
		todo : "",
		edtorTodos : '', //记录正在编辑的数据
		brforeTitle : '',//记录正在编辑的数据的title
		visibility:'all' //通过这个属性值的变化进行筛选
	},
	//事件处理函数
	methods : {
		//定义的事件名及回调函数,支持ES6语法
		addTodo(ev){ //添加任务
			//向list中添加任务
			this.list.push({
				title : this.todo,
				isChecked : false
			});
			this.todo = '';
		},
		deleteTodo(todo){ //删除任务
			var index = this.list.indexOf(todo);
			this.list.splice(index,1);
		},
		edtorTodo(todo){//编辑任务
			this.edtorTodos = todo;
			//编辑任务的时候记录一下数据，方便取消的时候重新赋值
			this.brforeTitle = todo.title;
		},
		edtorEnd(todo){//编辑成功
			this.edtorTodos = ""
		},
		cancelTodo(todo){//取消编辑
			//重新赋值
			todo.title = this.brforeTitle;
			todo.title = '';
			// 
			this.edtorTodos = '';
		}
	},
	directives:{ //自定义指令放到这里面
		"foucs" : { //自定义指令
			update(el,binding){ //钩子函数
				if(binding.value){
					el.focus();
				}
			}
		}
	},
	computed : { //计算属性 ：把模板中的一些逻辑拿出来放到这里面，然后把要渲染的结果给模板
		noCheckedLength : function(){
			return this.list.filter(function(item){
				return !item.isChecked
			}).length
		},
		filteredList : function(){
			//all finished unfinished
			
			return filter[this.visibility] ? filter[this.visibility](list) : list;
		}
	}
})
function watchHashChange(){
	var hash = window.location.hash.slice(1);
	vm.visibility = hash;
}
window.addEventListener("hashchange",watchHashChange);