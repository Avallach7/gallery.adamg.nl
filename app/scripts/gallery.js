import UiUtil from "./utils/ui-util.js"

window.customElements.define('app-gallery', class Gallery extends HTMLHtmlElement {
	thumbnailCache = {}

	constructor() {
		console.log("gallery constructed");
		super();
	}

	connectedCallback() {
		console.log("gallery connected");
		document.addEventListener('DOMContentLoaded', this.load.bind(this), false);
	}

	load() {
		console.log("gallery loading");
		this.addEventListener("contextmenu", this.contextmenuCallback.bind(this), false)
		document.addEventListener("turbolinks:load", this.navigatedCallback.bind(this), false);
		UiUtil.configureClient("#ffffff");
		this.loadFonts();
	}

	navigatedCallback() {
		console.log("navigated");
		this.updateTitleBar();
		this.displayThumbnails();
	}

	contextmenuCallback(mouseEvent) {
		if (mouseEvent.altKey || mouseEvent.ctrlKey || mouseEvent.metaKey || mouseEvent.shiftKey) {
			return;
		}
		mouseEvent.preventDefault();
	}

	loadFonts() {
		UiUtil.importStyle("/app/fonts/open-sans/open-sans.css", this.config);
		UiUtil.importStyle("/app/fonts/ubuntu/ubuntu.css", this.config);
		UiUtil.importStyle("/app/fonts/material-icons/material-icons.css", this.config);
		UiUtil.importStyle("/app/styles/icons.css", this.config);
		UiUtil.importInlineStyle(`
			.top-nav .icon {
				color: transparent;
				font-size: 0px;
			}
			.top-nav .icon::before {
				color: var(--text-color-misc);
				font-size: 24px;
			}
		`);
	}

	updateTitleBar() {
		const titleElement = document.querySelector(".content > .title");
		 if (titleElement.textContent == "") {
			const path = location.pathname.split("/").filter(s => s != "");
			const title = path[path.length-1]
					.replace(/[_-]/g, " ")
					.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
			document.title = title;
			titleElement.textContent = title;
		}
	}

	async displayThumbnails() {
		const promises = [];
		for (var imageLink of document.querySelectorAll(".files a")) {
			// TODO: load one by one and watch for navigation started event to abort
			const finalImageLink = imageLink;
			if (finalImageLink.querySelector("img") != null) {
				continue;
			}
			promises.push((async() => { 
				const label = document.createElement("span");
				label.textContent = finalImageLink.textContent;
				label.className = "label";
				finalImageLink.textContent = "";
				finalImageLink.appendChild(label);

				const imageUrl = finalImageLink.href;
				if (! imageUrl.endsWith(".jpg")) {
					return;
				}
				var thumbUrl;
				if (this.thumbnailCache[imageUrl]) {
					thumbUrl = this.thumbnailCache[imageUrl];
				} else {
					thumbUrl = await this.getThumbnailUrl(imageUrl);
					this.thumbnailCache[imageUrl] = thumbUrl;
				}
				const thumbImg = document.createElement("img");
				thumbImg.src = thumbUrl;
				thumbImg.className = "thumb";
				finalImageLink.appendChild(thumbImg);
				finalImageLink.classList.add("with-thumbnail");
			})());
			if (promises.length > 4) {
				await Promise.all(promises);
			}
		}
		await Promise.all(promises);
	}

	async getThumbnailUrl(imageUrl) {
		const bytesLength = Math.pow(2, 15);
		const thumbHeaders = { headers: { range: "bytes=0-" + (bytesLength-1)} };
		var thumbBytes = await (await fetch(imageUrl + "?bytes=" + bytesLength, thumbHeaders)).blob();
		var arrayBuffer;
		if (thumbBytes.arrayBuffer) {
			arrayBuffer = await thumbBytes.arrayBuffer();
		} else {
			arrayBuffer = await new Response(thumbBytes).arrayBuffer();
		}
		const bytesArray = new Uint8Array(arrayBuffer);
		var start = null;
		var end = null;
		for (var i = 2; i < bytesArray.length; i++) {
			if (bytesArray[i] == 0xFF) {
				if (start == null) {
					if (bytesArray[i + 1] == 0xD8) {
						start = i;
					}
				} else {
					if (bytesArray[i + 1] == 0xD9) {
						end = i+2;
						break;
					}
				}
			}
		}
		if (start != null && end != null) {
			thumbBytes = new Blob([bytesArray.slice(start, end).buffer], {type: "image/jpeg"});
		} else {
			console.warn("thumbnail not found", imageUrl)
		}
		return URL.createObjectURL(thumbBytes);
	}
}, { extends: "html" });


