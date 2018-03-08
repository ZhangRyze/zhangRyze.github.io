(function(){
    var valine = new Valine({
        el:'#vcomments',
        notify:#{theme.valine.notify} || false,
        verify:#{theme.valine.verify}|| false,
        app_id:'#{theme.valine.appid}',
        app_key:'#{theme.valine.appkey}',
        placeholder:'#{theme.valine.placeholder}',
        path: window.location.pathname,
        avatar:'#{theme.valine.avatar}'
    })
})()