const editor=document.getElementById("editor");
const consoleBox=document.getElementById("console");
const statePanel=document.getElementById("statePanel");
const modeText=document.getElementById("modeText");


let devMode=false;


let qubits={};


let circuit=[];


let state=[];


function initQuantum(){


qubits={};


circuit=[];


state=[];


}


function qubit(name){


qubits[name]=0;


circuit.push("Create "+name);


updateState();


}


function h(name){


if(!(name in qubits)) return;


qubits[name]="superposition";


circuit.push("H "+name);


updateState();


}


function cx(a,b){


if(!(a in qubits)) return;
if(!(b in qubits)) return;


circuit.push("CX "+a+" → "+b);


if(qubits[a]==1){


qubits[b]=
qubits[b]==1?0:1;


}


updateState();


}


function x(name){


if(!(name in qubits)) return;


if(qubits[name]===0) qubits[name]=1;
else if(qubits[name]===1) qubits[name]=0;


circuit.push("X "+name);


updateState();


}


function measure(name){


if(!(name in qubits)) return 0;


let value=qubits[name];


if(value==="superposition"){


value=
Math.random()<0.5?0:1;


qubits[name]=value;


}


circuit.push("M "+name+" = "+value);


updateState();


return value;


}


function updateState(){


let text="⚛ Quantum State\n\n";


for(let k in qubits){


text+=
k+
" = "+
qubits[k]+
"\n";


}


text+="\n📈 Circuit:\n";


text+=
circuit.join("\n")||
"(empty)";


statePanel.innerText=text;


}


function print(t){


consoleBox.innerText+=
"\n"+t;


}


function runCode(){


consoleBox.innerText="";


initQuantum();


let lines=
editor.value.split("\n");


for(let line of lines){


line=line.trim();


if(!line) continue;


if(line.includes("= qubit()")){


let n=
line.split("=")[0].trim();


qubit(n);


continue;


}


if(line.startsWith("h(")){


let q=
line.slice(2,-1);


h(q);


continue;


}


if(line.startsWith("x(")){


let q=
line.slice(2,-1);


x(q);


continue;


}


if(line.startsWith("cx(")){


let p=
line.slice(3,-1)
.split(",");


cx(
p[0].trim(),
p[1].trim()
);


continue;


}


if(line.startsWith("measure(")){


let q=
line.slice(8,-1);


print(
q+
" = "+
measure(q)
);


continue;


}


if(line.startsWith("print(")){


let t=
line.slice(6,-1)
.replace(/"/g,"");


print(t);


continue;


}


}


}


function clearOutput(){


consoleBox.innerText="> Cleared";


}


function saveCode(){


let blob=
new Blob(
[editor.value],
{type:"text/plain"}
);


let a=
document.createElement("a");


a.href=
URL.createObjectURL(blob);


a.download=
"novalang.txt";


a.click();


}


function toggleTheme(){


document.body
.classList
.toggle("light");


}


function toggleMode(){


devMode=!devMode;


modeText.innerText=
devMode?
"Developer":
"Beginner";


document
.getElementById("beginnerHelp")
.classList
.toggle("hidden",devMode);


document
.getElementById("devTools")
.classList
.toggle("hidden",!devMode);


}


function loadBell(){


editor.value=
`q0 = qubit()
q1 = qubit()


h(q0)
cx(q0,q1)


measure(q0)
measure(q1)


print("Bell done")`;


}


function loadGrover(){


editor.value=
`q0 = qubit()
q1 = qubit()


h(q0)
h(q1)


cx(q0,q1)


measure(q0)
measure(q1)


print("Grover done")`;


}


function loadSuper(){


editor.value=
`q = qubit()


h(q)


measure(q)


print("Superposition")`;


}


editor.value=
`q = qubit()


h(q)


measure(q)


print("Hello Quantum")`;


runCode();
