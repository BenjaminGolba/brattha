/**
 * INSTRUCTIONS
 *
 * Copy the contents into this file into devtools > Sources > Snippets.
 *
 * 0. Define ASSIGNMENT_ID and TIME_TYPE_ID below
 *
 * 1. Go to the time reporting site
 * 2. Select the calendar view "Månad"
 * 3. Press "Välj flera"
 * 4. Select the dates you want to time report
 * 5. When all desired dates are selected, press Ny tidrapport
 *   -> Modal should open
 * 6. Run the script (ctrl + enter)
 *   -> Refresh the page and dates should be populated
 *
 * 7. Now adjust the dates that deviate from the "standard" time manually
 */

const DEFAULT_START_HOUR = "08:00";
const DEFAULT_END_HOUR = "16:00";

/**
 * To find these two, go to the calendar view, open devtools and
 * look for the data-fields below and insert them into the const.
 * Example: const ASSIGMENT_ID = "123123-123123-123123-123123";
 *
 * data-assignmentid
 * data-timetypeid
 */
const ASSIGNMENT_ID = "<AssignmentId>";
const TIME_TYPE_ID = "<TimeTypeId>";

const CURRENT_YEAR = "2024";

const formatDate = (year, month, day, time) => {
  const dayWithLeadingZero = day.length === 1 ? "0" + day : day;
  const timeStr = !!time ? " " + time : "";

  return year + "-" + month + "-" + dayWithLeadingZero + timeStr;
};

const postTidRapport = () => {
  const findDates = () => {
    const rows = document.querySelectorAll("tr[data-index]");

    const filteredRows = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (row.classList.value === "center-text display-row") {
        filteredRows.push(row);
      }
    }

    const foundDates = [];
    filteredRows.map((filteredRow) => {
      const tds = filteredRow.querySelectorAll("td");
      const dateTd = tds[1];
      const dateString = dateTd.firstElementChild.innerText.substr(4);

      foundDates.push(dateString);
    });

    const formattedDates = foundDates.map((foundDate) => {
      const [day, month] = foundDate.split("/");

      return formatDate(CURRENT_YEAR, month, day);
    });

    return formattedDates;
  };

  const foundDatesToReport = findDates();

  const selectedPeriods = [];
  foundDatesToReport.map((foundDate) => {
    selectedPeriods.push({
      Date: foundDate,
      StartTime: foundDate + " " + DEFAULT_START_HOUR,
      EndTime: foundDate + " " + DEFAULT_END_HOUR,
      Mode: "0",
      CommentsFromResource: "",
      CommentsTowardsCustomer: "",
    });
  });

  var data = {
    AssignmentId: ASSIGNMENT_ID,
    TimeTypeId: TIME_TYPE_ID,
    SelectedPeriods: selectedPeriods,
  };

  const submit = () => {
    $.ajax({
      type: "POST",
      url: "/Mobile/GenerateTimeReports",
      data: { data: JSON.stringify(data) },
      dataType: "JSON",
    });
  };

  submit();
};

const deleteTimeReports = () => {
  const findWorkDayIds = () => {
    const findString = "/Mobile/EditTimeReport?workDayId=";
    const foundWorkDayIds = new Set();

    const calendarItems = document.querySelectorAll(
      ".calendar-item[data-active-month='True']"
    );
    for (let i = 0; i < calendarItems.length; i++) {
      const spans = calendarItems[i].querySelectorAll("span");
      for (let j = 0; j < spans.length; j++) {
        const href = spans[j].getAttribute("href");

        if (href) {
          if (href.includes(findString)) {
            const workDayId = href.split(findString);
            foundWorkDayIds.add(workDayId[1]);
          }
        }
      }
    }

    return [...foundWorkDayIds];
  };

  const removeWorkDay = (workDayId) => {
    const test = { workDayId: workDayId };

    $.ajax({
      type: "POST",
      url: "/Mobile/DeleteTimeReport",
      data: { workDayId: workDayId },
      dataType: "JSON",
    });
  };

  const foundWorkDayIds = findWorkDayIds();
  for (let i = 0; i < foundWorkDayIds.length; i++) {
    removeWorkDay(foundWorkDayIds[i]);
  }
};

postTidRapport();

//deleteTimeReports();
