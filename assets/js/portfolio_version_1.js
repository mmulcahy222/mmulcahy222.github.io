

// function inspect_scroll(e) {
//   current_index = 0;
//   current_top = window.innerHeight + window.scrollY;
//   for (i = 0; i < posts_top_locations.length; i++) {
//     if (current_top < posts_top_locations[i]) {
//       break;
//     }
//     current_index = i;
//   }
//   current_project = top_value_dict[posts_top_locations[current_index]];
//   console.log(current_top, current_project);
//   if(current_project == null)
//   {
//   	//headers & github projects list & posts without a project_name attribute
//   	project_overlay.style.display = 'none';
//   }
//   else
//   {
//   	project_overlay.innerText = 'CURRENTLY VIEWING: ' + current_project;
//   	project_overlay.style.display = 'block';
//   }
// }

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
