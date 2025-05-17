const noteForm = document.getElementById('noteForm');
const topicInput = document.getElementById('topic');
const noteInput = document.getElementById('note');
const notesList = document.getElementById('notesList');
const messageDiv = document.getElementById('message');
const body = document.body;
const saveButton = document.querySelector('#noteForm button');

document.addEventListener('DOMContentLoaded', () => {
  // Immediately apply the default blue mode
  document.body.classList.add('blue-mode');

});
// Track current color state
let currentMode = 0; // 0: blue, 1: purple, 2: orange-gray

const searchInput = document.getElementById('searchInput');
let allNotes = [];  // <-- We'll store ALL notes here when we load

async function togglePin(id) {
  try {
    const response = await fetch(`http://localhost:3000/togglePin/${encodeURIComponent(id)}`, {
      method: 'PUT'
    });

    if (response.ok) {
      fetchNotes(); // Refresh the list after toggling
      showMessage('Note pinned/unpinned!', 'success');
    } else {
      showMessage('Failed to pin/unpin note.', 'error');
    }
  } catch (error) {
    console.error('Error pinning/unpinning note:', error);
    showMessage('Error pinning/unpinning note.', 'error');
  }
}

async function deleteNote(id) {
  const confirmDelete = confirm('Are you sure you want to delete this note?');

  if (!confirmDelete) {
    showMessage('Deletion cancelled.', 'error');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/notes/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showMessage('Note deleted successfully!', 'success');
      fetchNotes(); // Reload notes after deleting
    } else {
      showMessage('Failed to delete note.', 'error');
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    showMessage('Error deleting note.', 'error');
  }
}

function removeButtonStyles() {
  document.querySelectorAll('button').forEach(button => {
    button.style.backgroundColor = '';  // Reset background color
    button.style.color = '';  // Reset text color
    button.style.borderColor = '';  // Reset border color
    button.style.textShadow = '';  // Reset text shadow
  });
}

function removeBackgroundStyle() {
  // Remove any background color styles from the body tag
  body.style.backgroundColor = '';  // Reset the background color to default
}



function showMessage(text, type = 'success') {
  messageDiv.textContent = text;
  messageDiv.className = type;

  setTimeout(() => {
    messageDiv.textContent = '';
    messageDiv.className = '';
  }, 3000);
}

function displayNotes(notes) {
  notesList.innerHTML = '';

  notes.sort((a, b) => (b.pin === true) - (a.pin === true));

  notes.forEach(n => {
    const li = document.createElement('li');

    li.innerHTML = `
      <div class="note-content">
        <div>
          <strong>${n.topic}</strong>: ${n.note}
        </div>
        <div class="button-container"></div>
      </div>
      <div class="note-timestamp">
        ${new Date(n.timestamp).toLocaleString()}
      </div>
    `;

    const buttonContainer = li.querySelector('.button-container');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '🗑️'; 
    deleteButton.className = 'delete-btn';
    deleteButton.title = 'Delete Note';
    deleteButton.onclick = () => deleteNote(n.id);

    const pinButton = document.createElement('button');
    pinButton.textContent = n.pin ? '📌' : '📍'; 
    pinButton.className = 'pin-btn';
    pinButton.title = n.pin ? 'Unpin Note' : 'Pin Note';
    pinButton.onclick = () => togglePin(n.id);

    const editButton = document.createElement('button');
    editButton.textContent = '✏️';
    editButton.className = 'edit-btn';
    editButton.title = 'Edit Note';
    editButton.onclick = () => loadNoteForEditing(n);

    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(pinButton);

    li.appendChild(buttonContainer);
    notesList.appendChild(li);
  });
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filteredNotes = allNotes.filter(note =>
    note.topic.toLowerCase().includes(query) || 
    note.note.toLowerCase().includes(query)
  );
  displayNotes(filteredNotes);
});

