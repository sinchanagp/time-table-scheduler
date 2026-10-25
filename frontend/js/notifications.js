// ======================================================
// NOTIFICATION ELEMENTS
// ======================================================

const enableButton =
    document.getElementById("enableNotifications");

const testButton =
    document.getElementById("testNotification");

const notificationList =
    document.getElementById("notificationList");

const notificationCount =
    document.getElementById("notificationCount");

const todayDate =
    document.getElementById("todayDate");


// ======================================================
// DISPLAY TODAY'S DATE
// ======================================================

const today = new Date();

todayDate.innerText =
    today.toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );


// ======================================================
// CHECK BROWSER SUPPORT
// ======================================================

function notificationSupported() {

    return "Notification" in window;

}


// ======================================================
// REQUEST PERMISSION
// ======================================================

async function requestNotificationPermission() {

    if (!notificationSupported()) {

        alert(
            "Your browser does not support notifications."
        );

        return false;

    }


    if (Notification.permission === "granted") {

        return true;

    }


    if (Notification.permission === "denied") {

        alert(
            "Notifications are blocked in your browser. " +
            "Please enable them from browser settings."
        );

        return false;

    }


    const permission =
        await Notification.requestPermission();


    if (permission === "granted") {

        alert(
            "Notifications enabled successfully!"
        );

        updatePermissionButton();

        return true;

    }


    return false;

}


// ======================================================
// UPDATE PERMISSION BUTTON
// ======================================================

function updatePermissionButton() {

    if (!notificationSupported()) {

        enableButton.innerText =
            "Not Supported";

        enableButton.disabled = true;

        return;

    }


    if (Notification.permission === "granted") {

        enableButton.innerText =
            "✓ Notifications Enabled";

        enableButton.disabled = true;

    }

    else {

        enableButton.innerText =
            "Enable Notifications";

        enableButton.disabled = false;

    }

}


// ======================================================
// ENABLE BUTTON
// ======================================================

enableButton.addEventListener(
    "click",
    async () => {

        await requestNotificationPermission();

    }
);


// ======================================================
// SHOW TEST NOTIFICATION
// ======================================================

function showTestNotification() {

    if (!notificationSupported()) {

        alert(
            "Your browser does not support notifications."
        );

        return;

    }


    if (Notification.permission !== "granted") {

        alert(
            "Please click 'Enable Notifications' first."
        );

        return;

    }


    new Notification(
        "🔔 Time Table Reminder",
        {

            body:
                "Your DBMS class starts in 10 minutes!\n" +
                "Room: NG-05",

            icon:
                "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"

        }
    );

}


testButton.addEventListener(
    "click",
    showTestNotification
);


// ======================================================
// LOAD TIMETABLE
// ======================================================

async function loadTimetable() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/timetable"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load timetable"
            );

        }


        const data =
            await response.json();


        displayNotifications(data);


    }

    catch (error) {

        console.error(
            "Notification loading error:",
            error
        );


        notificationList.innerHTML = `

            <div class="empty-message">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <p>
                    Unable to load timetable.
                    Make sure the backend server is running.
                </p>

            </div>

        `;

    }

}


// ======================================================
// DISPLAY TODAY'S CLASSES
// ======================================================

function displayNotifications(data) {

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];


    const currentDay =
        days[new Date().getDay()];


    // Get today's classes

    const todayClasses =
        data.filter(
            item =>
                item.day === currentDay
        );


    // Update count

    notificationCount.innerText =
        todayClasses.length;


    // No classes

    if (todayClasses.length === 0) {

        notificationList.innerHTML = `

            <div class="empty-message">

                <i class="fa-solid fa-calendar-check"></i>

                <p>
                    No classes scheduled for today.
                </p>

            </div>

        `;

        return;

    }


    // Sort by start time

    todayClasses.sort(
        (a, b) =>
            a.startTime.localeCompare(
                b.startTime
            )
    );


    notificationList.innerHTML = "";


    todayClasses.forEach(item => {

        const notification =
            document.createElement("div");


        notification.className =
            "notification-item";


        notification.innerHTML = `

            <div class="icon">

                <i class="fa-solid fa-book"></i>

            </div>


            <div class="notification-details">

                <h3>
                    ${item.subject}
                </h3>

                <p>
                    Faculty: ${item.faculty}
                </p>

                <p>
                    Room: ${item.room}
                </p>

            </div>


            <div class="notification-time">

                ${formatTime(item.startTime)}

                <br>

                <small>
                    to
                    ${formatTime(item.endTime)}
                </small>

            </div>

        `;


        notificationList.appendChild(
            notification
        );

    });

}


// ======================================================
// FORMAT TIME
// ======================================================

function formatTime(time) {

    const parts =
        time.split(":");


    let hour =
        parseInt(parts[0]);


    const minutes =
        parts[1];


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    if (hour === 0) {

        hour = 12;

    }

    else if (hour > 12) {

        hour -= 12;

    }


    return `${hour}:${minutes} ${period}`;

}


// ======================================================
// INITIALIZE
// ======================================================

updatePermissionButton();

loadTimetable();