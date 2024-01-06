var type = document.getElementById('typewriter');

var typewriter = new Typewriter(type, {
    loop: true,
    delay:40,
    deleteSpeed:20
});

typewriter.typeString("Student at Harvard University.")
    .pauseFor(1000)
    .deleteAll()
    .pauseFor(500)
    .typeString("Studying MS Data Science.")
    .pauseFor(1000)
    .deleteAll()
    .pauseFor(500)
    .typeString("Aspiring Data Scientist.")
    .pauseFor(1000)
    .deleteAll()
    .pauseFor(500)
    .typeString('Probably rewatching "the office" for the nth time.')
    .pauseFor(1000)
    .deleteAll()
    .pauseFor(500)
    .typeString('Yes I love pink :D')
    .pauseFor(1000)
    .deleteAll()
    .pauseFor(500)
    .typeString("Thank you for visiting!")
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
};