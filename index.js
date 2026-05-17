const salles = [
    { id: 1, nom: 'Salle A', capacite: 20, equipements: 'Projecteur, Tableau blanc' },
    { id: 2, nom: 'Salle B', capacite: 10, equipements: 'TV, Climatisation' },
    { id: 3, nom: 'Salle C', capacite: 30, equipements: 'Projecteur, Tableau interactif' },
    { id: 4, nom: 'Salle Réunion VIP', capacite: 15, equipements: 'Écran géant, Visioconférence' },
    { id: 5, nom: 'Open Space Meeting', capacite: 8, equipements: 'Table ronde, WiFi' }
];

const employes = [
    { id: 1, nom: 'Ahmed Benali', email: 'ahmed@entreprise.com', departement: 'Informatique' },
    { id: 2, nom: 'Sara El Amrani', email: 'sara@entreprise.com', departement: 'Marketing' },
    { id: 3, nom: 'Youssef Alaoui', email: 'youssef@entreprise.com', departement: 'Finance' },
    { id: 4, nom: 'Imane Tazi', email: 'imane@entreprise.com', departement: 'RH' },
    { id: 5, nom: 'Karim Naciri', email: 'karim@entreprise.com', departement: 'Développement' }
];

let reservations = [
    { id: 2, salle_id: 1, employe_id: 1, date_reservation: '2026-04-12', heure_debut: '10:00:00', heure_fin: '11:30:00', titre: 'Réunion projet', statut: 'confirmee' },
    { id: 3, salle_id: 2, employe_id: 2, date_reservation: '2026-04-12', heure_debut: '11:00:00', heure_fin: '12:30:00', titre: 'Présentation marketing', statut: 'en_attente' },
    { id: 4, salle_id: 3, employe_id: 3, date_reservation: '2026-04-13', heure_debut: '14:00:00', heure_fin: '16:00:00', titre: 'Formation interne', statut: 'confirmee' },
    { id: 5, salle_id: 4, employe_id: 4, date_reservation: '2026-04-14', heure_debut: '10:00:00', heure_fin: '11:00:00', titre: 'Entretien RH', statut: 'annulee' },
    { id: 6, salle_id: 5, employe_id: 5, date_reservation: '2026-04-15', heure_debut: '15:00:00', heure_fin: '17:00:00', titre: 'Sprint planning', statut: 'confirmee' }
];

const filterDate = document.querySelector('#filter-date');
const filterRoom = document.querySelector('#filter-room');
const refreshButton = document.querySelector('#refresh-schedule');
const scheduleTable = document.querySelector('#schedule-table');
const weekLabel = document.querySelector('#week-label');
const roomSelect = document.querySelector('#room');
const employeeSelect = document.querySelector('#employee');
const statusSelect = document.querySelector('#status');
const reservationTableBody = document.querySelector('#reservations-table tbody');
const form = document.querySelector('#booking-form');
const message = document.querySelector('#form-message');

function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day + 6) % 7;
    d.setDate(d.getDate() - diff);
    return d;
}

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function padTime(value) {
    return value.toString().padStart(2, '0');
}

function timeStringToMinutes(time) {
    const [hh, mm] = time.split(':').map(Number);
    return hh * 60 + mm;
}

function isConflict(newReservation) {
    const start = timeStringToMinutes(newReservation.heure_debut);
    const end = timeStringToMinutes(newReservation.heure_fin);

    return reservations.some((existing) => {
        if (existing.salle_id !== newReservation.salle_id) return false;
        if (existing.date_reservation !== newReservation.date_reservation) return false;
        if (existing.statut === 'annulee') return false;

        const existingStart = timeStringToMinutes(existing.heure_debut);
        const existingEnd = timeStringToMinutes(existing.heure_fin);

        return start < existingEnd && end > existingStart;
    });
}

function renderRoomOptions() {
    filterRoom.innerHTML = ['<option value="all">Toutes les salles</option>', ...salles.map((salle) => `<option value="${salle.id}">${salle.nom}</option>`)].join('');
    roomSelect.innerHTML = salles.map((salle) => `<option value="${salle.id}">${salle.nom}</option>`).join('');
}

function renderEmployeeOptions() {
    employeeSelect.innerHTML = employes.map((employe) => `<option value="${employe.id}">${employe.nom} (${employe.departement})</option>`).join('');
}

