// ======================================================
// ELEMENTS
// ======================================================

const form = document.getElementById("timetableForm");
const popup = document.getElementById("popup");
const openPopup = document.getElementById("openPopup");
const closePopup = document.getElementById("closePopup");


// ======================================================
// OPEN POPUP - ADD CLASS
// ======================================================

openPopup.addEventListener("click", () => {

    // Clear edit mode
    delete form.dataset.editId;

    // Reset form
    form.reset();

    // Change title
    popup.querySelector("h2").innerText = "Add New Class";

    // Change button
    form.querySelector("button[type='submit']").innerText =
        "Save Class";

    // Show popup
    popup.style.display = "flex";

});


// ======================================================
// CLOSE POPUP
// ======================================================

closePopup.addEventListener("click", () => {

    popup.style.display = "none";

});


// Close when clicking outside popup

window.addEventListener("click", (event) => {

    if (event.target === popup) {

        popup.style.display = "none";

    }

});


// ======================================================
// ADD / UPDATE CLASS
// ======================================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();


    // Get logged-in user

    const user =
        JSON.parse(localStorage.getItem("user"));


    if (!user) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }


    // Get form values

    const timetable = {

        userId: user.id,

        day: document.getElementById("day").value,

        subject: document.getElementById("subject").value.trim(),

        faculty: document.getElementById("faculty").value.trim(),

        room: document.getElementById("room").value.trim(),

        startTime: document.getElementById("startTime").value,

        endTime: document.getElementById("endTime").value

    };


    // Check all fields

    if (
        !timetable.day ||
        !timetable.subject ||
        !timetable.faculty ||
        !timetable.room ||
        !timetable.startTime ||
        !timetable.endTime
    ) {

        alert("Please fill all fields.");

        return;

    }


    // Check time

    if (timetable.startTime >= timetable.endTime) {

        alert("End time must be after start time.");

        return;

    }


    // Check whether editing

    const editId = form.dataset.editId;


    try {

        let response;


        // ==================================================
        // UPDATE EXISTING CLASS
        // ==================================================

        if (editId) {

            response = await fetch(
                `http://localhost:5000/api/timetable/${editId}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(timetable)

                }
            );

        }


        // ==================================================
        // ADD NEW CLASS
        // ==================================================

        else {

            response = await fetch(
                "http://localhost:5000/api/timetable/add",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(timetable)

                }
            );

        }


        // Get backend response

        const data = await response.json();


        console.log("Backend response:", data);


        // Check response

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to save class."
            );

            return;

        }


        // Success

        alert(
            data.message ||
            "Class saved successfully."
        );


        // Reset form

        form.reset();


        // Remove edit mode

        delete form.dataset.editId;


        // Reset popup title

        popup.querySelector("h2").innerText =
            "Add New Class";


        // Reset button text

        form.querySelector(
            "button[type='submit']"
        ).innerText = "Save Class";


        // Close popup

        popup.style.display = "none";


        // Reload timetable

        loadTimetable();


    } catch (error) {

        console.error(
            "Add/Update error:",
            error
        );

        alert(
            "Cannot connect to backend. " +
            "Make sure the server is running."
        );

    }

});


// ======================================================
// LOAD TIMETABLE
// DAYS = ROWS
// TIME = COLUMNS
// ======================================================

async function loadTimetable() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/timetable"
        );


        const data = await response.json();


        console.log(
            "Timetable data:",
            data
        );


        if (!response.ok) {

            console.error(data);

            return;

        }


        const table =
            document.getElementById(
                "timetableTable"
            );


        const rows =
            table.querySelectorAll(
                "tbody tr"
            );


        // ==================================================
        // DAY ROWS
        // ==================================================

        const dayRows = {

            Monday: 0,

            Tuesday: 1,

            Wednesday: 2,

            Thursday: 3,

            Friday: 4,

            Saturday: 5

        };


        // ==================================================
        // TIME COLUMNS
        // ==================================================

        const timeColumns = {

            "08:00-09:00": 1,

            "09:00-10:00": 2,

            "10:00-10:30": 3,

            "10:30-11:30": 4,

            "11:30-12:30": 5,

            "12:30-13:30": 6,

            "13:30-14:30": 7,

            "14:30-15:30": 8,

            "15:30-16:30": 9

        };


        // ==================================================
        // CLEAR EXISTING CELLS
        // ==================================================

        rows.forEach((row) => {

            for (
                let i = 1;
                i < row.children.length;
                i++
            ) {

                row.children[i].innerHTML = "";

            }

        });


        // ==================================================
        // DISPLAY EACH CLASS
        // ==================================================

        data.forEach((item) => {


            const rowIndex =
                dayRows[item.day];


            if (rowIndex === undefined) {

                console.warn(
                    "Unknown day:",
                    item.day
                );

                return;

            }


            const timeKey =
                `${item.startTime}-${item.endTime}`;


            const columnIndex =
                timeColumns[timeKey];


            if (columnIndex === undefined) {

                console.warn(
                    "Unknown time slot:",
                    timeKey
                );

                return;

            }


            const cell =
                rows[rowIndex]
                    .children[columnIndex];


            if (!cell) {

                return;

            }


            cell.innerHTML = `

                <div class="class-card">

                    <strong>
                        ${item.subject}
                    </strong>

                    <small>
                        ${item.faculty}
                    </small>

                    <small>
                        ${item.room}
                    </small>


                    <div class="class-actions">

                        <button
                            type="button"
                            onclick="editClass('${item._id}')">
                            ✏️
                        </button>


                        <button
                            type="button"
                            onclick="deleteClass('${item._id}')">
                            🗑️
                        </button>

                    </div>

                </div>

            `;

        });


    } catch (error) {

        console.error(
            "Load timetable error:",
            error
        );

    }

}


// ======================================================
// EDIT CLASS
// ======================================================

async function editClass(id) {

    try {

        // Get all classes

        const response = await fetch(
            "http://localhost:5000/api/timetable"
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                "Unable to load class."
            );

            return;

        }


        // Find selected class

        const item =
            data.find(
                timetable =>
                    timetable._id === id
            );


        if (!item) {

            alert("Class not found.");

            return;

        }


        // Put values into form

        document.getElementById("day").value =
            item.day;

        document.getElementById("subject").value =
            item.subject;

        document.getElementById("faculty").value =
            item.faculty;

        document.getElementById("room").value =
            item.room;

        document.getElementById("startTime").value =
            item.startTime;

        document.getElementById("endTime").value =
            item.endTime;


        // Store ID

        form.dataset.editId = id;


        // Change popup title

        popup.querySelector("h2").innerText =
            "Edit Class";


        // Change button

        form.querySelector(
            "button[type='submit']"
        ).innerText = "Update Class";


        // Open popup

        popup.style.display = "flex";


    } catch (error) {

        console.error(
            "Edit error:",
            error
        );

        alert(
            "Unable to load class."
        );

    }

}


// ======================================================
// DELETE CLASS
// ======================================================

async function deleteClass(id) {

    if (
        !confirm(
            "Are you sure you want to delete this class?"
        )
    ) {

        return;

    }


    try {

        const response = await fetch(
            `http://localhost:5000/api/timetable/${id}`,
            {

                method: "DELETE"

            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Delete failed."
            );

            return;

        }


        alert(
            data.message ||
            "Class deleted successfully."
        );


        // Refresh table

        loadTimetable();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Unable to delete class."
        );

    }

}


// ======================================================
// LOAD TIMETABLE WHEN PAGE OPENS
// ======================================================

loadTimetable();