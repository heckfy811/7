let notes = JSON.parse(localStorage.getItem('notes')) || [];
let editingId = null;

function updateNotesList() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.innerHTML = `
            <div>${note.text}</div>
            <div class="note-actions">
                <button onclick="editNote('${note.id}')">Редактировать</button>
                <button onclick="deleteNote('${note.id}')">Удалить</button>
            </div>
        `;
        notesList.appendChild(noteElement);
    });
}

function saveNote() {
    const noteText = document.getElementById('note-text').value.trim();
    if (!noteText) return;

    if (editingId !== null) {
        notes = notes.map(note => 
            note.id === editingId ? { ...note, text: noteText } : note
        );
        editingId = null;
        document.getElementById('save-button').textContent = 'Добавить';
    } else {
        notes.push({
            id: Date.now().toString(),
            text: noteText
        });
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    document.getElementById('note-text').value = '';
    updateNotesList();
}

function editNote(id) {
    const note = notes.find(note => note.id === id);
    if (note) {
        document.getElementById('note-text').value = note.text;
        editingId = id;
        document.getElementById('save-button').textContent = 'Сохранить';
    }
}

function deleteNote(id) {
    if (confirm('Удалить заметку?')) {
        notes = notes.filter(note => note.id !== id);
        localStorage.setItem('notes', JSON.stringify(notes));
        updateNotesList();
    }
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

function updateNetworkStatus() {
    const statusElement = document.getElementById('offline-status');
    statusElement.classList.toggle('visible', !navigator.onLine);
}

updateNetworkStatus();
updateNotesList();