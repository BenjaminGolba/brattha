const formatDate = (year, month, day, time) => {
    const dayWithLeadingZero = day.length === 1 ? "0" + day : day;
    const timeStr = !!time ? " " + time : "";
    
    return year + "-" + month + "-" + dayWithLeadingZero + timeStr;
}

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

            return formatDate("2024", month, day);
        });
        
        return formattedDates;
    }

    const foundDatesToReport = findDates();

    const selectedPeriods = [];
    foundDatesToReport.map((foundDate) => {
        selectedPeriods.push(
        {
            Date: foundDate,
            StartTime: foundDate + " 08:00",
            EndTime: foundDate + " 16:00",
            Mode: "0",
            CommentsFromResource: "",
            CommentsTowardsCustomer: ""
        });
    });

    var data = {
        AssignmentId: "a3411137-3d99-4cb4-97e6-2dc11ca3bf9e",
        TimeTypeId: "54d61563-591b-4ccc-a1c7-ce11e50a3dd1",
        SelectedPeriods: selectedPeriods
    };
    
    const submit = () => {
        $.ajax({
			type: "POST",
			url: "/Mobile/GenerateTimeReports",
			data: {data: JSON.stringify(data)},
			dataType: 'JSON',
		});
    }

    submit();
}

postTidRapport();

const deleteTimeReports = () => {
    const findWorkDayIds = () => {
        const findString = "/Mobile/EditTimeReport?workDayId=";
        const foundWorkDayIds = new Set();
        
        const calendarItems = document.querySelectorAll(".calendar-item[data-active-month='True']");
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
    }
    
    const removeWorkDay = (workDayId) => {
        const test = { workDayId: workDayId };
        
        $.ajax({
            type: "POST",
            url: "/Mobile/DeleteTimeReport",
            data: { workDayId: workDayId },
            dataType: 'JSON',
        });
    }

    const foundWorkDayIds = findWorkDayIds();
    for (let i = 0; i < foundWorkDayIds.length; i++) {
        removeWorkDay(foundWorkDayIds[i]);
    }
}

//deleteTimeReports();
