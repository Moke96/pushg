function loadDoc(file) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("main_content").innerHTML =  this.responseText;
        }
    };
    var filename = file + ".html";
    xhttp.open("GET", filename, true);
    xhttp.send();
}