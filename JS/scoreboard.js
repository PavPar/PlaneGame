let text = localStorage.getItem("score");
var obj = JSON.parse(text);
var Ouput = document.getElementById('output');
console.log(obj);
text = localStorage.getItem("currScores");
var LastRes = JSON.parse(text);
if (LastRes === null) { LastRes = {} }
LastRes[obj.name] = obj.score;
let Arr = []


// localStorage.setItem('currScores',JSON.stringify({}))

for (key in LastRes) {
    Arr.push({ key: key, val: LastRes[key] })
}

Arr.sort((a, b) => {
    return - Number(a.val) + Number(b.val)
})
for (i = 0; i < Arr.length; i++) {
    Ouput.innerHTML = Ouput.innerHTML + Arr[i].key.replace(`'`, '') + '-' + Arr[i].val + '<br>';
    if (i == 10) { break }
}

document.getElementById('Retry').addEventListener('click', (event) => {
    localStorage.setItem('currScores', JSON.stringify(LastRes))
    window.location.href = "index.html";
});