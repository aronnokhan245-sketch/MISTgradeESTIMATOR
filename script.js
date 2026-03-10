let selectedCredit = 3;

function setCredit(val) {
    selectedCredit = val;
    document.getElementById('btn2').classList.toggle('active', val === 2);
    document.getElementById('btn3').classList.toggle('active', val === 3);

    const midLabel = document.getElementById('midLabel');
    const attLabel = document.getElementById('attLabel');
    const perfLabel = document.getElementById('perfLabel');

    if (val === 2) {
        midLabel.innerText = "MID TERM (Max 20)";
        attLabel.innerText = "ATTENDANCE (Max 10)";
        perfLabel.innerText = "CLASS PERF. (Max 10)";
    } else {
        midLabel.innerText = "MID TERM (Max 30)";
        attLabel.innerText = "ATTENDANCE (Max 15)";
        perfLabel.innerText = "CLASS PERF. (Max 15)";
    }
}

function calculate() {
    const resDiv = document.getElementById('displayResult');
    const ctString = document.getElementById('ctMarks').value;
    const ctArray = ctString.split(' ').map(Number).filter(n => !isNaN(n));
    
    if (ctArray.length < 2) {
        alert("Please enter at least 2 CT marks");
        return;
    }

    const mid = parseFloat(document.getElementById('midterm').value) || 0;
    const att = parseFloat(document.getElementById('attendance').value) || 0;
    const perf = parseFloat(document.getElementById('performance').value) || 0;
    const target = parseFloat(document.getElementById('targetPerc').value) || 80;

    // Logic for Invalid Input (Max limits)
    let maxMid = (selectedCredit === 2) ? 20 : 30;
    let maxAttPerf = (selectedCredit === 2) ? 10 : 15;

    if (mid > maxMid || att > maxAttPerf || perf > maxAttPerf) {
        resDiv.innerHTML = "❌ Error: Marks exceed maximum limit!";
        resDiv.style.color = "#ff4d4d";
        return;
    }
    
    resDiv.style.color = "#D4AF37"; // Reset color if valid

    ctArray.sort((a, b) => b - a);
    const bestTwoAvg = (ctArray[0] + ctArray[1]) / 2.0;

    let midP = (selectedCredit === 2) ? (mid / 20) * 10 : (mid / 30) * 10;
    let attP = (selectedCredit === 2) ? (att / 10) * 5 : (att / 15) * 5;
    let perfP = (selectedCredit === 2) ? (perf / 10) * 5 : (perf / 15) * 5;

    let currentTotal = bestTwoAvg + midP + attP + perfP;
    let needed = target - currentTotal;
    let maxFinal = (selectedCredit === 2) ? 120 : 180;
    let finalMark = (needed / 60) * maxFinal;

    if (finalMark > maxFinal) {
        resDiv.innerHTML = "Status: Impossible!";
    } else {
        resDiv.innerHTML = `Need: ${Math.max(0, finalMark).toFixed(2)} / ${maxFinal}`;
    }
}