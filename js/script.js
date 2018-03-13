function openSearch() {
	$("#modal-container-bg").show();
	$("#local-search-box").show();
}

function closeSearch() {
	$("#modal-container-bg").hide();
	$("#local-search-box").hide();
}
// 请求点击数，显示在页面上
function showHitCount(Counter) {
	// 这是给一个页面中有多篇文章时所调用的，例如博客主界面或者存档界面。
	var query = new AV.Query(Counter);
	var entries = [];
	var _visitors = $(".post-hits"); // 获取页面中所有文章的阅读数容器

	_visitors.each(function() {
		entries.push($(this).attr("id").trim());
	});

	// 批量查询
	query.containedIn('url', entries);
	query.find({
		success:function(results){
			if (results.length === 0) {
				_visitors.html('阅读数: 0');
				return;
			}

			for (var i = 0; i < results.length; i++) {
				var item = results[i];
				var url = item.get('url');
				var hits = item.get('hits'); // 获取点击次数
				$('#' + url).html('阅读数：' + hits + '次')
			}
		},
		error: function(object, error) {
			console.log("Error: " + error.code + " " + error.message);
		}
	})
}
// 为页面添加点击数
function addCount(Counter) {
	// 页面（博客文章）中的信息：leancloud_visitors
	// id为page.url， data-flag-title为page.title
	var _visitors = $(".post-hits");
	var url = _visitors.attr('id').trim();
	var title = _visitors.data('post-title').trim();
	var query = new AV.Query(Counter);

	// 只根据文章的url查询LeanCloud服务器中的数据
	query.equalTo("url", url);
	query.find({
		success: function(results) {
			if (results.length > 0) { //说明LeanCloud中已经记录了这篇文章
				var counter = results[0];
				counter.fetchWhenSave(true);
				counter.increment("hits"); // 将点击次数加1
				counter.save(null, {
					success: function(counter) {
						$('#' + url).html('阅读数' + counter.get('hits') + '次')
					},
					error: function(counter, error) {
						console.log('Failed to save Visitor num, with error message: ' + error.message);
					}
				});
			} else {
				// 执行这里，说明LeanCloud中还没有记录此文章
				var newcounter = new Counter();
				/* Set ACL */
				var acl = new AV.ACL();
				acl.setPublicReadAccess(true);
				acl.setPublicWriteAccess(true);
				newcounter.setACL(acl);
				/* End Set ACL */
				newcounter.set("title", title); // 把文章标题
				newcounter.set("url", url); // 文章url
				newcounter.set("hits", 1); // 初始点击次数：1次
				newcounter.save(null, { // 上传到LeanCloud服务器中
					success: function(newcounter) {
						$('#' + url).html('阅读数' + newcounter.get('hits') + '次')
					},
					error: function(newcounter, error) {
						console.log('Failed to create');
					}
				});
			}
		},
		error: function(error) {
			console.log('Error:' + error.code + " " + error.message);
		}
	});
}