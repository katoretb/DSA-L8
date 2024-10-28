let arr = []
let pat = []
let patt = []
let result = []

function txtar(e){
    input = e.value
    localStorage.setItem("inp", input.trim())
    if(input.trim() == '')
        return
    ARR2D(input)
    return
}

function auto_grow(e) {
    e.style.height = "50px";
    e.style.height = (e.scrollHeight) + "px";
    return
}

function loadRemem(){
    if(localStorage.getItem("inp")){
        document.getElementById("txtarea").value = localStorage.getItem("inp")
        auto_grow(document.getElementById('txtarea'))
        ARR2D(localStorage.getItem("inp"))
    }
    return
}

function ARR2D(input){
    inparr = input.split("\n")
    genPatternTable(inparr)
    arr = inparr.slice(2, -1)
    arr.forEach((element, i) => {
        arr[i] = element.trim().split(" ")
    });
    DrawTable()
    MatchAll()
    return
}

function genPatternTable(inparr){
    pat = inparr[inparr.length-1].trim().split(" ")
    patt = Array(pat.length).fill(0)

    count = 0
    i = 0
    for(let j = 1;j<pat.length;j++){
        if(pat[i] == pat[j]){
            count += 1
            patt[j] = count
            i += 1
            continue
        }
        if(i > 0){
            i = patt[i-1]
            count = patt[i]
            j -= 1
        }
    }
    DrawPatTable()
    return
}

function DrawTable(){
    tmpH = `<tr><th style="background-color: rgba(255, 255, 255, 0.1)" scope="col">#</th>`
    tmp = ""
    arr.forEach((e, i) => {
        tmp += "<tr>"
        tmp += `<th style="background-color: rgba(255, 255, 255, 0.1)" scope="row">${i+1}</th>`
        e.forEach((ei, iei) => {
            tmp += `<td id="vsE${i}${iei}">${ei}</td>`
        })
        tmp += "</tr>"
    })
    arr[0].forEach((e, i) => {
        tmpH += `<th style="background-color: rgba(255, 255, 255, 0.1)" scope="col">${i+1}</th>`
    })
    tmpH += "</tr>"
    document.getElementById("vsTB").innerHTML = tmp
    document.getElementById("vsTH").innerHTML = tmpH
    return
}

function DrawPatTable(){
    tmpH = `<tr><th scope="col" width="10%" style="border-right: 2px solid white;">Pattern</th>`
    tmpT = `<tr><th scope="col" style="border-right: 2px solid white;">Table</th>`
    pat.forEach(e => {
        tmpH += `<td>${e}</td>`
    })
    patt.forEach(e => {
        tmpT += `<td>${e}</td>`
    })
    tmpH += "</tr>"
    tmpT += "</tr>"
    document.getElementById("patH").innerHTML = tmpH
    document.getElementById("patT").innerHTML = tmpT
    return
}

function MatchAll(){
    result = []
    let LR = arr
    result = result.concat(findMatch(LR, "LR"))

    let RL = []
    arr.forEach(e => {
        RL.push([...e].reverse())
    })
    result = result.concat(findMatch(RL, "RL"))

    let BU = rotateMatrix(arr)
    result = result.concat(findMatch(BU, "BU"))

    let UB = []
    BU.slice().forEach(e => {
        UB.push([...e].reverse())
    })
    result = result.concat(findMatch(UB, "UB"))
    drawRes(result)
    return
}

function rotateMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotatedMatrix = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            rotatedMatrix[col][rows - 1 - row] = matrix[row][col];
        }
    }

    return rotatedMatrix;
}

function drawRes(result){
    tmp = ``
    result.forEach( (e, i) => {
        tmp += `<tr onclick="highlight('${e}')"><th scope="row">${i+1}</th>`
        switch(e[3]){
            case "LR":
                tmp += `<td >(${e[0]+1},${e[2]+1})</td>`
                tmp += `<td >(${e[1]+1},${e[2]+1})</td>`
                tmp += `<td >${e[3]}</td></tr>`
                break;
            case "RL":
                tmp += `<td >(${e[1]+1},${e[2]+1})</td>`
                tmp += `<td >(${e[0]+1},${e[2]+1})</td>`
                tmp += `<td >${e[3]}</td></tr>`
                break;
            case "UB":
                tmp += `<td >(${e[2]+1},${e[0]+1})</td>`
                tmp += `<td >(${e[2]+1},${e[1]+1})</td>`
                tmp += `<td >${e[3]}</td></tr>`
                break;
            default:
                tmp += `<td >(${e[2]+1},${arr.length - e[0]})</td>`
                tmp += `<td >(${e[2]+1},${arr.length - e[1]})</td>`
                tmp += `<td >${e[3]}</td></tr>`
        }
        tmp += `</tr>`
    })
    document.getElementById("resT").innerHTML = tmp
    return
}

function highlight(e){
    e = e.split(",")
    DrawTable()
    ss = [parseInt(e[0]), parseInt(e[1])]
    r = parseInt(e[2])
    v = false
    if(e[3].includes("U"))
        v = true

    if(e[3] == "BU")
        ss = [arr.length - e[0], arr.length - e[1]]

    for(let i = ss[0]; i <= ss[1]; i++){
        document.getElementById(`vsE${v ? i : r}${v ? r : i}`).style.backgroundColor = "rgba(0, 255, 0, 0.2)"
    }
}


function findMatch(base, type){
    let match = []
    // [[start, end, row, type]]
    base.forEach((e, row) => {
        let pi = 0;
        let tmp = [0, 0, row, type]
        let i = 0
        while(i < e.length){
            if(e[i] == pat[pi]){
                if(pi == 0){
                    tmp[0] = i
                }
                if(pi == pat.length-1){
                    tmp[1] = i
                    match.push([...tmp])
                    i = tmp[0] + 1
                    pi = 0
                    continue
                }
                pi += 1
                i += 1
                continue
            }
            pi = pi - ((pi+1) - patt[pi+1])
            i += 1
        }
    })
    return match
}

loadRemem()