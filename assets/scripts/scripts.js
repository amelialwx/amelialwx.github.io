var type = document.getElementById('typewriter');

var typewriter = new Typewriter(type, {
    loop: true,
    delay:40,
    deleteSpeed:20
});

typewriter.typeString('hi!')
    .pauseFor(1000)
    .deleteAll()
    .pauseFor(500)
    .typeString("my name is amelia.")
    .pauseFor(1000)
    .deleteAll()
    .pauseFor(500)
    .typeString("i'm a student at harvard university.")
    .pauseFor(1000)
    .deleteAll()
    .pauseFor(500)
    .typeString("i'm studying MS data science.")
    .pauseFor(1000)
    .deleteAll()
    .pauseFor(500)
    .typeString("thank you for visiting!")
    .pauseFor(1000)
    .deleteAll()
    .start();

filterSelection("all")
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("each-project");
  if (c == "all") c = "";
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    console.log(element.className, arr2[i]);
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}

function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

var btnContainer = document.getElementById("button-section");
var btns = btnContainer.getElementsByClassName("filter-button");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}