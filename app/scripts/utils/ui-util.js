export default {
	importStyle(url) {
		if (document.querySelector(`link[rel='stylesheet'][href='${url}']`)) {
			return; // already loaded
		}
		this.addMetadata("link", { 
			rel: "stylesheet", 
			href: url 
		});
	},

	hashCode(s) {
		return s.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0);
	},

	importInlineStyle(css) {
		var hashCode = this.hashCode(css);
		if (document.querySelector(`link[rel='stylesheet'][hash-code='${hashCode}']`)) {
			return; // already loaded
		}
		this.addMetadata("style", { 
			textContent: css,
			"hash-code": hashCode
		});
	},

	importScript(url) {
		if (document.querySelector(`script[src='${url}']`)) {
			return; // already loaded
		}
		this.addMetadata("script", {
			src: url 
		});
	},

	configureClient(themeColor) {
		this.addMetadata("meta", { 
			name: "viewport", 
			content: "width=device-width,initial-scale=1"
		});
		this.addMetadata("meta", { 
			name: "theme-color", 
			content: themeColor
		});
		this.addMetadata("meta", { 
			name: "apple-mobile-web-app-capable", 
			content: "yes" // enables full-screen / standalone mode
		});
		this.addMetadata("meta", { 
			name: "apple-mobile-web-app-status-bar-style", 
			content: "black-translucent"
		});
	},

	addMetadata(elementName, properties) {
		const element = document.createElement(elementName);
		for (var propertyName in properties) {
			element[propertyName] = properties[propertyName];
		}
		document.head.appendChild(element);
	}
}