async function fetchNotes() {
  try {
    const response = await fetch('http://localhost:3000/notes');
    const notes = await response.json();

    allNotes = notes.sort((a, b) => {
      if (a.pin && !b.pin) return -1;
      if (!a.pin && b.pin) return 1;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    displayNotes(allNotes);
    localStorage.setItem('carrierNotesBackup', JSON.stringify(allNotes));
  } catch (error) {
    console.error('Error fetching notes:', error);
    const backup = localStorage.getItem('carrierNotesBackup');
    if (backup) {
      allNotes = JSON.parse(backup);
      displayNotes(allNotes);
      showMessage('Loaded notes from backup.', 'error');
    } else {
      showMessage('Failed to load notes.', 'error');
    }
  }
}

let editMode = false;
let editNoteId = null;

function loadNoteForEditing(note) {
  topicInput.value = note.topic;
  noteInput.value = note.note;
  editMode = true;
  editNoteId = note.id;
  document.querySelector('#noteForm button').textContent = 'Save Changes';
}

noteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const topic = topicInput.value.trim();
  const note = noteInput.value.trim();

  if (!topic || !note) {
    showMessage('Both Topic and Note are required.', 'error');
    return;
  }

  let response;

  try {
    if (editMode && editNoteId) {
      response = await fetch(`http://localhost:3000/notes/${encodeURIComponent(editNoteId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic, note })
      });
    } else {
      response = await fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic, note })
      });
    }

    if (response.ok) {
      const savedNote = await response.json();
      console.log('Saved Note:', savedNote);
      topicInput.value = '';
      noteInput.value = '';
      editMode = false;
      editNoteId = null;
      document.querySelector('#noteForm button').textContent = 'Save';
      showMessage('Note saved successfully!', 'success');
      fetchNotes();
    } else {
      showMessage('Failed to save/update note.', 'error');
      console.error('Failed to save/update note.');
    }
  } catch (error) {
    console.error('Error saving/updating note:', error);
    showMessage('Error saving/updating note.', 'error');
  }
});

fetchNotes();
const toggleBtn = document.getElementById('toggleTheme');

// Starting state (blue)
toggleBtn.style.backgroundColor = '#4ac1ff'; // Blue button
toggleBtn.style.color = '#ffffff'; // White text
toggleBtn.textContent = 'Toggle Templar Mode';

toggleBtn.addEventListener('click', () => {
  

  // Cycle modes
  currentMode = (currentMode + 1) % 3; // 0 -> 1 -> 2 -> 0

  if (currentMode === 0) {
    // Blue Mode - No change, stays exactly the same
    removeBackgroundStyle();
    document.documentElement.style.setProperty('--primary-color', '#4ac1ff'); // Blue
    toggleBtn.style.backgroundColor = '#4ac1ff'; // Blue button
    toggleBtn.textContent = 'Toggle Templar Mode';
    body.classList.add('blue-mode');
    body.classList.remove('purple-mode', 'orange-gray-mode');
    body.style.color = '#d1d1d1'; // Default text color
    document.querySelectorAll('.note-content').forEach(note => {
      note.style.backgroundColor = ''; // Default gray for note containers
      note.style.color = '#d1d1d1'; // Default text color  
    });
    ///document.querySelectorAll('.delete-btn, .pin-btn, .edit-btn').forEach(button => {
      ///button.style.color = '#4ac1ff'; // Blue button text color
    ///});
    document.querySelector('textarea#note').style.backgroundColor = '#222';  // Dark background for the text box
    document.querySelector('textarea#note').style.color = '#eee';  // Light text inside the text box
    document.querySelector('input#topic').style.backgroundColor = '#222';  // Dark background for the text box
    document.querySelector('input#topic').style.color = '#eee';  // Light text inside the text box
    document.querySelector('input#searchInput').style.backgroundColor = '#222';  // Dark background for the text box
    document.querySelector('input#searchInput').style.color = '#eee';  // Light text inside the text box
    document.querySelectorAll('button, button#toggleTheme, .delete-btn, .edit-btn, .pin-btn').forEach(button => {style.backgroundColor = '#4ac1ff';
    ///button.style.color = '#fffff';
    });
  } else if (currentMode === 1) {
    // Darker/Purple Mode - Fixed purple colors
    removeBackgroundStyle();
    removeButtonStyles();  // Ensure button styles are removed before applying new ones
    document.documentElement.style.setProperty('--primary-color', '#800080'); // Purple
    toggleBtn.style.backgroundColor = '#800080'; // Purple button
    toggleBtn.textContent = 'Toggle Orbital Mode';
    body.classList.add('purple-mode');  // Apply dark purple mode
    body.classList.remove('orange-gray-mode', 'blue-mode');  // Remove other modes
  
    
  

  
    // Set the note container background to very dark purple (almost black)
    document.querySelectorAll('.note-content').forEach(note => {
      note.style.backgroundColor = ''; // Very dark purple (almost black)
    });
  
    // Set the text color for the note content to the correct light color
    body.style.color = '#d1d1d1'; // Light text color for purple mode
  

  
    // Update textareas and inputs for purple mode
    document.querySelector('textarea#note').style.backgroundColor = '#2c2f33';  // Dark purple background for the text box
    document.querySelector('textarea#note').style.color = '#d1d1d1';  // Light text inside the text box
    document.querySelector('input#topic').style.backgroundColor = '#2c2f33';  // Dark purple background for the text box
    document.querySelector('input#topic').style.color = '#d1d1d1';  // Light text inside the text box
    document.querySelector('input#searchInput').style.backgroundColor = '#2c2f33';  // Dark purple background for the text box
    document.querySelector('input#searchInput').style.color = '#d1d1d1';  // Light text inside the text box
  

    
  } else if (currentMode === 2) {
    // Orange & Gray Mode - Apply light gray to the whole page, with orange text and buttons
    removeBackgroundStyle();
    document.documentElement.style.setProperty('--primary-color', '#FF5733'); // Reddish Orange
    toggleBtn.style.backgroundColor = '#FF5733'; // Reddish Orange button
    toggleBtn.textContent = 'Toggle Carrier Mode';
    body.classList.add('orange-gray-mode');
    body.classList.remove('purple-mode', 'blue-mode');
    body.style.color = '#212121'; // Dark gray text
    document.querySelectorAll('.note-content').forEach(note => {
      note.style.backgroundColor = ''; // Lighter gray background for note containers
      note.style.color = '#FF5733'; // Orange text inside note content
    });
    ///document.querySelectorAll('.delete-btn, .pin-btn, .edit-btn').forEach(button => {
      ///button.style.color = '#FF5733'; // Reddish Orange button text color
    ///});
    toggleBtn.style.color = '#ffffff'; // White text on toggle button
  }
});  