// const gallery = {
// 	thumbnailCache: {},
// 	config: {
// 		THEME_COLOR: "#FFFFFF",
// 		CLIENT_URL: "/appapp",
// 	},

// 	async init() {
// 		console.log("init");
// 		// TODO: Fix blink on navigating
// 		UiUtil.importScript("/scripts/turbolinks.js", this.config);
// 		UiUtil.configureClient(this.config);
// 		this.loadIcons();
// 		this.loadFonts();
// 		this.updateTitleBar();
// 		this.updateFileNames();
// 		this.displayThumbnails();
// 	},

// 	loadIcons() {
// 		UiUtil.addMetadata("link", {
// 			rel: "icon",
// 			href: this.config.CLIENT_URL + "/favicon.ico"
// 		});
// 	},

// 	updateFileNames() {
// 		for (var imageLink of document.querySelectorAll(".files a")) {
// 			imageLink.textContent = imageLink
// 					.textContent
// 					.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
// 		}
// 	},

// 	updateTitleBar() {
// 		const titleElement = document.querySelector(".content > .title");
// 		if (location.pathname == "/") {
// 			document.querySelector(".top-nav").style.display = "none"; 
// 		} else if (titleElement.textContent == "") {
// 			const path = location.pathname.split("/").filter(s => s != "");
// 			const title = path[path.length-1]
// 					.replace(/[_-]/g, " ")
// 					.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
// 			document.title = title;
// 			titleElement.textContent = title;
// 		}
// 	},

// 	async displayThumbnails() {
// 		const promises = [];
// 		for (var imageLink of document.querySelectorAll(".files a")) {
// 			// TODO: load one by one and watch for navigation started event to abort
// 			const finalImageLink = imageLink;
// 			promises.push((async() => { 
// 				const imageUrl = finalImageLink.href;
// 				if (! imageUrl.endsWith(".jpg")) {
// 					return;
// 				}
// 				var thumbUrl;
// 				if (this.thumbnailCache[imageUrl]) {
// 					thumbUrl = this.thumbnailCache[imageUrl];
// 				} else {
// 					thumbUrl = await this.getThumbnailUrl(imageUrl);
// 					this.thumbnailCache[imageUrl] = thumbUrl;
// 				}
// 				const thumbImg = document.createElement("img");
// 				thumbImg.src = thumbUrl;
// 				thumbImg.className = "thumb";
// 				const label = document.createElement("span");
// 				label.textContent = finalImageLink.textContent;
// 				label.className = "label";
// 				finalImageLink.textContent = "";
// 				finalImageLink.appendChild(thumbImg);
// 				finalImageLink.appendChild(label);
// 				finalImageLink.classList.add("with-thumbnail");
// 			})());
// 			if (promises.length > 4) {
// 				await Promise.all(promises);
// 			}
// 		}
// 		await Promise.all(promises);
// 	},

// 	async getThumbnailUrl(imageUrl) {
// 		const bytesLength = Math.pow(2, 15);
// 		const thumbHeaders = { headers: { range: "bytes=0-" + (bytesLength-1)} };
// 		var thumbBytes = await (await fetch(imageUrl + "?bytes=" + bytesLength, thumbHeaders)).blob();
// 		var arrayBuffer;
// 		if (thumbBytes.arrayBuffer) {
// 			arrayBuffer = await thumbBytes.arrayBuffer();
// 		} else {
// 			arrayBuffer = await new Response(thumbBytes).arrayBuffer();
// 		}
// 		const bytesArray = new Uint8Array(arrayBuffer);
// 		var start = null;
// 		var end = null;
// 		for (var i = 2; i < bytesArray.length; i++) {
// 			if (bytesArray[i] == 0xFF) {
// 				if (start == null) {
// 					if (bytesArray[i + 1] == 0xD8) {
// 						start = i;
// 					}
// 				} else {
// 					if (bytesArray[i + 1] == 0xD9) {
// 						end = i+2;
// 						break;
// 					}
// 				}
// 			}
// 		}
// 		if (start != null && end != null) {
// 			thumbBytes = new Blob([bytesArray.slice(start, end).buffer], {type: "image/jpeg"});
// 		} else {
// 			console.warn("thumbnail not found", imageUrl)
// 		}
// 		return URL.createObjectURL(thumbBytes);
// 	}
// };

// gallery.init();
// document.addEventListener("turbolinks:load", gallery.init.bind(gallery));
// window.gallery = gallery;