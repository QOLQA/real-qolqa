const haddleButtonNavbar = (id_section_father, id_section) => {
  const father = document.getElementById(id_section_father);
  console.log(father)
  Array.from(father.children).forEach((children) => {
    if (children.id === id_section) {
      children.classList.remove('hidden');
    }
    else {
      children.classList.add('hidden');
    }
  });

}

console.log("asdfasdf");
const buttonQuerys = document.getElementById("buttonQuerys");
const buttonEdit = document.getElementById("buttonEdit");
const buttonStats = document.getElementById("buttonStats");
console.log("sadfasdfasd")


buttonQuerys.addEventListener('click', () => { haddleButtonNavbar("navbar-sections", "query-section") });
buttonEdit.addEventListener('click', () => { haddleButtonNavbar("navbar-sections", "edit-section") });
buttonStats.addEventListener('click', () => { haddleButtonNavbar("navbar-sections", "stats-section") });

console.log("gaaa");
// const actionsNavbar = {
//   querys: haddleButtonNavbar("sdfasdf", "asdfasd"),
//   edit: haddleButtonNavbar("sdfasdf", "tyertywr"),
//   stats: haddleButtonNavbar("sdfasdf", "hjklhkf"),
// }
