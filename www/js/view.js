define(function() {
	var view = function() {}
		// 从underscore拷贝extend方法
	var ArrayProto = Array.prototype;
	var slice = ArrayProto.slice;
	var nativeForEach = ArrayProto.forEach;
	// Establish the object that gets returned to break out of a loop iteration.
	var breaker = {};

	var each = function(obj, iterator, context) {

		if (obj == null) return obj;
		if (nativeForEach && obj.forEach === nativeForEach) {
			obj.forEach(iterator, context);
		} else if (obj.length === +obj.length) {
			for (var i = 0, length = obj.length; i < length; i++) {
				if (iterator.call(context, obj[i], i, obj) === breaker) return;
			}
		} else {
			var keys = _.keys(obj);
			for (var i = 0, length = keys.length; i < length; i++) {
				if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
			}
		}
		return obj;
	}
	// 从别的对象扩展
	view.prototype.extendOther = function(obj) {
		each(slice.call(arguments, 1), function(source) {
			if (source) {
				for (var prop in source) {
					obj[prop] = source[prop];
				}
			}
		});
		return obj;
	};

	// 从自身扩展
	view.prototype.extend = function(obj) {
		/*each(slice.call(arguments, 1), function(source) {
			if (t) {
*/
		for (var prop in this) {
			obj[prop] = this[prop];
		}
		/*}
		});*/
		obj.$el = $.router.getCurrentPage(); //$el绑定当前页面
		return obj;
	}

	view.prototype.delegateEvents = function(events, el) { //绑定事件
		var me = this;
		me.undelegateEvents(events, el); //先接触绑定，防止重复绑定
		for (var eventItem in events) {
			var eventCallback = events[eventItem]; //事件回调
			// 分割事件
			var delegateEventSplitter = /^(\S+)\s*(.*)$/;
			var match = eventItem.match(delegateEventSplitter);
			var eventName = match[1],
				selector = match[2];

			try {
				var el = el || $.router.getCurrentPage();
			} catch (e) {

			}
			// 绑定事件，利用事件委托的方式
			(function(eventCallback) {
				$(el).on(eventName, selector, function(e) {
					me[eventCallback].apply(me, arguments);
				})
			})(eventCallback);

		}
		return this;
	};

	view.prototype.undelegateEvents = function(events, el) { //解绑事件
		var me = this;
		for (var eventItem in events) {
			var eventCallback = events[eventItem]; //事件回调
			// 分割事件
			var delegateEventSplitter = /^(\S+)\s*(.*)$/;
			var match = eventItem.match(delegateEventSplitter);
			var eventName = match[1],
				selector = match[2];

			try {
				var el = el || $.router.getCurrentPage();
			} catch (e) {

			}
			// 解除事件
			(function(eventCallback) {
				$(el).off(eventName, selector)
			})(eventCallback);

		}
		return this;
	};

	window.View = new view();
	return window.View;
});