export const setThemeMode = () => {
    const newLink = document.createElement("link");
    newLink.setAttribute("rel", "stylesheet");
    newLink.setAttribute("id", "colorLink");
    const element = document.getElementById('toAnotherTheme')
    newLink.setAttribute("type", "text/css");

    //newLink.setAttribute("href", "css/colorsLight.css");
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        newLink.setAttribute("href", "css/colorsDark.css");
        element.setAttribute('src', 'images/toLightTheme.jpg')
        document.getElementById('imgXY').setAttribute('src', 'images/darkXY.png')
    }
    else {
        newLink.setAttribute("href", "css/colorsLight.css");
        element.setAttribute('src', 'images/toDarkTheme.png')
        document.getElementById('imgXY').setAttribute('src', 'images/lightXY.png')
    }
    document.getElementsByTagName("head")[0].insertAdjacentElement('beforeend', newLink)
    //document.getElementsByTagName("head").item(cssLinkIndex).replaceChild(newlink, oldlink);
}
//<link href="css/colorsDark.css" type="text/css" rel="stylesheet" className="colorTheme" id="dark">
 //   <link href="css/colorsLight.css" type="text/css" rel="stylesheet" className="colorTheme" id="light">

export const changeTheme = (currentThemeIsDark)=>{
    const ell = document.getElementById('colorLink')
    if (currentThemeIsDark){
        ell.setAttribute("href", "css/colorsLight.css");
        document.getElementById('toAnotherTheme').setAttribute('src', 'images/toDarkTheme.png')
        document.getElementById('imgXY').setAttribute('src', 'images/lightXY.png')
    }
    else{
        ell.setAttribute("href", "css/colorsDark.css");
        document.getElementById('toAnotherTheme').setAttribute('src', 'images/toLightTheme.jpg')
        document.getElementById('imgXY').setAttribute('src', 'images/darkXY.png')
    }
    ell.remove()
    document.getElementsByTagName("head")[0].insertAdjacentElement('beforeend', ell)
}