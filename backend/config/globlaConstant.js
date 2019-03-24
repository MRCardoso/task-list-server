global.MAX_SIZE_UPLOAD = 3 * 1024 * 1024; // size allow for upload
global.MIME_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'x-png', 'pjpeg']; // extension allow for upload
global.PLATFORM_WEB = 1
global.PLATFORM_MOBILE = 2

global.is400 = (message) => { return { Validator: message } }
global.is401 = (message) => { return { Unauthorized: message } }
global.is403 = (message) => { return { Forbbiden: message } }
global.is404 = (message) => { return { Notfound: message } }