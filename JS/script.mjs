import {Animation} from "./animation.mjs";
import {addRequestElement} from "./addRequestElement.mjs";
import {changeTheme, setThemeMode} from "./themes.mjs";
import {isValidNumber, refresh} from "./validateData.mjs";
setThemeMode()
//sessionLoad()
document.getElementById('inputY').addEventListener('mouseover', ()=>{document.getElementById('rangeY').style.visibility = 'visible'})
document.getElementById('inputY').addEventListener('mouseout', ()=>{document.getElementById('rangeY').style.visibility = 'hidden'})
document.getElementById('inputR').addEventListener('mouseover', ()=>{document.getElementById('rangeR').style.visibility = 'visible'})
document.getElementById('inputR').addEventListener('mouseout', ()=>{document.getElementById('rangeR').style.visibility = 'hidden'})
const validateFormat = (data) => {
    //if (parseInt(data.x))
    return true;
}
const showRequest = (status, responseText='') => {
    window.amountOfRequests ++
    animation.addMicroAnimation({elementId : 'requests', speed:-1, toDefaultStatus:'before', difference:-80, property:'top',
        afterMicroAnimation:()=>
        {
            addRequestElement(responseText, status)
        }, isReturnableMicroAnimation: false
    })
    animation.addMicroAnimation({elementId : 'requests', speed:15, toDefaultStatus:'no', difference:80, property:'top',isReturnableMicroAnimation: false})
    animation.addMicroAnimation({elementId:"request№" + window.amountOfRequests.toString(), property:"left", difference:-910, speed:50, statusClickableAfter:"shown", toDefaultStatus:"no",
        afterMicroAnimation:()=>{
            for(let i of document.getElementsByClassName('request')){
                const arr = i.classList
                arr.remove('shownRequest')
                arr.add('hiddenRequest')
            }
        }, actionAfterAndBeforeReversedStatus:false, actionAfterMicroAnimationStatus:"back"
    })
}


const handle = (data) => {
        const xhr = new XMLHttpRequest();
        let done = false
    console.log(data)
        xhr.open("get", "./php/main.php?" + Object.keys(data).map(key => key + '=' + data[key]).join('&'))
        setTimeout(()=>{if (!done){
            done = true
            showRequest(-1)
        }
        }, 7000)
        xhr.onloadend = ()=>{
            if(!done) {
                done = true
                showRequest(xhr.status, xhr.responseText)
            }
        }
        xhr.send()
}

const clean = () => {
    const radios = document.getElementsByTagName('input')
    for (let r of radios) {
        if (r.getAttribute('type') === 'radio')
            r.checked = false
    }
    const r = document.getElementById('inputR')
    r.classList.remove('greenStyle');
    r.value = ''
    const y = document.getElementById('inputY')
    y.classList.remove('greenStyle');
    y.value = ''
    document.getElementsByTagName('legend')[0].textContent = 'Enter X, Y, R values.'
    inputErrors = ['XEmpty', 'YEmpty', 'REmpty']
}

const form = document.getElementById('mainForm');
form.addEventListener('submit', (e)=>{
    document.getElementById("sub").disabled = true;
    e.preventDefault()
    const formData = new FormData(form)
    const x = formData.get('x')
    const y = formData.get('y')
    const r = formData.get('r')
    handle({x, y, r})
    clean()
})




window.amountOfRequests = 0
let clickableStatus = {status : 'normal'}
const animation = new Animation(clickableStatus)
window.handleClickShow = (indexOfRequest) => {
    if(clickableStatus.status !== 'normal' || animation.getAnimationIsRunning())
        return;
    animation.addMicroAnimation({elementId:'requests', property:"top", difference: -(window.amountOfRequests - indexOfRequest) * (60 + 5*2 + 10), speed:15, toDefaultStatus:"before"})
    animation.addMicroAnimation({elementId:"request№" + indexOfRequest.toString(), property:"left", difference:-910, speed:50, statusClickableAfter:"shown", toDefaultStatus:"no",
        afterMicroAnimation:()=>{
            for(let i of document.getElementsByClassName('request')){
                const arr = i.classList
                if (arr.contains('hiddenRequest'))
                    arr.remove('hiddenRequest')
                if (!arr.contains('shownRequest'))
                    arr.add('shownRequest')
            }
        },
        beforeMicroAnimation:()=>{
            for(let i of document.getElementsByClassName('request')){
                const arr = i.classList
                if (arr.contains('shownRequest'))
                    arr.remove('shownRequest')
                if (!arr.contains('hiddenRequest'))
                    arr.add('hiddenRequest')
            }
        }
    })
}
window.handleClickHide = () => {
    if(clickableStatus.status !== 'shown' || animation.getAnimationIsRunning())
        return;
    animation.addMicroAnimation({toDefaultStatus:"action"})
}

setThemeMode()
//document.getElementById('toAnotherTheme').setAttribute('src', 'images/toDarkTheme.png')
window.handleClickChangeColor = ()=>{
    changeTheme(document.getElementById('toAnotherTheme').getAttribute('src') === 'images/toLightTheme.jpg')
}



const checkInputText = (element, min, max, errors, varName) => {
    let isOk;
    const str = element.value
    for (let i = 0; i < errors.length; i++)
        if (errors[i].includes(` ${varName} `))
            errors.splice(i, 1)
    if (str === '' || str === null) {
        isOk = false
        errors.push(varName + 'Empty')
    }
    else {
        const index = errors.indexOf(varName + 'Empty');
        if (index !== -1) {
            errors.splice(index, 1);
        }
        isOk = isValidNumber(str, min, max, errors, varName)
    }
    refresh(errors)
    const arr = element.classList
    if (isOk){
        if (arr.contains('redStyle'))
            arr.remove('redStyle')
        if (!arr.contains('greenStyle'))
            arr.add('greenStyle')
    }
    else {
        if (arr.contains('greenStyle'))
            arr.remove('greenStyle')
        if (!arr.contains('redStyle'))
            arr.add('redStyle')
    }
}




let inputErrors = ['XEmpty', 'YEmpty', 'REmpty']

const radios = document.getElementsByTagName('input')
for (let r of radios){
    if (r.getAttribute('type') === 'radio')
        r.addEventListener('change', ()=>{
            const index = inputErrors.indexOf('XEmpty');
            if (index !== -1) {
                inputErrors.splice(index, 1);
                refresh(inputErrors)
            }
            }
        )
}

const inputY = document.getElementById('inputY')
const inputR = document.getElementById('inputR')
inputR.addEventListener('input', ()=>
{
    checkInputText(inputR, 2, 5, inputErrors, 'R')
})

inputY.addEventListener('input', ()=>
{
    checkInputText(inputY, -3, 5, inputErrors, 'Y')
})