function getWeekDates(startDate) {
    const monday = getMonday(startDate);
    return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

function renderSchedule() {
    const selectedDate = filterDate.value ? new Date(filterDate.value) : new Date();
    const weekDates = getWeekDates(selectedDate);
    const selectedRoomId = filterRoom.value === 'all' ? null : Number(filterRoom.value);
    const roomsToShow = selectedRoomId ? salles.filter((room) => room.id === selectedRoomId) : salles;

    weekLabel.textContent = `${formatDate(weekDates[0])} → ${formatDate(weekDates[6])}`;

    const timeslots = [];
    for (let hour = 8; hour <= 18; hour += 1) {
        timeslots.push(`${padTime(hour)}:00`);
        if (hour < 18) timeslots.push(`${padTime(hour)}:30`);
    }

    const headerHtml = ['<tr>', '<th>Heure</th>', ...roomsToShow.map((room) => `<th>${room.nom}</th>`), '</tr>'].join('');
    scheduleTable.querySelector('thead').innerHTML = headerHtml;

    const bodyRows = timeslots.map((time) => {
        const cells = roomsToShow.map((room) => {
            const slotEvents = reservations.filter((reservation) => {
                const start = reservation.heure_debut.slice(0, 5);
                const end = reservation.heure_fin.slice(0, 5);
                const isSameRoom = reservation.salle_id === room.id;
                const isSameWeek = reservation.date_reservation >= formatDate(weekDates[0]) && reservation.date_reservation <= formatDate(weekDates[6]);
                return isSameRoom && isSameWeek && reservation.statut !== 'annulee' && time >= start && time < end;
            });
            if (slotEvents.length === 0) {
                return '<td class="empty">Libre</td>';
            }
            const event = slotEvents[0];
            const employee = employes.find((emp) => emp.id === event.employe_id);
            return `<td class="busy"><strong>${event.titre}</strong><br><small>${employee ? employee.nom : 'Employé inconnu'}</small><br><span>${event.heure_debut.slice(0,5)} - ${event.heure_fin.slice(0,5)}</span></td>`;
        });
        return `<tr><td>${time}</td>${cells.join('')}</tr>`;
    }).join('');

    scheduleTable.querySelector('tbody').innerHTML = bodyRows;
}

function renderReservationList() {
    const selectedRoomId = filterRoom.value === 'all' ? null : Number(filterRoom.value);
    const selectedDate = filterDate.value || null;

    const filtered = reservations
        .filter((reservation) => {
            if (selectedRoomId && reservation.salle_id !== selectedRoomId) return false;
            if (selectedDate && reservation.date_reservation !== selectedDate) return false;
            return true;
        })
        .sort((a, b) => a.date_reservation.localeCompare(b.date_reservation) || a.heure_debut.localeCompare(b.heure_debut));

    reservationTableBody.innerHTML = filtered.map((reservation) => {
        const room = salles.find((salle) => salle.id === reservation.salle_id);
        const employee = employes.find((emp) => emp.id === reservation.employe_id);
        return `<tr><td>${room ? room.nom : '---'}</td><td>${employee ? employee.nom : '---'}</td><td>${reservation.date_reservation}</td><td>${reservation.heure_debut.slice(0,5)}</td><td>${reservation.heure_fin.slice(0,5)}</td><td><span class="status-${reservation.statut}">${reservation.statut.replace('_', ' ')}</span></td></tr>`;
    }).join('');
}

function showMessage(text, type = 'success') {
    message.textContent = text;
    message.className = `message ${type}`;
}

function clearMessage() {
    message.textContent = '';
    message.className = 'message';
}

function validateReservation(data) {
    if (data.heure_debut >= data.heure_fin) {
        return 'L’heure de fin doit être après l’heure de début.';
    }
    if (data.date_reservation < formatDate(new Date())) {
        return 'Vous ne pouvez pas réserver une date passée.';
    }
    if (isConflict(data)) {
        return 'Conflit détecté : la salle est déjà réservée à cette heure.';
    }
    return null;
}

function initialize() {
    renderRoomOptions();
    renderEmployeeOptions();

    const today = new Date();
    filterDate.value = formatDate(today);
    document.querySelector('#date').value = formatDate(today);

    renderSchedule();
    renderReservationList();

    refreshButton.addEventListener('click', (event) => {
        event.preventDefault();
        renderSchedule();
        renderReservationList();
        clearMessage();
    });

    filterRoom.addEventListener('change', () => {
        renderSchedule();
        renderReservationList();
    });

    filterDate.addEventListener('change', () => {
        renderSchedule();
        renderReservationList();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const reservationData = {
            id: reservations.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1,
            salle_id: Number(roomSelect.value),
            employe_id: Number(employeeSelect.value),
            date_reservation: document.querySelector('#date').value,
            heure_debut: `${document.querySelector('#start').value}:00`,
            heure_fin: `${document.querySelector('#end').value}:00`,
            titre: document.querySelector('#title').value.trim(),
            statut: statusSelect.value
        };
        const validationError = validateReservation(reservationData);
        if (validationError) {
            showMessage(validationError, 'error');
            return;
        }
        reservations.push(reservationData);
        renderSchedule();
        renderReservationList();
        form.reset();
        document.querySelector('#date').value = filterDate.value;
        statusSelect.value = 'en_attente';
        showMessage('Réservation ajoutée avec succès.', 'success');
    });
}

initialize();
