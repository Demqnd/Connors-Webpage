// Show a confirm dialog when the Resume link is clicked
document.addEventListener('DOMContentLoaded', function() {
	var resumeLinks = document.querySelectorAll('a[href*="Resume"]');
	resumeLinks.forEach(function(link) {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			if (confirm('You are about to view Connor’s Resume PDF. Click OK to continue or Cancel to stay on this page.')) {
				window.open(link.href, link.target || '_blank');
			}
			// If Cancel is clicked, do nothing
		});
	});
});
