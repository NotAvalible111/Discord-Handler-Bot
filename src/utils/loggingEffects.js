const color = {
	red: '\x1b[31m',
	orange: '\x1b[38;5;202m',
	yellow: '\x1b[33m',
	green: '\x1b[32m',
	blue: '\x1b[34m',
	pink: '\x1b[38;5;213m',
	torquise: '\x1b[38;5;45m',
	purple: '\x1b[38;5;57m',
	reset: '\x1b[0m'
}

function getTimestamp() {
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = { color, getTimestamp }