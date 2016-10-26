var input = document.getElementById("SearchText");
var SearchText;

input.addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {
        SearchText = input.value;
        search();
    }
});

input.focus();

function search() {
    console.log("SearchText")
    if (isNaN(SearchText)) {
        var displayResults = document.getElementById('DisplayResults').checked;
        if (displayResults == true) {
            getNotes();
        } else {
            openNoteSearch(SearchText);
        }

    } else {
		openNote(SearchText);
    }
};

function openNoteSearch(SearchTextInput) {
    var newURL = "https://launchpad.support.sap.com/#/solutions/notes/?q=" + SearchTextInput;
    chrome.tabs.create({
        url: newURL
    });
}

function openNote(SearchTextInput) {
    var newURL = "https://launchpad.support.sap.com/#/notes/" + SearchTextInput;
    chrome.tabs.create({
        url: newURL
    });
}

function displayNotes(SAPNoteNumber, SAPNoteTitle, SAPNoteDescription, SAPNoteDate, SAPNoteModule) {
    var SAPNotes = document.getElementById('SAPNotes'),
				contentLoader = document.getElementById('contentLoader');

    var SingleNote = document.createElement('div');
    SingleNote.className = 'SingleNote clearfix';
    SAPNotes.appendChild(SingleNote);
	SingleNote.addEventListener('click', function(){
		openNote(SAPNoteNumber);
	});

    var NoteTitle = document.createElement('div');
    NoteTitle.className = 'NoteTitle';
    NoteTitle.innerHTML = SAPNoteNumber + " - " + SAPNoteTitle;

    var NoteDescription = document.createElement('div');
    NoteDescription.className = 'NoteDescription';
    NoteDescription.innerHTML = SAPNoteDescription;

    var SAPDate = document.createElement('div');
    SAPDate.className = 'SAPDate';
    SAPDate.innerHTML = SAPNoteDate;

    var NoteModule = document.createElement('div');
    NoteModule.className = 'NoteModule';
    NoteModule.innerHTML = SAPNoteModule;

    SingleNote.appendChild(NoteTitle);
    SingleNote.appendChild(SAPDate);
    SingleNote.appendChild(NoteModule);
    SingleNote.appendChild(NoteDescription);
	SAPNotes.style.display="block";
	contentLoader.style.display="none";
};

var xhr = new XMLHttpRequest();

function getNotes() {
    removeAllNotes();

	contentLoader.style.display="block";
	var SearchQuery = "https://launchpad.support.sap.com/services/xse/sap/ags/support_portal/search/services/search_notes.xsjs?q=" + SearchText + "&responsesize=10"
    xhr.open('GET', SearchQuery, true);
    xhr.withCredentials = true;

    xhr.send(null);
    xhr.onreadystatechange = processRequest;
}

function formatSAPNoteDate(SAPDate) {
    var newDateYear = SAPDate.substr(0, 4);
    var newDateMonth = SAPDate.substr(4, 2);
    var newDateDay = SAPDate.substr(6, 2);
    var newDate = newDateDay + "-" + newDateMonth + " " + newDateYear;
    return newDate;
}

function removeAllNotes() {
    var SAPNotesChild = document.getElementById("SAPNotes");
    while (SAPNotesChild.firstChild) {
        SAPNotesChild.removeChild(SAPNotesChild.firstChild);
    }
}

function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
		if (ct = xhr.getResponseHeader("content-type") == "application/json;charset=utf-8")
		{
            var response = JSON.parse(xhr.responseText);
            if(response.d.length>0)
			{
				for (var i = 0; i < response.d.length; i++) {
					var note = response.d[i];
					displayNotes(note.SAPNOTES_NUMBER, decodeURIComponent(note.TITLE), decodeURIComponent(note.LONGTEXT), formatSAPNoteDate(note.LAST_RELEASED_ON), note.THEMK);
					SAPNoteClass = document.getElementsByClassName("SingleNote");
				}
			}
			else
			{
				displayNoNotes();
			}
            console.log(response.number)			
		}
		else
		{
			console.log("Not logged in");
            openNoteSearch(SearchText);
		}


    }
};

function displayNoNotes()
{
	var SingleNote = document.createElement('div');
    SingleNote.className = 'SingleNote clearfix';
    SAPNotes.appendChild(SingleNote);
	var NoteTitle = document.createElement('div');
    NoteTitle.className = 'NoteTitle';
    NoteTitle.innerHTML = "Search did not bring any results";

    var NoteDescription = document.createElement('div');
    NoteDescription.className = 'NoteDescription';
    NoteDescription.innerHTML = "By clicking you will be forwarded to SAP Support Portal";
	
	SingleNote.addEventListener('click', function(){
	openNoteSearch(SearchText);

	});
		SingleNote.appendChild(NoteTitle);
    SingleNote.appendChild(NoteDescription);
	SAPNotes.style.display="block";
	contentLoader.style.display="none";
}
