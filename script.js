// Show an alert when the Resume link is clicked
document.addEventListener('DOMContentLoaded', function() {
	var resumeLinks = document.querySelectorAll('a[href*="Resume"]');
	resumeLinks.forEach(function(link) {
		link.addEventListener('click', function(e) {
			alert('You are about to view Connor’s Resume PDF.');
		});
	});
});
// Your JavaScript code goes here