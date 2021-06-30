window.onload = function () {
    document.getElementById("searchbtn").onclick = function(){google(document.getElementById('searchbar').value);};
    document.getElementById("nothis").onclick = function(){showToast("不是點這個，是左邊那個");};

    if (getParam('search')==null) {
        document.getElementById("generatebtn").style.visibility = "visible";
        document.getElementById("generatebtn").onclick = function(){
            if (document.getElementById('searchbar').value=='') {
                showToast('至少輸入點什麼吧');
            }else {
                document.getElementById("link").innerHTML = generate(document.getElementById('searchbar').value);
                showToast("已產生");
            }
        };
    }else {
        var searchbar = document.getElementById('searchbar');
        var cursor = $('#cursor');
        var btn = document.getElementById('searchbtn');
        var keyword = getParam('search');
        searchbar.disabled = true;
        searchbar.value = '';
        showToast('第一步：訪問網站Google<br>在此Logo可能不一樣，但沒關係，首先將游標移至輸入框上');
        cursor.animate(
            {
                "top": (searchbar.offsetTop + 15),
                "left": (searchbar.offsetLeft + 25)
            },
            3000, "swing"
        );
        setTimeout(
            function(){
                showToast('第二步：左鍵點擊輸入框，在裡面輸入你想查的東西"' + keyword +'"');
                addSearchText(keyword, 1000/keyword.length);
            },
            3200
        );
        setTimeout(
            function(){
                showToast('第三步：將游標移至搜尋鍵上，左鍵點擊即可查詢你要查詢的東西');
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
                showingToast("這樣都學會了嗎？是不是很簡單呢？");
                cursor.style.left = "47vw";
                cursor.style.top = "59.5vh";
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
    return document.URL + '?' + urlParams.toString();
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