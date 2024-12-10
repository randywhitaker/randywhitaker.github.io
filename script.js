function menuActive(menu_name) {
  switch (menu_name) {
    case 'logout':
      document.getElementById("authenticated").checked = false;
      document.getElementById("showmenu").checked = false;
      document.getElementById("app_content").innerHTML = "<main><h1>Where do you want to go?</h1></main>";
      break;
    default:
      document.getElementById("app_content").innerHTML = `<main><h1>${menu_name} Page</h1></main>`;
      break;
  }
}