/* ---------------------------------------------------------------------------- */
/* -- Document ---------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */

function writeHeader() {
	document.write("<div id='header'>");
	document.write("<a href='https://collicalex.github.io/' id='header-logo'>Collicalex</a> <span id='header-logo-tooltip'>&larr; take a look at my other projects made with <span class='heart'>&hearts;</span></span>");
	document.write("<a href='https://www.instagram.com/collicalex'/' id='header-avatar'></a><span id='header-avatar-tooltip2'>See my photo on Instagram &rarr;</span>");
	document.write("</div>");
}

function writeProjectCover() {
	var projectName = document.title;
	document.write("<div id='project-cover'>");
	document.write("<div id='project-title'>"+projectName+"</div>");
	document.write("<div id='project-description'></div>");
	document.write("<div>");
	document.write("<a class='project-button' href='https://github.com/collicalex/"+projectName+"'>View source</a>");
	document.write("<a class='project-button' href='https://github.com/collicalex/"+projectName+"/releases/latest'>Download</a>");
	document.write("</div>");
	
	document.write("<div id='project-version'>");
	document.write("<span id='projectLastVersionNumber'></span><span id='projectLastVersionDate'></span>");
	document.write("</div>");
	
	document.write("</div>");
	
	
}

function writeDownloadSection() {
	var projectName = document.title;
	document.write("<h2>Download</h2>");
	document.write("<p>You can download the latest version of "+projectName+" in the dedicated <a href='https://github.com/collicalex/"+projectName+"/releases/latest'>releases page</a>.");
}

function writeJavaPreRequirementSection() {
	var projectName = document.title;
	document.write("<h2>Pre Requirement</h2>");
	document.write("<p>"+projectName+" is written in JAVA. So it's natively executable on all Operating System (Windows, OsX, Unix/Linux,...). You just need to have a JRE (Java Runtime Environement) installed on your system. Download it <a href='https://www.java.com/download'>here</a>.</p>");
}

function writePreFooter() {
	var projectName = document.title;
	document.write("<h2>Want to contribute?</h2>");
	if (projectName.indexOf('Collicalex') == -1) {
		document.write("<p>You can contribute with "+projectName+" by <a href='https://github.com/collicalex/"+projectName+"/releases'>installing it</a>, using it, take a look at its <a href='https://github.com/collicalex/"+projectName+"'>source code</a> and <a href='https://github.com/collicalex/"+projectName+"/issues'>submitting issues</a> and <a href='https://github.com/collicalex/"+projectName+"/pulls'>pull requests</a> :)</p>");		
	} else {
		document.write("<p>You can contribute to any of my project by installing them, using them, take a look at their source code and submitting issues and pull requests on their dedicated page.</p>");
	}

  
	document.write("<h2>Follow me</h2>");
	document.write("<p>You can follow me:");
	document.write("<ul>");
	document.write("<li>as photographer on <a href='https://www.instagram.com/collicalex'>Instagram</a> and <a href='https://www.flickr.com/photos/colliculus'>Flickr</a></li>");
	document.write("<li>as developer on <a href='https://github.com/collicalex'>GitHub</a></li>");
	document.write("</ul>");
	document.write("</p>");
}

function writeFooter() {
	var projectName = document.title;
	document.write("<div id='footer'>");
	if (projectName.indexOf('Collicalex') == -1) {
		document.write("<div id='footer-title'>"+projectName+"</div>");
	}
	document.write("<div id='footer-author'>Made with <span class='heart'>&hearts;</span> by <a href='https://collicalex.github.io/'>Alexandre Bargeton</a>.</div>");
	document.write("</div>");
}


window.onload = function(e){
	var projectName = document.title;
	if (projectName.indexOf('Collicalex') == -1) {
		getGitHubProject();
	} else {
		getGitHubProjects();
	}
	onloadSlides();
}


/* ---------------------------------------------------------------------------- */
/* -- GitHub API -------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */

function ajax_getJSON(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch(err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };
 
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function getGitHubProjectDescription(userName, projectName) {
	var jsonurl = "https://api.github.com/repos/" + userName + "/" + projectName;
	
	ajax_getJSON(jsonurl, function(data) {
		document.getElementById("project-description").innerHTML = data.description;
	});
}

function grabDateFromISO8601(datetime) {
	return datetime.split("T")[0];
}

function getGitHubProjectLastVersion(userName, projectName) {
	var jsonurl = "https://api.github.com/repos/" + userName + "/" + projectName + "/releases";
	
	ajax_getJSON(jsonurl, function(data) {
		var lastVersionIndex = -1;
		var lastVersionId = 0;
		for (i = 0; i < data.length; ++i) {
			if (data[i].prerelease == false) {
				if (data[i].id > lastVersionId) {
					lastVersionIndex = i;
					lastVersionId = data[i].id;
				}
			}
		}
		if (i > -1) {
			document.getElementById("projectLastVersionNumber").innerHTML = data[lastVersionIndex].name + " (" + data[lastVersionIndex].tag_name + ")";
			document.getElementById("projectLastVersionDate").innerHTML = grabDateFromISO8601(data[lastVersionIndex].published_at);
		}
	});
}

function getGitHubProject() {
	var userName = "collicalex";
	var projectName = document.title;
	getGitHubProjectDescription(userName, projectName);
	getGitHubProjectLastVersion(userName, projectName);
}

function getGitHubProjects() {
	var userName = "collicalex";
	var jsonurl = "https://api.github.com/users/"+userName+"/repos";
	
	ajax_getJSON(jsonurl, function(data) {
		var html = "";
		for (i = 0; i < data.length; ++i) {
			if ((data[i].name.indexOf('collicalex.github.io') == -1) && (data[i].fork == false)) {
				var projectName = document.createElement("div");
				projectName.classList.add('projectName');
				projectName.appendChild(document.createTextNode(data[i].name));

				var projectDescription = document.createElement("div");
				projectDescription.classList.add('projectDescription');
				projectDescription.appendChild(document.createTextNode(data[i].description));

				var homepage = null;
				if (data[i].homepage != null) {
					homepage = document.createElement("a");
					homepage.classList.add('projectButton');
					homepage.title = "Homepage";
					homepage.href = data[i].homepage;
					homepage.appendChild(document.createTextNode("Homepage"));
				}
				
				var source = document.createElement("a");
				source.classList.add('projectButton');
				source.title = "View source";
				source.href = data[i].html_url;
				source.appendChild(document.createTextNode("View source"));
				
				var release = document.createElement("a");
				release.classList.add('projectButton');
				release.title = "Latest Release";
				release.href = "https://github.com/collicalex/"+data[i].name+"/releases/latest";
				release.appendChild(document.createTextNode("Download"));
				
				var buttons = document.createElement("div");
				buttons.classList.add('projectButtons');
				if (homepage != null) {
					buttons.appendChild(homepage);
				}
				buttons.appendChild(source);
				buttons.appendChild(release);
				
				var project = document.createElement("div");
				project.classList.add('project');
				project.appendChild(projectName);
				project.appendChild(projectDescription);
				project.appendChild(buttons);
				
		
				document.getElementById('projects').appendChild(project);
			}
		}
		
	});
}

/* ---------------------------------------------------------------------------- */
/* -- Slideshow --------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */

function onloadSlides() {
	var slideshow = document.getElementsByClassName("slideshow-container");
	for (var i = 0; i < slideshow.length; ++i) {
		addArrowsToSlideShow(slideshow[i]);
		addDotsToSlideshow(slideshow[i]);
		showSlide(slideshow[i], 0);
	}
}

function previousSlide(elt) {
	showSlide(elt, getSlideId(elt)-1);
}

function nextSlide(elt) {
	showSlide(elt, getSlideId(elt)+1);
}

function getSlideId(elt) {
	while (elt.className != "slideshow-container") {
		elt = elt.parentElement;
	}
	var dots = elt.getElementsByClassName("slide-dot");
	for (i = 0; i < dots.length; i++) {
		if (dots[i].className.indexOf("active") !== -1) {
			return i;
		}
	}
	return 0;
}

function showSlide(elt, n) {
	while (elt.className != "slideshow-container") {
		elt = elt.parentElement;
	}
	var i;
	var slides = elt.getElementsByClassName("slide");
	var dots = elt.getElementsByClassName("slide-dot");
	if (n >= slides.length) {n = slides.length-1;}
	if (n < 0) {n=0;}
	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
		dots[i].className = dots[i].className.replace(" active", "");
	}
	slides[n].style.display = "block";
	dots[n].className += " active";
}

function addArrowsToSlideShow(elt) {
	var slides = elt.getElementsByClassName("slideshow-images");
	slides = slides[0];
	slides.innerHTML += "<a class='prev' onclick='previousSlide(this)'>&#10094;</a><a class='next' onclick='nextSlide(this)'>&#10095;</a>";
}

function addDotsToSlideshow(elt) {
	var slides = elt.getElementsByClassName("slide");
	var dotsTxt = "<div style='text-align:center; position:relative; top:-135px'>";
	for (var i = 0; i < slides.length; ++i) {
		dotsTxt += "<span class='slide-dot' onclick='showSlide(this, "+i+")'></span>\r\n";
	}
	dotsTxt += "</div>";
	elt.innerHTML += dotsTxt;
	
	var slidesTxt = elt.getElementsByClassName("slide-text");
	for (var i = 0; i < slidesTxt.length; ++i) {
		slidesTxt[i].style.position = 'relative';
		slidesTxt[i].style.top = '45px';
	}
}
