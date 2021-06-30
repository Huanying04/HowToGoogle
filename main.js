window.onload = function () {
    var lang = getParam('lang')==null?"zh_tw":fileExists("lang/" + getParam('lang') + ".json")?getParam('lang'):"zh_tw";
    var translation;

    $("#lang").val($("#" + lang).text());

    function ajaxCall1() {
        return  $.ajax({
            type: 'GET',
            url: "lang/" + lang + ".json",
            success: function(data) {
                translation = data;
            }
        });
    }   

    $.when(
        ajaxCall1()
    ).done(
        function() {
            $("#searchbtn").html(translation.search);
            $("#nothis").html(translation.feelingLucky);
            $("#generatebtn").html(translation.generate);
            $("#copy").html(translation.copy);
            $("#langHint").html(translation.langHint);

            if (getParam('search')==null || getParam('search')=='') {
                document.getElementById("searchbtn").onclick = function(){google(document.getElementById('searchbar').value);};
                document.getElementById("nothis").onclick = function(){showToast(translation.nothishint);};
                document.getElementById("generatebtn").style.visibility = "visible";
                document.getElementById("generatebtn").onclick = function(){
                    if (document.getElementById('searchbar').value=='') {
                        showToast(translation.emptySearch);
                    }else {
                        document.getElementById("link").innerHTML = generate(document.getElementById('searchbar').value);
                        document.getElementById("result").style.visibility = "visible";
                        showToast(translation.generated);
                    }
            };
            document.getElementById("copy").onclick = function(){
                var el = document.getElementById('link');
                var range = document.createRange();
                range.selectNodeContents(el);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                document.execCommand('copy');
                showToast(translation.copied);
            };
        }else {
            document.getElementById("generatebtn").onclick = function(){showToast(translation.not4u);};
            var searchbar = document.getElementById('searchbar');
            var cursor = $('#cursor');
            var btn = document.getElementById('searchbtn');
            var keyword = getParam('search');
            searchbar.disabled = true;
            searchbar.value = '';
            showToast(translation.step1);
            cursor.animate(
                {
                    "top": (searchbar.offsetTop + 15),
                    "left": (searchbar.offsetLeft + 25)
                },
                3000,
                "swing"
            );
            setTimeout(
                function(){
                    showToast(translation.step2_1 + keyword + translation.step2_2);
                    addSearchText(keyword, 1000/keyword.length);
                },
                3200
            );
            setTimeout(
                function(){
                    showToast(translation.step3);
                    cursor.animate({
                        "top": (btn.offsetTop + 20),
                        "left": (btn.offsetLeft + 50)
                    },
                    3000
                    );
                },4400
            );
            setTimeout(
                function(){
                    showingToast(translation.tutorialFinish);
                    document.getElementById("searchbtn").onclick = function(){google(document.getElementById('searchbar').value);};
                    document.getElementById("nothis").onclick = function(){showToast(translation.nothishint);};
                },
                7400
            );
            setTimeout(
                function(){
                    google(keyword);
                },
                10400
            );
        }

    });

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

function animateSearchGuide() {
    var element = document.getElementById("cursor");
    element.className = "show";
    setTimeout(
        function(){
            element.className = element.className.replace("show", "");
        },
        1000);
}

function addSearchText(str, time) {
    var searchbar = document.getElementById('searchbar');
    searchbar.value += str[0];
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

function fileExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status==200;
}