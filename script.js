let selectedCredit = 3;

// Tab Switching
function switchTab(tab) {
    document.getElementById('mark-section').style.display = (tab === 'mark') ? 'block' : 'none';
    document.getElementById('cgpa-section').style.display = (tab === 'cgpa') ? 'block' : 'none';
    document.getElementById('tab-mark').classList.toggle('active', tab === 'mark');
    document.getElementById('tab-cgpa').classList.toggle('active', tab === 'cgpa');
    resetForm();
}

// CGPA Logic
function addRow() {
    const container = document.getElementById('course-rows');
    const div = document.createElement('div');
    div.className = 'course-row';
    div.innerHTML = `
        <input type="number" step="0.01" class="c-credit" placeholder="Credit (0.75-3)">
        <input type="number" step="0.01" class="c-gp" placeholder="GP (e.g. 4.00)">
    `;
    container.appendChild(div);
}

function calculateCGPA() {
    const credits = document.getElementsByClassName('c-credit');
    const gps = document.getElementsByClassName('c-gp');
    let totalPoints = 0, totalCredits = 0;

    for (let i = 0; i < credits.length; i++) {
        const c = parseFloat(credits[i].value);
        const g = parseFloat(gps[i].value);
        if (!isNaN(c) && !isNaN(g)) {
            totalPoints += (c * g);
            totalCredits += c;
        }
    }

    if (totalCredits === 0) return alert("Enter credit and GP first!");
    
    showResult(`ESTIMATED GPA: ${(totalPoints / totalCredits).toFixed(2)}`);
}

// Mark Estimator Logic
function setCredit(val) {
    selectedCredit = val;
    document.getElementById('btn2').className = (val === 2) ? 'active' : '';
    document.getElementById('btn3').className = (val === 3) ? 'active' : '';
    document.getElementById('midLabel').innerText = `MID TERM (Max ${val === 2 ? 20 : 30})`;
    document.getElementById('attLabel').innerText = `ATTENDANCE (Max ${val === 2 ? 10 : 15})`;
    document.getElementById('perfLabel').innerText = `CLASS PERF. (Max ${val === 2 ? 10 : 15})`;
}

function calculateMark() {
    const c1 = parseFloat(document.getElementById('ct1').value);
    const c2 = parseFloat(document.getElementById('ct2').value);
    const c3 = parseFloat(document.getElementById('ct3').value);
    let ctArray = [c1, c2, c3].filter(n => !isNaN(n)).sort((a,b) => b-a);

    if (ctArray.length < 2) return alert("Enter at least 2 CT marks");

    const mid = parseFloat(document.getElementById('midterm').value) || 0;
    const att = parseFloat(document.getElementById('attendance').value) || 0;
    const perf = parseFloat(document.getElementById('performance').value) || 0;
    const target = parseFloat(document.getElementById('targetGPA').value);

    let currentTotal = ((ctArray[0] + ctArray[1]) / 2) + 
                       (mid / (selectedCredit === 2 ? 2 : 3)) + 
                       (att / (selectedCredit === 2 ? 2 : 3)) + 
                       (perf / (selectedCredit === 2 ? 2 : 3));

    let maxFinal = (selectedCredit === 2) ? 120 : 180;
    let finalNeeded = ((target - currentTotal) / 60) * maxFinal;

    if (finalNeeded > maxFinal) showResult("Target Unreachable!", true);
    else showResult(`NEED: ${Math.max(0, finalNeeded).toFixed(2)} / ${maxFinal}`);
}

function showResult(msg, isError = false) {
    const resBox = document.getElementById('resultBox');
    const resDiv = document.getElementById('displayResult');
    resBox.style.display = "block";
    resDiv.innerHTML = msg;
    resDiv.style.color = isError ? "#ff4d4d" : "#D4AF37";
}

function resetForm() {
    document.getElementById('resultBox').style.display = "none";
    const inputs = document.querySelectorAll('input');
    inputs.forEach(i => i.value = '');
}
