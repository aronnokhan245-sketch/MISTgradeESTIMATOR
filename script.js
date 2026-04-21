let selectedCredit = 3;
const inputs = ['ct1', 'ct2', 'ct3', 'midterm', 'attendance', 'performance', 'targetGPA'];

// Tab Switching Logic
function switchTab(tab) {
    const markSection = document.getElementById('mark-section');
    const cgpaSection = document.getElementById('cgpa-section');
    const tabMark = document.getElementById('tab-mark');
    const tabCgpa = document.getElementById('tab-cgpa');

    if (tab === 'mark') {
        markSection.style.display = 'block';
        cgpaSection.style.display = 'none';
        tabMark.classList.add('active');
        tabCgpa.classList.remove('active');
    } else {
        markSection.style.display = 'none';
        cgpaSection.style.display = 'block';
        tabCgpa.classList.add('active');
        tabMark.classList.remove('active');
    }
    resetForm();
}

// Add Course Row for CGPA
function addRow() {
    const container = document.getElementById('course-rows');
    const div = document.createElement('div');
    div.className = 'course-row';
    div.innerHTML = `
        <input type="number" step="0.01" class="c-credit" placeholder="Credit (e.g. 3.0)">
        <input type="number" step="0.01" class="c-gp" placeholder="GP (e.g. 3.75)">
    `;
    container.appendChild(div);
}

// CGPA Calculation Logic
function calculateCGPA() {
    const credits = document.getElementsByClassName('c-credit');
    const gps = document.getElementsByClassName('c-gp');
    const resDiv = document.getElementById('displayResult');
    const resBox = document.getElementById('resultBox');

    let totalPoints = 0;
    let totalCredits = 0;

    for (let i = 0; i < credits.length; i++) {
        const c = parseFloat(credits[i].value);
        const g = parseFloat(gps[i].value);

        if (!isNaN(c) && !isNaN(g)) {
            totalPoints += (c * g);
            totalCredits += c;
        }
    }

    if (totalCredits === 0) {
        alert("Please enter credit hours and grade points.");
        return;
    }

    const finalCGPA = (totalPoints / totalCredits).toFixed(2);
    resBox.style.display = "block";
    resDiv.style.color = "#D4AF37";
    resDiv.innerHTML = `ESTIMATED GPA: ${finalCGPA}`;
}

// --- Your Original Functions (Mark Estimator) ---

function setCredit(val) {
    selectedCredit = val;
    document.getElementById('btn2').classList.toggle('active', val === 2);
    document.getElementById('btn3').classList.toggle('active', val === 3);
    
    const labels = {
        mid: document.getElementById('midLabel'),
        att: document.getElementById('attLabel'),
        perf: document.getElementById('perfLabel')
    };

    if (val === 2) {
        labels.mid.innerText = "MID TERM (Max 20)";
        labels.att.innerText = "ATTENDANCE (Max 10)";
        labels.perf.innerText = "CLASS PERF. (Max 10)";
    } else {
        labels.mid.innerText = "MID TERM (Max 30)";
        labels.att.innerText = "ATTENDANCE (Max 15)";
        labels.perf.innerText = "CLASS PERF. (Max 15)";
    }
}

function calculate() {
    const resDiv = document.getElementById('displayResult');
    const resBox = document.getElementById('resultBox');
    
    const c1 = parseFloat(document.getElementById('ct1').value);
    const c2 = parseFloat(document.getElementById('ct2').value);
    const c3 = parseFloat(document.getElementById('ct3').value);
    
    let ctArray = [c1, c2, c3].filter(num => !isNaN(num));
    
    if (ctArray.length < 2) {
        alert("Please enter at least 2 CT marks");
        return;
    }

    const mid = parseFloat(document.getElementById('midterm').value) || 0;
    const att = parseFloat(document.getElementById('attendance').value) || 0;
    const perf = parseFloat(document.getElementById('performance').value) || 0;
    const target = parseFloat(document.getElementById('targetGPA').value);

    let maxMid = (selectedCredit === 2) ? 20 : 30;
    let maxAttPerf = (selectedCredit === 2) ? 10 : 15;

    if (mid > maxMid || att > maxAttPerf || perf > maxAttPerf || ctArray.some(m => m > 20)) {
        resBox.style.display = "block";
        resDiv.innerHTML = "❌ Marks exceed limit!";
        resDiv.style.color = "#ff4d4d";
        return;
    }
    
    resDiv.style.color = "#D4AF37"; 
    resBox.style.display = "block";

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
        resDiv.innerHTML = "STATUS: Target GPA Unreachable!";
    } else {
        const result = Math.max(0, finalMark).toFixed(2);
        resDiv.innerHTML = `NEED: ${result} / ${maxFinal}`;
    }
}

function resetForm() {
    // Clear mark inputs
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = (id === 'targetGPA') ? '80' : '';
    });
    // Reset CGPA rows
    document.getElementById('course-rows').innerHTML = `
        <div class="course-row">
            <input type="number" step="0.01" class="c-credit" placeholder="Credit (e.g. 3.0)">
            <input type="number" step="0.01" class="c-gp" placeholder="GP (e.g. 3.75)">
        </div>
    `;
    document.getElementById('resultBox').style.display = 'none';
    document.getElementById('progBar').style.display = 'none';
}
