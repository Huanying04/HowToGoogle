window.onload = function () {
    var lang = getParam('lang')==null?"zh_tw":fileExists("lang/" + getParam('lang') + ".json")?getParam('lang'):"zh_tw";
    var translation;
    var searchParam = getParam('search');

    $("#lang").val($("#" + lang).text());
    $("html").attr("lang", lang);

    function loadTranslation() {
        return  $.ajax({
            type: 'GET',
            url: "lang/" + lang + ".json",
            success: function(data) {
                translation = data;
            }
        });
    }   

    $.when(
        loadTranslation()
    ).done(
        function() {
            $("#searchbtn").html(translation.search);
            $("#nothis").html(translation.feelingLucky);
            $("#generatebtn").html(translation.generate);
            $("#copy").html(translation.copy);
            $("#langHint").html(translation.langHint);
            $("#type-search").html(translation.mainType);
            $("#type-image").html(translation.imageType);
            $("#type-searchbyimage").html(translation.searchByImageTpye);

            if (searchParam==null || searchParam=='') {
                $("#searchbtn").click(function(){google(document.getElementById('searchbar').value);});
                $("#nothis").click(function(){showToast(translation.nothishint);});
                $("#generatebtn").css('visibility', 'visible');
                $("#generatebtn").click(function(){
                    if (document.getElementById('searchbar').value=='') {
                        showToast(translation.emptySearch);
                    }else {
                        document.getElementById("link").innerHTML = generate(document.getElementById('searchbar').value);
                        document.getElementById("result").style.visibility = "visible";
                        showToast(translation.generated);
                    }
                });
                $("#copy").click(function(){
                    var el = document.getElementById('link');
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    document.execCommand('copy');
                    showToast(translation.copied);
                });
            }else {
                $("#generatebtn").click(function(){showToast(translation.not4u);});
                var searchbar = $("#searchbar");
                var cursor = $('#cursor');
                var btn = $("#searchbtn");
                searchbar.val('');
                searchbar.on('input',function(){
                    searchbar.val(searchbar.val().substr(0, searchbar.val().length - 1));
                });
                showToast(translation.step1);
                cursor.animate(
                    {
                        "top": (searchbar.offset().top + 15),
                        "left": (searchbar.offset().left + 25)
                    },
                    3000,
                    "swing"
                );
                setTimeout(
                    function(){
                        $("#searchbar").focus()
                        showToast(translation.step2_1 + searchParam + translation.step2_2);
                        addSearchText(searchParam, 1000/searchParam.length);
                    },
                    3200
                );
                setTimeout(
                    function(){
                        showToast(translation.step3);
                        cursor.animate({
                            "top": (btn.offset().top + 20),
                            "left": (btn.offset().left + 50)
                        },
                        3000
                        );
                    },4400
                );
                setTimeout(
                    function(){
                        showingToast(translation.tutorialFinish);
                        document.getElementById("searchbtn").onclick = function(){google(searchbar.val());};
                        document.getElementById("nothis").onclick = function(){showToast(translation.nothishint);};
                    },
                    7400
                );
                setTimeout(
                    function(){
                        google(searchParam);
                    },
                    10400
                );
            }
        }
    );

    $("#lang").change(
        function() {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            urlParams.set('lang', $("#lang").children(":selected").attr("id"));
            window.location.href=location.protocol + '//' + location.host + location.pathname + '?' + urlParams.toString();
        }
    )
}

function google(keyword) {
    window.location.href=encodeURI('https://www.google.com/search?q='+keyword+'&oq='+keyword+'&ie=UTF-8');
}

function showToast(content, color) {
    var toast = document.createElement("toast");
    toast.id = "toast";
    toast.innerHTML = content;
    toast.className = "show";
    var element = document.getElementById("toasts");
    element.append(toast);
    toast.style.backgroundColor = color==undefined?"#333":color;
    setTimeout(
        function(){
            toast.className = toast.className.replace("show", "");
            toast.remove();
        },
        3000);
}

function showingToast(content, color) {
    var toast = document.createElement("toast");
    toast.id = "toast";
    toast.innerHTML = content;
    toast.className = "showing";
    var element = document.getElementById("toasts");
    element.append(toast);
    toast.style.backgroundColor = color==undefined?"#333":color;
}

function getParam(key) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(key);
}

function generate(keyword) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.append('search', keyword);
    return location.protocol + '//' + location.host + location.pathname + '?' + urlParams.toString();
}

function addSearchText(str, time) {
    var searchbar = $('#searchbar');
    searchbar.val(searchbar.val() + str[0]);
    str = str.slice(1);
    if (str.length == 0) {
        return;
    }
    setTimeout(
        function(){
            addSearchText(str, time);
        },
        time
    );
}

function fileExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status==200;
}