let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let clearBtn;

if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  show(clearBtn);
  renderActiveNote();
};

// Renders the appropriate buttons based on the state of the form
const handleRenderBtns = () => {
  show(clearBtn);
  if (!noteTitle.value.trim() && !noteText.value.trim()) {
    hide(clearBtn);
  } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', renderActiveNote);
  noteForm.addEventListener('input', handleRenderBtns);
}

getAndRenderNotes();




// DOM Elements
let notesLink;
let notesPage;
let notesList;
let noteTitleInput;
let noteTextInput;
let saveNoteBtn;
let clearFormBtn;
let newNoteBtn;

// Function to show an element
const show = (elem) => {
  elem.style.display = 'block';
};

// Function to hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// Function to initialize the variables
const initializeElements = () => {
  notesLink = document.getElementById('notes-link');
  notesPage = document.getElementById('notes-page');
  notesList = document.getElementById('notes-list');
  noteTitleInput = document.getElementById('note-title');
  noteTextInput = document.getElementById('note-text');
  saveNoteBtn = document.getElementById('save-note');
  clearFormBtn = document.getElementById('clear-form');
  newNoteBtn = document.getElementById('new-note');
};

// Function to show the notes page
const showNotesPage = () => {
  hide(document.getElementById('landing-page'));
  show(notesPage);
};

// Function to handle the display of note elements
const handleNoteElements = () => {
  if (noteTitleInput.value.trim() !== '' || noteTextInput.value.trim() !== '') {
    show(saveNoteBtn);
    show(clearFormBtn);
  } else {
    hide(saveNoteBtn);
    hide(clearFormBtn);
  }
};

// Function to save the entered note
const saveNote = () => {
  const newNote = {
    title: noteTitleInput.value.trim(),
    text: noteTextInput.value.trim()
  };

  // Perform the necessary operations to save the note (e.g., API call, local storage, etc.)
  // After saving the note, update the UI accordingly
  const noteListItem = document.createElement('li');
  noteListItem.textContent = newNote.title;
  noteListItem.addEventListener('click', () => {
    // Display the clicked note in the right-hand column
    noteTitleInput.value = newNote.title;
    noteTextInput.value = newNote.text;
    hide(newNoteBtn);
  });
  notesList.appendChild(noteListItem);

  // Clear the input fields and hide buttons after saving the note
  noteTitleInput.value = '';
  noteTextInput.value = '';
  hide(saveNoteBtn);
  hide(clearFormBtn);
};

document.addEventListener('DOMContentLoaded', () => {
  initializeElements();

  // Show Notes Page when clicking on the notes link
  notesLink.addEventListener('click', () => {
    showNotesPage();
  });

  // Handle input events for note elements
  noteTitleInput.addEventListener('input', handleNoteElements);
  noteTextInput.addEventListener('input', handleNoteElements);

  // Save Note button functionality
  saveNoteBtn.addEventListener('click', () => {
    saveNote();
  });

  // Clear Form button functionality
  clearFormBtn.addEventListener('click', () => {
    noteTitleInput.value = '';
    noteTextInput.value = '';
    hide(saveNoteBtn);
    hide(clearFormBtn);
  });

  // New Note button functionality
  newNoteBtn.addEventListener('click', () => {
    noteTitleInput.value = '';
    noteTextInput.value = '';
    hide(newNoteBtn);
  });
});
