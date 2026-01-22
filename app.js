// Poop Tracker App

// Form data
const formData = {
    name: '',
    date: '',
    time: '',
    size: '',
    texture: '',
    note: ''
};

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzuD52ruTFTExqp8TA_4mS5_AXO7rmZK38VYQikOsdPHWxySrUwOD_P_k3Q1KuZgDNIdA/exec';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initName();
    initDateTime();
});

// Load cached name or show name input
function initName() {
    const cachedName = localStorage.getItem('poopTrackerName');
    const nameInput = document.getElementById('name-input');
    const nameNextBtn = document.getElementById('name-next-btn');
    
    if (cachedName) {
        nameInput.value = cachedName;
        formData.name = cachedName;
        nameNextBtn.disabled = false;
    } else {
        nameNextBtn.disabled = true;
    }
    
    // Enable/disable next button based on name input
    nameInput.addEventListener('input', () => {
        const hasName = nameInput.value.trim().length > 0;
        nameNextBtn.disabled = !hasName;
    });
}

// Save name to cache
function saveName() {
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value.trim();
    
    if (name) {
        localStorage.setItem('poopTrackerName', name);
        formData.name = name;
    }
}

// Set default date and time to now
function initDateTime() {
    const now = new Date();
    
    // Format date as YYYY-MM-DD
    const dateStr = now.toISOString().split('T')[0];
    document.getElementById('poop-date').value = dateStr;
    formData.date = dateStr;
    
    // Format time as HH:MM
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    document.getElementById('poop-time').value = timeStr;
    formData.time = timeStr;
}

// Handle option selection
function selectOption(button, field) {
    // Remove selected class from siblings
    const siblings = button.parentElement.querySelectorAll('.option-btn');
    siblings.forEach(btn => btn.classList.remove('selected'));
    
    // Add selected class to clicked button
    button.classList.add('selected');
    
    // Store value
    formData[field] = button.dataset.value;
    
    // Enable next button
    const step = button.closest('.step');
    const nextBtn = step.querySelector('.btn-next');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

// Navigate to next step
function nextStep(currentStep) {
    // Save name if on step 1
    if (currentStep === 1) {
        saveName();
    }
    
    // Save date/time if on step 2
    if (currentStep === 2) {
        formData.date = document.getElementById('poop-date').value;
        formData.time = document.getElementById('poop-time').value;
    }
    
    // Hide current step
    document.querySelector(`.step-${currentStep}`).classList.remove('active');
    
    // Show next step
    const nextStepNum = currentStep + 1;
    const nextStepEl = document.querySelector(`.step-${nextStepNum}`);
    nextStepEl.classList.add('active');
    
    // If going to step 5, update summary
    if (nextStepNum === 5) {
        updateSummary();
    }
}

// Update summary display
function updateSummary() {
    const summaryEl = document.getElementById('summary');
    
    // Format date nicely
    const dateObj = new Date(formData.date + 'T' + formData.time);
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: '2-digit' };
    const formattedDate = dateObj.toLocaleDateString('en-US', dateOptions);
    const formattedTime = dateObj.toLocaleTimeString('en-US', timeOptions);
    
    // Capitalize first letter
    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
    
    summaryEl.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">Logged by</span>
            <span class="summary-value">${formData.name}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">When</span>
            <span class="summary-value">${formattedDate}, ${formattedTime}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Size</span>
            <span class="summary-value">${capitalize(formData.size)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Texture</span>
            <span class="summary-value">${capitalize(formData.texture)}</span>
        </div>
    `;
}

// Toggle note section
function toggleNote() {
    const noteSection = document.getElementById('note-section');
    const toggleBtn = document.getElementById('note-toggle-btn');
    
    if (noteSection.style.display === 'none') {
        noteSection.style.display = 'block';
        toggleBtn.textContent = 'Remove note';
        document.getElementById('note-input').focus();
    } else {
        noteSection.style.display = 'none';
        toggleBtn.textContent = 'Add a note';
        document.getElementById('note-input').value = '';
        formData.note = '';
    }
}

// Submit form
async function submitForm() {
    // Get note if any
    formData.note = document.getElementById('note-input').value.trim();
    
    // Get submit button and show loading
    const submitBtn = document.querySelector('.step-5 .btn-primary');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        // Send to Google Sheets
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // Show success
        document.querySelector('.step-5').classList.remove('active');
        document.querySelector('.step-success').classList.add('active');
        
    } catch (error) {
        console.error('Error submitting:', error);
        alert('Something went wrong. Please try again.');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Reset form for new entry
function resetForm() {
    // Reset form data (keep name cached)
    formData.size = '';
    formData.texture = '';
    formData.note = '';
    
    // Reset UI
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reset next buttons (keep step 1 enabled since name is cached)
    const nextBtns = document.querySelectorAll('.btn-next');
    nextBtns.forEach((btn, index) => {
        if (index > 1) btn.disabled = true;
    });
    
    document.getElementById('note-section').style.display = 'none';
    document.getElementById('note-toggle-btn').textContent = 'Add a note';
    document.getElementById('note-input').value = '';
    
    // Hide success, show step 1
    document.querySelector('.step-success').classList.remove('active');
    document.querySelector('.step-1').classList.add('active');
    
    // Reset date/time to now
    initDateTime();
}
