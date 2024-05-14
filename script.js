let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let basePrice = 0;
let selectedDay = null;
let selectedTime = null;

// Month names array for displaying the current month
const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];


document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const appointmentSection = document.getElementById('appointmentSection');
    let selectedTime = null; // To keep track of the currently selected time
    let basePrice = 0;

    function openBookingForm(styleName, price, addons) {
    appointmentSection.style.display = 'none';
    bookingForm.style.display = 'block';
    basePrice = price;

    let styleInfoHTML = `<h3>Selected Style: ${styleName}</h3>
                         <label>Quantity: <input type="number" id="styleQuantity" value="1" min="1" style="width: 50px;"></label>
                         <p id="basePrice">Base Price: $${basePrice}</p>
                         <p>Total Price: $<span id="totalPrice">${basePrice}</span></p>`;
    document.getElementById('selectedStyle').innerHTML = styleInfoHTML;

    let additionsHTML = '<h4>Add-ons:</h4>';
    addons.forEach(function(addition) {
        let [additionName, additionPrice] = addition.split(' $');
        additionsHTML += `<label>${additionName} - $${additionPrice}
                          <input type="number" name="additionsQuantity" value="0" min="0" style="width: 50px;" data-price="${additionPrice}"></label><br>`;
    });
    document.getElementById('additionalStyles').innerHTML = additionsHTML;

    attachEventListeners();
    generateCalendar(currentMonth, currentYear); // Call to generate calendar
    generateTimeSlots(); // Call to generate time slots
}


    function attachEventListeners() {
        document.getElementById('styleQuantity').addEventListener('change', updateTotalPrice);
        document.querySelectorAll('[name="additionsQuantity"]').forEach(input => {
            input.addEventListener('change', updateTotalPrice);
        });
    }

    function updateTotalPrice() {
        let styleQuantity = parseInt(document.getElementById('styleQuantity').value) || 1;
        let totalCost = basePrice * styleQuantity;

        document.querySelectorAll('[name="additionsQuantity"]').forEach(input => {
            let additionPrice = parseFloat(input.dataset.price);
            let additionQuantity = parseInt(input.value) || 0;
            totalCost += additionPrice * additionQuantity;
        });

        document.getElementById('totalPrice').textContent = totalCost;
        console.log('Total Price Updated:', totalCost); // Debugging output
    }

    window.openBookingForm = openBookingForm; // Expose function globally if needed
});



function generateCalendar(month, year) {
    const calendarDiv = document.getElementById('calendar');
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Begin table for calendar
    let htmlContent = `<table><tr><th><button onclick="navigateCalendar(-1)">&#8592;</button></th>`;
    htmlContent += `<th colspan="5">${monthNames[month]} ${year}</th>`;
    htmlContent += `<th><button onclick="navigateCalendar(1)">&#8594;</button></th></tr>`;
    htmlContent += `<tr>${daysOfWeek.map(day => `<th>${day}</th>`).join('')}</tr><tr>`;

    // Fill the first row of the calendar with empty cells if needed
    for (let i = 0; i < firstDayOfMonth; i++) {
        htmlContent += "<td></td>";
    }

    // Fill the calendar days
    for (let day = 1; day <= daysInMonth; day++) {
        if ((day + firstDayOfMonth - 1) % 7 === 0 && day > 1) {
            htmlContent += "</tr><tr>";  // Start a new row at the start of each week
        }
        htmlContent += `<td class="calendar-day" onclick="selectDay(${day})">${day}</td>`;
    }

    // Fill the remaining cells in the last week
    let remainingCells = (7 - ((daysInMonth + firstDayOfMonth - 1) % 7 + 1)) % 7;
    for (let i = 0; i < remainingCells; i++) {
        htmlContent += "<td></td>";
    }

    htmlContent += "</tr></table>";
    calendarDiv.innerHTML = htmlContent;
}



function generateTimeSlots() {
    const timeSlotsDiv = document.getElementById('timeSlots');
    const morningHours = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'];
    const afternoonHours = ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
    let htmlContent = "<div class='time-row'>";

    morningHours.forEach(hour => {
        htmlContent += `<div class="time-slot" onclick="selectTime('${hour}')">${hour}</div>`;
    });
    htmlContent += "</div><div class='time-row'>";
    
    afternoonHours.forEach(hour => {
        htmlContent += `<div class="time-slot" onclick="selectTime('${hour}')">${hour}</div>`;
    });
    htmlContent += "</div>";

    timeSlotsDiv.innerHTML = htmlContent;
}


function selectDay(day) {
    if (selectedDay) {
        selectedDay.classList.remove('selected');
        selectedDay.style.fontWeight = 'normal';  // Remove bold font style
        selectedDay.style.backgroundColor = '';   // Reset background color
    }
    selectedDay = document.querySelector(`td[onclick='selectDay(${day})']`);
    selectedDay.classList.add('selected');
    selectedDay.style.fontWeight = 'bold';        // Make text bold
    selectedDay.style.backgroundColor = 'yellow'; // Change background color
}


