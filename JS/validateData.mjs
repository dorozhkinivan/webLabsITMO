export const isValidNumber = (str, min, max, errors, nameOfVar) => {
    let newStr = str;
    const arr = str.split(',')
    if (arr.length === 2){
        newStr = arr[0] + '.' + arr[1]
    }
    if (newStr.length < 20 && !isNaN(newStr) && !isNaN(parseFloat(newStr)) && !newStr.includes(' ')){
        const val = parseFloat(newStr)
        if (val > max) {
            errors.unshift("Value of " + nameOfVar + " is more than required!")
            return false
        }
        if (val < min) {
            errors.unshift("Value of " + nameOfVar + " is less than required!")
            return false
        }
        return true
    }
    else
    {
        errors.unshift("Value of " + nameOfVar + " was entered incorrectly!")
        return false
    }

}

export const refresh = (errors)=>{
    console.log(errors)
    console.log("abcd")
    const element = document.getElementsByTagName('legend')[0]
    if (errors.length === 0) {
        console.log("ABOBA")
        element.textContent = 'All right!'
        document.getElementById('sub').disabled = false;
        return
    }
    document.getElementById('sub').disabled = true;
    const error = errors[0]
    if (error === 'XEmpty' || error === 'YEmpty' || error === 'REmpty')
        element.textContent = 'Enter all values!'
    else
        element.textContent = error
}