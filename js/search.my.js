var searchFunc = function(path, search_id, content_id) {
    'use strict';
    $.ajax({
        url: path,
        dataType: "json",
        success: function( results ) {
            // get the contents from search data
            var _input = document.getElementById(search_id);
            if (!_input) return;
            var _resultContent = document.getElementById(content_id);

            _input.addEventListener('input', function(){
                var str='<ul class=\"search-result-list\">';
                var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                _resultContent.innerHTML = "";
                if (this.value.trim().length <= 0) {
                    _resultContent.innerHTML = "<div class='local-search-prompt'>搜一搜看看吧 ~</div>";
                    return;
                }
                // perform local searching
                results.forEach(function(data) {
                    var isMatch = true;
                    var content_index = [];
                    if (!data.title || data.title.trim() === '') {
                        data.title = "Untitled";
                    }
                    var data_title = data.title.trim().toLowerCase();
                    var data_content = data.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
                    var data_url = data.url;
                    var data_url_decode = decodeURIComponent(data.url).split('/');
                    var data_date = null;
                    if(data_url_decode.length == 6){
                        data_date = data_url_decode[1] + '-' + data_url_decode[2] + '-' + data_url_decode[3];
                    }
                    var index_title = -1;
                    var index_content = -1;
                    var first_occur = -1;
                    // only match artiles with not empty contents
                    if (data_content !== '') {
                        keywords.forEach(function(keyword, i) {
                            index_title = data_title.indexOf(keyword);
                            index_content = data_content.indexOf(keyword);
                            if( index_title < 0 && index_content < 0 ){
                                isMatch = false;
                            } else {
                                if (index_content < 0) {
                                    index_content = 0;
                                }
                                if (i == 0) {
                                    first_occur = index_content;
                                }
                                // content_index.push({index_content:index_content, keyword_len:keyword_len});
                            }
                        });
                    } else {
                        isMatch = false;
                    }
                    // show search results
                    if (isMatch) {
                        str += "<li>";
                        str += "<a href='/"+ data_url +"' class='search-result-item'>";
                        str += "<div>"+ data_title +"</div>";
                        str += "<div>";
                        str += "<div>";
                        str += "<div><i class='iconfont ic-category'></i>"+ data.categories[0] +"</div>";
                        str += "<div><i class='iconfont ic-tag'></i>"+ data.tags[0] +"</div>";
                        str += "</div>";
                        str += "<div>"+ data_date +"</div>";
                        str += "</div>";
                        str += "</a></li>";
                    }
                });
                str += "</ul>";
                _resultContent.innerHTML = str;
            });
        }
    });
}
// search
var path = '/search.json';
searchFunc(path, 'local-search-input', 'local-search-result')