function selectTime(time) {
    if (selectedTime) {
        selectedTime.classList.remove('selected-time');
        selectedTime.style.fontWeight = 'normal';  // Remove bold font style
        selectedTime.style.color = '';             // Reset text color
        hideDropdownMenu();                        // Hide any existing dropdown menu
    }
    selectedTime = document.querySelector(`div[onclick="selectTime('${time}')"]`);
    selectedTime.classList.add('selected-time');
    selectedTime.style.fontWeight = 'bold';       // Make text bold
    selectedTime.style.color = 'red';             // Change text color to red

    showDropdownMenu(selectedTime);               // Show dropdown menu near the selected time
}

function hideDropdownMenu() {
    const dropdown = document.getElementById('timeDropdown');
    dropdown.style.display = 'none';
}

function showDropdownMenu(target) {
    const dropdown = document.getElementById('timeDropdown');
    dropdown.style.display = 'block';             // Display the dropdown menu
    dropdown.style.position = 'absolute';
    dropdown.style.left = `${target.offsetLeft}px`;  // Position dropdown near the time
    dropdown.style.top = `${target.offsetTop + target.offsetHeight}px`;
}

function handleDropdownSelection(action) {
    if (action === 'confirm') {
        showUserInformation();
        hideDropdownMenu();
    } else if (action === 'add') {
        hideDropdownMenu();  // Allow user to select another time
    }
}


function updateTotalPrice() {
    let additionalCosts = Array.from(document.querySelectorAll('input[name="additions"]:checked'))
                               .map(checkbox => parseFloat(checkbox.value));
    let totalCost = additionalCosts.reduce((sum, value) => sum + value, basePrice);
    document.getElementById('totalPrice').textContent = totalCost;
}



function navigateCalendar(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear -= 1;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear += 1;
    }
    generateCalendar(currentMonth, currentYear);
    // Resetting selectedDay when the month changes
    selectedDay = null;
}


function confirmBooking() {
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    alert(`Thank you, ${name}. Your booking for ${selectedDay.textContent} ${monthNames[currentMonth]} at ${selectedTime.textContent} has been sent to ${email}.`);
    // Typically, send booking data to the server here
}



function goBackToBookingForm() {
            document.getElementById('yourInformationSection').style.display = 'none';
            document.getElementById('bookingForm').style.display = 'block';
        }

        function openInformationSection() {
            document.getElementById('bookingForm').style.display = 'none';
            document.getElementById('yourInformationSection').style.display = 'block';
        }

      


   document.addEventListener('DOMContentLoaded', function() {
    const confirmButton = document.getElementById('confirmButton');
    const reviewForm = document.createElement('form');
    const container = document.querySelector('.container');

    // Setup the review form structure
    reviewForm.id = 'reviewForm';
    reviewForm.innerHTML = `
        <h2>Review Your Appointment Details</h2>
        <div id="reviewDetails"></div>
        <button type="submit">Submit Appointment</button>
    `;
    container.appendChild(reviewForm);
    reviewForm.style.display = 'none'; // Initially hide the review form

    confirmButton.addEventListener('click', function() {
        const firstName = document.querySelector('#userInformation input[type="text"][placeholder="First Name"]').value;
        const lastName = document.querySelector('#userInformation input[type="text"][placeholder="Last Name"]').value;
        const phoneNumber = document.querySelector('#userInformation input[type="tel"]').value;
        const email = document.querySelector('#userInformation input[type="email"]').value;

        const selectedStyleDetails = document.getElementById('selectedStyleDetails').value || 'Not specified';
        const selectedAddons = document.getElementById('selectedAddons').value || 'None';
        const selectedDate = document.getElementById('selectedDate').value || 'Not specified';
        const selectedTime = document.getElementById('selectedTime').value || 'Not specified';
        const totalPrice = document.getElementById('totalPriceDisplay').value || '$0';

        document.getElementById('reviewDetails').innerHTML = `
            <p>Name: ${firstName} ${lastName}</p>
            <p>Phone: ${phoneNumber}</p>
            <p>Email: ${email}</p>
            <p>Style: ${selectedStyleDetails}</p>
            <p>Add-ons: ${selectedAddons}</p>
            <p>Date: ${selectedDate}</p>
            <p>Time: ${selectedTime}</p>
            <p>Total Price: ${totalPrice}</p>
        `;

        reviewForm.style.display = 'block';
        document.getElementById('userInformation').style.display = 'none';
    });

    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Your appointment has been successfully submitted!');
    });
});






   
    // Function to show only the user information section
    function showUserInformation() {
        document.getElementById('bookingForm').style.display = 'none';
        document.getElementById('loginSignupModal').style.display = 'none';
        document.getElementById('userInformation').style.display = 'block'; // Show this section
        document.getElementById('confirmButton').style.display = 'block'; // Ensure the confirm button is also visible
    }

    // Function to show only the booking form
    function showBookingForm() {
        document.getElementById('userInformation').style.display = 'block';
        document.getElementById('loginSignupModal').style.display = 'none';
        document.getElementById('bookingForm').style.display = 'block'; // Show this section
    }

    // Function to show only the login/signup modal
    function showLoginSignupModal() {
        document.getElementById('userInformation').style.display = 'none';
        document.getElementById('bookingForm').style.display = 'none';
        document.getElementById('loginSignupModal').style.display = 'block'; // Show this section
    }

    // Attach the selectTime function to time slots in the calendar
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', () => selectTime(slot.textContent.trim()));
    });

   
