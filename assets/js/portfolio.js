function inspect_scroll()
{
	elements = document.elementsFromPoint(window.innerWidth/2,window.innerHeight-1);
	for(i=0;i<elements.length;i++)
	{
	    el = elements[i];
	    project_name = el.getAttribute("project_name");
	    if(project_name != null)
	    {
	        project_overlay.innerText = 'PROJECT: ' + project_name;
			project_overlay.style.display = 'block';
			return;
	    }
	}
	project_overlay.style.display = 'none';
}

addEventListener('scroll', inspect_scroll);
project_overlay = document.querySelector(".project_overlay");
