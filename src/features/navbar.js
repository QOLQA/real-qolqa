export const haddleButtonNavbar = (id_section_father, id_section) => {
  const father = document.getElementById(id_section_father);
  const section = document.getElementById(id_section);

  if (!section.classList.contains('hidden')) {
    section.classList.add('hidden');
    return
  }

  Array.from(father.children).forEach((children) => {
    if (children.id === id_section) {
      children.classList.remove('hidden');
    }
    else {
      children.classList.add('hidden');
    }
  });
}

export const haddleQuerySection = () => { haddleButtonNavbar("navbar-sections", "query-section") }
export const haddleEditSection = () => { haddleButtonNavbar("navbar-sections", "edit-section") }
export const haddleStatsSection = () => { haddleButtonNavbar("navbar-sections", "stats-section") }

export const haddleNavbar = () => {
  const buttonQuerys = document.getElementById("buttonQuerys");
  const buttonEdit = document.getElementById("buttonEdit");
  const buttonStats = document.getElementById("buttonStats");

  buttonQuerys.addEventListener('click', () => { haddleQuerySection() });
  buttonEdit.addEventListener('click', () => { haddleEditSection() });
  buttonStats.addEventListener('click', () => { haddleStatsSection() });
}

