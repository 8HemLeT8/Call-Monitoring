// alert("TableContent.js is linked");

function startConv() {
    var tr = document.getElementById('openConversations').insertRow();
    var cStart = tr.insertCell(0);
    var cCity = tr.insertCell(1);
    var cTopic = tr.insertCell(2);
    var cLanguage = tr.insertCell(3);
    var cGender = tr.insertCell(4);
    var cAge = tr.insertCell(5);
    var cEnd = tr.insertCell(6);

    const date = Date.now();
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric' })
    const [{ value: month }, , { value: day }, , { value: year }, , { value: hour }, , { value: minute }] = dateTimeFormat.formatToParts(date)

    cStart.innerHTML = "<div id='" + date + "''>" + `${day}-${month}-${year} ,${hour}:${minute}` + "</div>";
    cCity.innerHTML = "<select><option value='jerusalem'>jerusalem</option><option value='naaria'>naaria</option><option value='haifa'>haifa</option><option value='telAviv'>tel aviv</option><option value='ashdod'>ashdod</option><option value='Ashkelon'>Ashkelon</option><option value='beerSheva'>Beer Sheva</option></select>";
    cTopic.innerHTML = "<select><option value='Medical'>Medical</option><option value='drugs'>drugs</option><option value='food'>food</option><option value='water'>water</option><option value='shelter'>shelter</option><option value='information'>information</option><option value='evacuation'>evacuation</option></select>";
    cLanguage.innerHTML = "<select><option value='hebrew'>hebrew</option><option value='english'>english</option><option value='amharic'>amharic</option><option value='russian'>russian</option><option value='arabic'>arabic</option><option value='thai'>thai</option></select>";
    cAge.innerHTML = "<input type='number' min='0' max='120'/>";
    cGender.innerHTML = "<select><option value='male'>male</option><option value='female'>female</option></select>";
    cEnd.innerHTML = "<button class='btn btn-outline-danger' onclick='reportEndCall(this.parentNode.parentNode)'><i class='fas fa-phone-slash'></i> End Call</button>";

    var totalCalls = parseInt(document.getElementById("total").value) || 0;
    document.getElementById("total").value = (++totalCalls) + "";
    
    

}

function reportEndCall(row) {
    var totalCalls = parseInt(document.getElementById("total").value) || 0;
    if (parseInt(totalCalls) > 0) {
        document.getElementById("total").value = (--totalCalls) + "";
    }
    let status = document.getElementById("call status").value;

    let message = {};
    message.id = row.cells[0].getElementsByTagName('div')[0].id;
    message.city = row.cells[1].getElementsByTagName('select')[0].value;
    message.topic = row.cells[2].getElementsByTagName('select')[0].value;
    message.language = row.cells[3].getElementsByTagName('select')[0].value;
    message.gender = row.cells[4].getElementsByTagName('select')[0].value;
    message.age = (row.cells[5].getElementsByTagName('input')[0].value || 18);
    message.totalTime = (parseInt(Date.now()) - parseInt(message.id)) / 1000; // seconds
    message.status = status;
    message.totalCalls=totalCalls;
    socket.emit("callDetails", message);
    deleteRow(row);
}

function deleteRow(row) {
    var i = row.rowIndex;
    document.getElementById('openConversations').deleteRow(i);
}