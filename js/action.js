(function ($) {
	
    $.fn.openActive = function (activeSel) {
        activeSel = activeSel || ".active";

        var c = this.attr("class"); //获取当前类名

        this.find(activeSel).each(function () {
            var el = $(this).parent();
            while (el.attr("class") !== c) {
                if (el.prop("tagName") === 'UL') {
                    el.show();
                } else if (el.prop("tagName") === 'LI') {
                    el.removeClass('tree-closed');
                    el.addClass("tree-opened");
                }

                el = el.parent();
            }
        });

        return this;
    }

    
    $.fn.treemenu = function (options) {
        options = options || {};
        options.delay = options.delay || 0;
        options.openActive = options.openActive || false;
        options.activeSelector = options.activeSelector || "";

        //this每一个ul
        this.addClass("treemenu"); //给每一个ul添加treemenu类
        this.find("> li").each(function () { //当前ul下的每一个li
            var _this = $(this); //_this:li
            var subtree = _this.find('> ul');
            var button = _this.find('span').eq(0).addClass('toggler');

            if (button.length == 0) {
                var button = $('<span>'); //创建button
                button.addClass('toggler');
                _this.prepend(button);
            } else {
                button.addClass('toggler');
            }

            if (subtree.length > 0) {
                subtree.hide();
                _this.addClass('tree-closed'); //给li添加类
                
                //折叠按钮点击事件
                _this.find(button).click(function () {
                    var li = $(this).parent('li');
                    li.find('> ul').slideToggle(options.delay);
                    //改变最后一个li:before的高度
                    li.find(".treemenu>li").last().addClass("last_child"); 
                    li.toggleClass('tree-opened');
                    li.toggleClass('tree-closed');
                    li.toggleClass(options.activeSelector);
                });

                $(this).find('> ul').treemenu(options); //递归(折叠功能)
                
                //checkbox点击事件
                _this.find("input[type='checkbox']").click(function(e){
                	e = e || window.event;
    				e.stopPropagation(); //阻止事件冒泡
    				checkchild( $(this) ); //父级->子级
        			checkparent( $(this) ); //子级->父级
    				
                });
                
                
            } else {
                $(this).addClass('tree-empty');
            }
        });

        if (options.openActive) {
            this.openActive(options.activeSelector);
        }

        return this;
    }
    
    //父级→子级
    function checkchild(ele){
    	var childCheckBox = $(ele).parents("li:first").find("input[type='checkbox']"); //所有子级checkbox数组
    	
    	//如果当前checkbox被选中, 或者子级已有选中
    	if ( $(ele).prop('checked') == true || $(ele).hasClass("soso") ) { 
            childCheckBox.prop('checked', true);
               
        } else { //如果当前checkbox未被选中
            childCheckBox.prop('checked', false);
           	
        }
    }
    
    //子级->父级
	function checkparent(ele){
		var parentUl = $(ele).parents(".treemenu:first").prop("checked",true); //当前li的父级ul元素
		
		//同级所有的input数量
		var allNum = parentUl.find("li").length;
		//同级所有被选中的input数量
		var checkedNum = parentUl.find("li").find("input[type=checkbox]:checked").length; //所有input的数量
		
		//上一级菜单的li
		var prevLi = parentUl.parents("li:first"); 
		//上一级菜单的input[checkbox]
		var prevLiInput = prevLi.find("label:first").find("input[type=checkbox]");
		
		//判断是否全选中
		if (checkedNum>0 && checkedNum==allNum){
			prevLiInput.prop("checked",true);
			prevLiInput.removeClass("soso");
		}else if( checkedNum>0 && checkedNum<allNum ){
			prevLiInput.prop("checked",true);
			prevLiInput.addClass("soso");
		}else{
			prevLiInput.prop("checked",false);
			prevLiInput.removeClass("soso");
		}
		
		//如果存在上一级
		if(parentUl.length){
			checkparent(prevLiInput); //递归
		}
		
	}
  	
    
})(jQuery);


$(function () {
	
    //函数调用
    $(".tree").treemenu({ delay: 300 }).openActive();

})
